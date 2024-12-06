from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("superhero-01-03.json")
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
    id: str  

    @classmethod
    def from_firestore(cls, ref: firestore.DocumentReference):
        return cls(id=ref.id) 

    def to_firestore_ref(self):
        return db.document(self.id) 

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change this to specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

"""

CREATE ENDPOINTS

"""

@app.post("/create_chat")
async def create_chat(chat: Chat):
    """
    Endpoint to create a new chat in Firestore.
    """
    try:
        collection_ref = db.collection("superhero-01-03").document("development").collection("chats")

        chat_data = chat.dict(exclude={"id"})  
        chat_data["created_at"] = datetime.now() 

        prompts_as_refs = []
        for prompt in chat.prompts:
            prompt_doc_path = f"superhero-01-03/development/prompts/{prompt.id}"  
            prompt_ref = db.document(prompt_doc_path)

            if not prompt_ref.get().exists:
                return {
                    "error": f"Prompt with reference ID '{prompt.id}' does not exist"
                }

            prompts_as_refs.append(prompt_ref)

        chat_data["prompts"] = prompts_as_refs 

        new_doc_ref = collection_ref.add(chat_data)  
        return {"success": True, "message": "Chat created successfully", "id": new_doc_ref[1].id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while creating the chat: {str(e)}")


@app.post("/create_prompt")
async def create_prompt(prompt: Prompt):
    """
    Endpoint to create a new prompt in Firestore.
    """
    try:
        collection_ref = db.collection("superhero-01-03").document("development").collection("prompts")

        prompt_data = prompt.dict(exclude={"id"})  
        prompt_data["created_at"] = datetime.now()  

        if prompt.response:
            response_doc_path = f"superhero-01-03/development/ai_responses/{prompt.response.id}"  
            response_ref = db.document(response_doc_path)

            if not response_ref.get().exists:
                return {
                    "error": f"Response with reference ID '{prompt.response.id}' does not exist"
                }

            prompt_data["response"] = response_ref

        new_doc_ref = collection_ref.add(prompt_data)  
        return {"success": True, "message": "Prompt created successfully", "id": new_doc_ref[1].id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while creating the prompt: {str(e)}")
    
@app.post("/create_response")
async def create_response(response: Response):
    """
    Endpoint to create a new response in Firestore.
    """
    try:
        collection_ref = db.collection("superhero-01-03").document("development").collection("ai_responses")

        response_data = response.dict(exclude={"id"})  
        response_data["created_at"] = datetime.now()  

        new_doc_ref = collection_ref.add(response_data)  
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
        collection_ref = db.collection("superhero-01-03").document("development").collection("chats")
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
        chat_ref = db.collection("superhero-01-03").document("development").collection("chats").document(chat_id)
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
        collection_ref = db.collection("superhero-01-03").document("development").collection("prompts")
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
        prompt_ref = db.collection("superhero-01-03").document("development").collection("prompts").document(prompt_id)
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
        response_ref = db.collection("superhero-01-03").document("development").collection("ai_responses").document(response_id)
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
    Endpoint to update a specific chat identified by its ID in Firestore.
    """
    try:
        chat_ref = db.collection("superhero-01-03").document("development").collection("chats").document(chat_id)
        chat_doc = chat_ref.get()

        if not chat_doc.exists:
            raise HTTPException(status_code=404, detail="Chat not found")

        chat_data = updated_chat.dict(exclude={"id"})  
        chat_data["created_at"] = datetime.now()  

        prompts_as_refs = []
        for prompt in updated_chat.prompts:
            prompt_doc_path = f"superhero-01-03/development/prompts/{prompt.id}"  
            prompt_ref = db.document(prompt_doc_path)

            if not prompt_ref.get().exists:
                raise HTTPException(status_code=400, detail=f"Prompt with ID '{prompt.id}' does not exist")

            prompts_as_refs.append(prompt_ref)

        chat_data["prompts"] = prompts_as_refs  

        chat_ref.set(chat_data)

        return {"success": True, "message": f"Chat {chat_id} updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



@app.put("/update_prompt/{prompt_id}")
async def update_prompt(prompt_id: str, updated_prompt: Prompt):
    """
    Endpoint to update a specific prompt identified by its ID in Firestore.
    """
    try:
        prompt_ref = db.collection("superhero-01-03").document("development").collection("prompts").document(prompt_id)
        prompt_doc = prompt_ref.get()

        if not prompt_doc.exists:
            raise HTTPException(status_code=404, detail="Prompt not found")

        prompt_data = updated_prompt.dict(exclude={"id"})  
        prompt_data["created_at"] = datetime.now()  
        if updated_prompt.response:
            response_doc_path = f"superhero-01-03/development/ai_responses/{updated_prompt.response.id}" 
            response_ref = db.document(response_doc_path)

            if not response_ref.get().exists:
                raise HTTPException(status_code=400, detail=f"Response with ID '{updated_prompt.response.id}' does not exist")

            prompt_data["response"] = response_ref  

        prompt_ref.set(prompt_data)

        return {"success": True, "message": f"Prompt {prompt_id} updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


"""

DELETE ENDPOINTS

"""

@app.delete("/delete_chat/{chat_id}")
async def delete_chat(chat_id: str):
    """
    Endpoint to delete an existing chat by its ID.
    """
    try:
        chat_ref = db.collection("superhero-01-03").document("development").collection("chats").document(chat_id)
        if chat_ref.get().exists:
            chat_ref.delete()  
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
        prompt_ref = db.collection("superhero-01-03").document("development").collection("prompts").document(prompt_id)
        if prompt_ref.get().exists:
            prompt_ref.delete()  
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
        response_ref = db.collection("superhero-01-03").document("development").collection("ai_responses").document(response_id)
        if response_ref.get().exists:
            response_ref.delete()
            return {"success": True, "message": f"Response with ID '{response_id}' deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Response with ID '{response_id}' not found")
    except Exception as e:
        return {"error": f"An error occurred while deleting the response: {str(e)}"}
