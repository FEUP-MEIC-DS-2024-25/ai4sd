from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

class Response(BaseModel):
    id: str
    ai_response: str
    created_at: datetime

    @classmethod
    def from_firestore(cls, doc: firestore.DocumentSnapshot):
        data = doc.to_dict()
        data["id"] = doc.id
        data["ai_response"] = data["ai_response"]
        data["created_at"] = data["created_at"].isoformat()
        return cls(**data)

class FirestoreRef(BaseModel):
    reference_id: str  

    @classmethod
    def from_firestore(cls, ref: firestore.DocumentReference):
        return cls(reference_id=ref.path) 

    def to_firestore_ref(self):
        return db.document(self.reference_id) 

class Prompt(BaseModel):
    id: str  
    created_at: datetime
    response: Optional[FirestoreRef]  
    user_input: str

    @classmethod
    def from_firestore(cls, doc: firestore.DocumentSnapshot):
        data = doc.to_dict()
        data["id"] = doc.id  
        data["created_at"] = data["created_at"].isoformat()  
        if "response" in data and isinstance(data["response"], firestore.DocumentReference):
            data["response"] = FirestoreRef.from_firestore(data["response"])
        return cls(**data)

class Chat(BaseModel):
    id: str 
    name: str
    prompts: List[FirestoreRef]
    created_at: datetime

    @classmethod
    def from_firestore(cls, doc: firestore.DocumentSnapshot):
        data = doc.to_dict()
        data["id"] = doc.id 
        data["prompts"] = [FirestoreRef.from_firestore(ref) for ref in data.get("prompts", [])]
        data["created_at"] = data["created_at"].isoformat()  
        return cls(**data)

app = FastAPI()


"""

CREATE ENDPOINTS

"""

@app.post("/create_chat")
async def create_chat(chat: Chat):
    """
    Endpoint to create a new chat in Firestore.
    """
    try:
        collection_ref = db.collection("req2test").document("development").collection("chats")

        # Prepare chat data
        chat_data = chat.dict(exclude={"id"})  
        chat_data["created_at"] = datetime.now()  

        prompts_as_refs = []
        for prompt in chat.prompts:
            prompt_ref = db.document(prompt.reference_id)
            if not prompt_ref.get().exists:
                return {
                    "error": f"Prompt with reference ID '{prompt.reference_id}' does not exist"
                }
            prompts_as_refs.append(prompt_ref)

        chat_data["prompts"] = prompts_as_refs  

        new_doc_ref = collection_ref.add(chat_data)  
        return {"success": True, "message": "Chat created successfully", "id": new_doc_ref[1].id}

    except Exception as e:
        return {"error": f"An error occurred while creating the chat: {str(e)}"}

@app.post("/create_prompt")
async def create_prompt(prompt: Prompt):
    """
    Endpoint to create a new prompt in Firestore.
    """
    try:
        # Firestore collection reference for the prompts
        collection_ref = db.collection("req2test").document("development").collection("prompts")

        # Prepare prompt data
        prompt_data = prompt.dict(exclude={"id"})  # Exclude the `id` field, as Firestore will generate it
        prompt_data["created_at"] = datetime.now()  # Ensure `created_at` is a Firestore-compatible timestamp

        # Convert the response to a Firestore reference
        if prompt.response:
            response_ref = db.document(prompt.response.reference_id)
            if not response_ref.get().exists:
                return {
                    "error": f"Response with reference ID '{prompt.response.reference_id}' does not exist"
                }
            prompt_data["response"] = response_ref  # Replace the response with a Firestore reference

        # Add prompt to Firestore
        new_doc_ref = collection_ref.add(prompt_data)  # Firestore generates a new document ID
        return {"success": True, "message": "Prompt created successfully", "id": new_doc_ref[1].id}

    except Exception as e:
        return {"error": f"An error occurred while creating the prompt: {str(e)}"}
    
@app.post("/create_response")
async def create_response(response: Response):
    """
    Endpoint to create a new response in Firestore.
    """
    try:
        # Firestore collection reference for the responses
        collection_ref = db.collection("req2test").document("development").collection("ai_responses")

        # Prepare response data
        response_data = response.dict(exclude={"id"})  # Exclude the `id` field, as Firestore will generate it
        response_data["created_at"] = datetime.now()  # Ensure `created_at` is a Firestore-compatible timestamp

        # Add response to Firestore
        new_doc_ref = collection_ref.add(response_data)  # Firestore generates a new document ID
        return {"success": True, "message": "Response created successfully", "id": new_doc_ref[1].id}

    except Exception as e:
        return {"error": f"An error occurred while creating the response: {str(e)}"}

"""

READ ENDPOINTS

"""

@app.get("/get_chats")
async def get_chats():
    """
    Endpoint to retrieve all chats inside the chats collection in Firestore.
    """
    try:
        collection_ref = db.collection("req2test").document("development").collection("chats")
        chat_documents = collection_ref.stream()

        chats = []
        for doc in chat_documents:
            chat = Chat.from_firestore(doc)
            chats.append(chat)

        return chats if chats else {"error": "No chat data found in the collection"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/get_chat/{chat_id}")
async def get_chat(chat_id: str):
    """
    Endpoint to retrieve a chats specified by its ID inside the chats collection in Firestore.
    """
    try:
        chat_ref = db.collection("req2test").document("development").collection("chats").document(chat_id)
        chat_doc = chat_ref.get()

        if chat_doc.exists:
            chat = Chat.from_firestore(chat_doc)
            return chat
        else:
            return {"error": "Chat not found"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/get_prompts")
async def get_prompts():
    """
    Endpoint to retrieve all prompts inside the prompts collection in Firestore.
    """
    try:
        collection_ref = db.collection("req2test").document("development").collection("prompts")
        prompt_documents = collection_ref.stream()

        prompts = []
        for doc in prompt_documents:
            prompt = Prompt.from_firestore(doc)
            prompts.append(prompt)

        return prompts if prompts else {"error": "No prompt data found in the collection"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/get_prompt/{prompt_id}")
async def get_prompt(prompt_id: str):
    """
    Endpoint to retrieve a prompt specified by its ID inside the prompts collection in Firestore.
    """
    try:
        prompt_ref = db.collection("req2test").document("development").collection("prompts").document(prompt_id)
        prompt_doc = prompt_ref.get()

        if prompt_doc.exists:
            prompt = Prompt.from_firestore(prompt_doc)
            return prompt
        else:
            return {"error": "Prompt not found"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/get_response/{response_id}")
async def get_response(response_id: str):
    """
    Endpoint to retrieve a response specified by its ID inside the ai_responses collection in Firestore.
    """
    try:
        response_ref = db.collection("req2test").document("development").collection("ai_responses").document(response_id)
        response_doc = response_ref.get()

        if response_doc.exists:
            response = Response.from_firestore(response_doc)
            return response
        else:
            return {"error": "Response not found"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

"""

UPDATE ENDPOINTS

"""

@app.put("/update_chat/{chat_id}")
async def update_chat(chat_id: str, updated_chat: Chat):
    """
    Endpoint to update a certain chat specified by its ID in Firestore.
    """
    try:
        chat_ref = db.collection("req2test").document("development").collection("chats").document(chat_id)
        chat_doc = chat_ref.get()

        if not chat_doc.exists:
            raise HTTPException(status_code=404, detail="Chat not found")

        # Convert the updated Chat object into a dictionary
        chat_data = updated_chat.dict()
        # Remove the 'id' field before saving to Firestore
        chat_data.pop("id", None)

        # Convert FirestoreRef objects back to Firestore DocumentReferences
        chat_data["prompts"] = [
            db.document(ref.reference_id) for ref in updated_chat.prompts
        ]

        # Save the updated data to Firestore
        chat_ref.set(chat_data)

        return {"success": True, "message": f"Chat {chat_id} updated successfully"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


@app.put("/update_prompt/{prompt_id}")
async def update_prompt(prompt_id: str, updated_prompt: Prompt):
    """
    Endpoint to update a certain prompt specified by its ID in Firestore.
    """
    try:
        prompt_ref = db.collection("req2test").document("development").collection("prompts").document(prompt_id)
        prompt_doc = prompt_ref.get()

        if not prompt_doc.exists:
            raise HTTPException(status_code=404, detail="Prompt not found")

        # Convert the updated Prompt object into a dictionary
        prompt_data = updated_prompt.dict()
        # Remove the 'id' field before saving to Firestore
        prompt_data.pop("id", None)

        # Convert FirestoreRef objects back to Firestore DocumentReferences
        if updated_prompt.response:
            prompt_data["response"] = updated_prompt.response.to_firestore_ref()

        # Save the updated data to Firestore
        prompt_ref.set(prompt_data)

        return {"success": True, "message": f"Prompt {prompt_id} updated successfully"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

"""

DELETE ENDPOINTS

"""

@app.delete("/delete_chat/{chat_id}")
async def delete_chat(chat_id: str):
    """
    Endpoint to delete an existing chat by its ID.
    """
    try:
        chat_ref = db.collection("req2test").document("development").collection("chats").document(chat_id)
        if chat_ref.get().exists:
            chat_ref.delete()  # Delete the document
            return {"success": True, "message": f"Chat with ID '{chat_id}' deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Chat with ID '{chat_id}' not found")
    except Exception as e:
        return {"error": f"An error occurred while deleting the chat: {str(e)}"}

@app.delete("/delete_prompt/{prompt_id}")
async def delete_prompt(prompt_id: str):
    """
    Endpoint to delete an existing prompt by its ID.
    """
    try:
        prompt_ref = db.collection("req2test").document("development").collection("prompts").document(prompt_id)
        if prompt_ref.get().exists:
            prompt_ref.delete()  # Delete the document
            return {"success": True, "message": f"Prompt with ID '{prompt_id}' deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Prompt with ID '{prompt_id}' not found")
    except Exception as e:
        return {"error": f"An error occurred while deleting the prompt: {str(e)}"}

@app.delete("/delete_response/{response_id}")
async def delete_response(response_id: str):
    """
    Endpoint to delete an existing response by its ID.
    """
    try:
        response_ref = db.collection("req2test").document("development").collection("ai_responses").document(response_id)
        if response_ref.get().exists:
            response_ref.delete()  # Delete the document
            return {"success": True, "message": f"Response with ID '{response_id}' deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Response with ID '{response_id}' not found")
    except Exception as e:
        return {"error": f"An error occurred while deleting the response: {str(e)}"}
