import io
import json
import uuid
import base64
import tempfile
import google.generativeai as genai

from PIL import Image
from ..firebase import db
from google.cloud import firestore
from django.core.files.base import File
from typing import Optional, List, Dict, Any
from ..secret_accesser import access_specific_secret
from tenacity import retry, stop_after_attempt, wait_exponential

setup_path = 'app/static/setup_prompt.txt'

class GeminiChatManager:
    def __init__(self, session_id: Optional[str] = None):
        """Initialize the chat manager with optional session ID."""
        # Get Gemini API key from Firestore secrets
        secret_json = access_specific_secret("superhero-06-02-secret2")
        self.api_key = json.loads(secret_json)['gemini_key']
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash-002')
        self.chat = self.model.start_chat()
        
        self.superhero_ref = db.collection('superhero-06-02')

        if session_id:
            self.session_id = session_id
            self.session_ref = self.superhero_ref.document(self.session_id)
            # Check if session exists
            if not self.session_ref.get().exists:
                raise ValueError(f"Session ID {self.session_id} does not exist.")
        else:
            # Create a new session
            self.session_id = str(uuid.uuid4())
            self.session_ref = self.superhero_ref.document(self.session_id)
            self.session_ref.set({
                'session_id': self.session_id,
                'name': 'New Chat',
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_activity': firestore.SERVER_TIMESTAMP
            })
        
        # Send setup prompt
        with open(setup_path, 'r') as file:
            setup_prompt = file.read()
        self.send_message(message=setup_prompt, is_setup=True)

    def _prepare_files_for_gemini(self, files: List[Any]) -> List[Any]:
        """
        Convert file-like objects to the format expected by Gemini using genai.upload_file.
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
        """
        try:
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
                            "error": f"Error processing file {file.name}: {str(e)}"
                        }
            message_data['attachments'] = base64_images
            
            messages_ref = self.session_ref.collection('messages')
            messages_ref.add(message_data)

            # Update last_activity timestamp
            self.session_ref.update({'last_activity': firestore.SERVER_TIMESTAMP})

            return {
                "success": True,
                "message_id": str(uuid.uuid4()),  # Firestore auto-generates IDs; here for consistency
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
        """Send a message to Gemini and store in Firestore."""
        try:
            if is_setup:
                self.chat.send_message(message)

                response_message = {
                    'message_type': 'ASSISTANT',
                    'content': "Setup complete",
                    'timestamp': firestore.SERVER_TIMESTAMP,
                    'attachments': []
                }
                                    
                messages_ref = self.session_ref.collection('messages')
                messages_ref.add(response_message)

                # Update last_activity timestamp
                self.session_ref.update({'last_activity': firestore.SERVER_TIMESTAMP})
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
                
                response_message = {
                    'message_type': 'ASSISTANT',
                    'content': gemini_response.text,
                    'timestamp': firestore.SERVER_TIMESTAMP,
                    'attachments': []
                }

                messages_ref = self.session_ref.collection('messages')
                messages_ref.add(response_message)

                # Update last_activity timestamp
                self.session_ref.update({'last_activity': firestore.SERVER_TIMESTAMP})

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
                formatted_message = {
                    "type": message_data.get('message_type', ''),
                    "content": message_data.get('content', ''),
                    "timestamp": message_data.get('timestamp'),
                    "attachments": message_data.get('attachments', [])
                }
                
                history.append(formatted_message)
            
            return history
        except Exception as e:
            print("Error retrieving chat history:", str(e))
            return {"error": str(e)}

    def delete_session(self):
        """Delete the current chat session and all associated data."""
        try:
            self.delete_collection(self.superhero_ref, batch_size=10)
            print(f"Session {self.session_id} and all its data have been deleted.")
        except Exception as e:
            print(f"Error deleting session {self.session_id}: {str(e)}")

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

    # Additional Session Management Methods

    def create_session(self, name: str = 'New Chat') -> Dict[str, Any]:
        """Create a new chat session."""
        try:
            new_session_id = str(uuid.uuid4())
            new_session_ref = self.superhero_ref.document(new_session_id)
            new_session_ref.set({
                'session_id': new_session_id,
                'name': name,
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_activity': firestore.SERVER_TIMESTAMP
            })
            return {
                "success": True,
                "session_id": new_session_id,
                "name": name,
                "created_at": firestore.SERVER_TIMESTAMP  # Placeholder; actual timestamp is set by Firestore
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def delete_session_by_id(self, session_id: str) -> Dict[str, Any]:
        """Delete a chat session by its ID."""
        try:
            session_ref = self.superhero_ref.document(session_id)
            if not session_ref.get().exists:
                return {
                    "success": False,
                    "error": f"Session ID {session_id} does not exist."
                }
            # Delete the session and its subcollections
            self.delete_collection(session_ref, batch_size=10)
            return {
                "success": True,
                "message": f"Session {session_id} deleted successfully."
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_sessions(self) -> List[Dict[str, Any]]:
        """Retrieve all active chat sessions."""
        try:
            sessions = self.superhero_ref.order_by('created_at', direction=firestore.Query.DESCENDING).stream()
            session_list = []
            for session in sessions:
                session_data = session.to_dict()
                session_list.append({
                    "session_id": session_data.get('session_id', ''),
                    "name": session_data.get('name', ''),
                    "created_at": session_data.get('created_at'),
                    "last_activity": session_data.get('last_activity')
                })
            return session_list
        except Exception as e:
            print("Error retrieving sessions:", str(e))
            return {"error": str(e)}

    def update_session_name(self, session_id: str, new_name: str) -> Dict[str, Any]:
        """Update the name of a chat session."""
        try:
            session_ref = self.superhero_ref.document(session_id)
            if not session_ref.get().exists:
                return {
                    "success": False,
                    "error": f"Session ID {session_id} does not exist."
                }
            session_ref.update({
                'name': new_name,
                'last_activity': firestore.SERVER_TIMESTAMP
            })
            return {
                "success": True,
                "message": f"Session {session_id} renamed to {new_name}."
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
