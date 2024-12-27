import uuid
import tempfile
from typing import Optional, List, Dict, Any
from django.core.files.base import File
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential
from ..firebase import db
from google.cloud import firestore
from PIL import Image
import base64
import io
from django.conf import settings
from ..secret_accesser import access_specific_secret
import json

setup_path = 'app/static/setup_prompt.txt'

class GeminiChatManager:
    def __init__(self, session_id: Optional[str] = None):
        """Initialize the chat manager with optional session ID."""
        #Get gemini key from firestore
        
        secret_json = access_specific_secret("superhero-06-02-secret2")
        self.api_key = json.loads(secret_json)['gemini_key']
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash-002')
        self.chat = self.model.start_chat()
        
        self.superhero_ref = db.collection('superhero-06-02')

        if(session_id):    
            self.session_id = session_id
            self.session_ref = self.superhero_ref.document(self.session_id)
        else:
            self.session_id = "session1"
            self.session_ref = self.superhero_ref.document(self.session_id)
            self.session_ref.set({'session_id': self.session_id})
        
        with open(setup_path, 'r') as file:
            setup_prompt = file.read()
        self.send_message(
            message=setup_prompt,
            is_setup=True)

    def _prepare_files_for_gemini(self, files: List[Any]) -> List[Any]:
        """
        Convert file-like objects to the format expected by Gemini using genai.upload_file.

        Args:
            files (List[Any]): List of file-like objects to be uploaded.

        Returns:
            List[Any]: List of uploaded file objects from Gemini.
        """
        prepared_files = []

        for file in files:
            # Save the file-like object to a temporary file
            with tempfile.NamedTemporaryFile(delete=True, suffix=file.name) as temp_file:
                # Write content to the temp file
                temp_file.write(file.read())
                temp_file.flush()  # Ensure all content is written

                # Upload the file using its path
                prepared_file = genai.upload_file(temp_file.name)
                prepared_files.append(prepared_file)

                # Reset the file pointer for the original file object
                file.seek(0)

        return prepared_files
                
    def add_manual_message(
        self,
        content: str,
        message_type: str,
        files: Optional[List[File]] = None,
    ) -> Dict[str, Any]:
        """
        Manually add a message to the chat history.
        
        Args:
            content: The message content
            message_type: Type of message (USER, ASSISTANT, SYSTEM, etc.)
            files: Optional list of file attachments
            timestamp: Optional specific timestamp for the message
        
        Returns:
            Dict containing success status and message details
        """
        try:
            # Create message with optional timestamp
            message_data = {
                'message_type': message_type,
                'content': content,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'attachments': []
            }

            base64_images = []
            # Handle any file attachments
            if files:
                for file in files:
                    try:
                        # Clone the file buffer
                        original_buffer = io.BytesIO(file.read())
                        original_buffer.seek(0)
                        file.seek(0)
                        with Image.open(original_buffer) as img:
                            img = img.resize((100, 100), Image.Resampling.LANCZOS)

                            if img.mode != 'RGB':
                                img = img.convert('RGB')

                            buffer = io.BytesIO()
                            img.save(buffer, format="JPEG", quality=85)  
                            
                            buffer.seek(0)

                            encoded_image = base64.b64encode(buffer.read()).decode('utf-8')
                            base64_images.append(encoded_image)
                    except Exception as e:
                        return {
                            "success": False,
                            "error": str(e)
                        }
            message_data['attachments'] = base64_images
            
            messages_ref = self.session_ref.collection('messages')
            messages_ref.add(message_data)
            return {
                "success": True,
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry_error_callback=lambda _: {"error": "Rate limit exceeded"}
    )
    def send_message(
    self, 
        message: str, 
        files: Optional[List[Any]] = None,  # Accept file-like objects
        is_setup: bool = False
    ) -> Dict[str, Any]:
        """Send a message to Gemini and store in database."""
        try:
            if is_setup:
                self.chat.send_message(message)

                resonse_message = {
                    'message_type': 'ASSISTANT',
                    'content': "Setup complete",
                    'timestamp': firestore.SERVER_TIMESTAMP,
                    'attachments': []
                }
                                    
                messages_ref = self.session_ref.collection('messages')
                messages_ref.add(resonse_message)
            else:
                # Handle file attachments
                gemini_files = []
                if files:
                    # Prepare files for Gemini
                    gemini_files = self._prepare_files_for_gemini(files)

                # Send message to Gemini with any attached files
                if gemini_files:
                    # For messages with files, we need to send them together
                    gemini_response = self.chat.send_message([message, *gemini_files])
                else:
                    # For text-only messages
                    gemini_response = self.chat.send_message(message)
                
                resonse_message = {
                    'message_type':'ASSISTANT',
                    'content':gemini_response.text,
                    'timestamp':firestore.SERVER_TIMESTAMP,
                    'attachments': []
                }

                messages_ref = self.session_ref.collection('messages')
                messages_ref.add(resonse_message)

            return {
                "success": True,
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_chat_history(self) -> List[Dict[str, Any]]:
        """Retrieve complete chat history for the session."""
        try:
            messages_ref = self.session_ref.collection('messages')
            messages = messages_ref.order_by('timestamp').stream()
            
            history = []
            
            for message in messages:
                message_data = message.to_dict()
                message ={
                    "type": message_data['message_type'],
                    "content": message_data['content'],
                    "timestamp": message_data['timestamp'],
                    "attachments": message_data['attachments']
                }
                
                history.append(message)
            
            return history
        except Exception as e:
            print("error", str(e))
            return {"error": str(e)}

    def delete_session(self):
        """Delete the current chat session and all associated data."""
        # self.session.delete()

    def delete_collection(self, coll_ref, batch_size):
        docs = coll_ref.limit(batch_size).stream()
        deleted = 0

        for doc in docs:
            print(f"Deleting document {doc.id} and its subcollections...")
            self._delete_document_with_subcollections(doc.reference)
            deleted += 1

        if deleted >= batch_size:
            # Recursively delete the next batch of documents
            self.delete_collection(coll_ref, batch_size)

    def _delete_document_with_subcollections(self, doc_ref):
        # Get all subcollections of the document
        subcollections = doc_ref.collections()
        for subcoll in subcollections:
            print(f"Deleting subcollection {subcoll.id} of document {doc_ref.id}...")
            self.delete_collection(subcoll, batch_size=10)  # Recursively delete subcollection

        # Delete the document itself
        print(f"Deleting document {doc_ref.id}")
        doc_ref.delete()