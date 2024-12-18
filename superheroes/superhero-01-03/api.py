from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import os
import gemini

def initialize_firebase():
    """Initializes Firebase using Application Default Credentials (ADC)."""
    try: 
        # Use ADC by not passing explicit credentials.
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
        print("Firebase initialized using Application Default Credentials")
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase using ADC: {e}")
        # Fallback for local development, trying to read credentials from GOOGLE_APPLICATION_CREDENTIALS
        if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
            try:
                 cred_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
                 if os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                    print("Firebase initialized using Service Account from GOOGLE_APPLICATION_CREDENTIALS.")
                    return firestore.client()
                 else:
                     print("Error: the file specified in GOOGLE_APPLICATION_CREDENTIALS doesn't exist")
            except Exception as e:
                    print(f"Error initializing Firebase from GOOGLE_APPLICATION_CREDENTIALS: {e}")
        return None


# No need to provide project_id or secret_id if using ADC
db = initialize_firebase()

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
    
    @classmethod
    def to_firestore(cls, chat: "Chat"):
        chat_data = chat.model_dump(exclude={"id"})
        chat_data["created_at"] = datetime.now()
        chat_data["prompts"] = [ref.to_firestore_ref() for ref in chat.prompts]
        return chat_data
    
class RequirementRequest(BaseModel):
    requirement: str

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

        chat_data = chat.model_dump()
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

class CreatePromptRequest(BaseModel):
    chat_id: str
    user_input: str

@app.post("/create_prompt")
async def create_prompt(request: CreatePromptRequest):
    """
    Endpoint to create a new prompt in Firestore.
    """
    prompt = Prompt(
        id=request.chat_id,
        created_at=datetime.now(),
        response=None,
        user_input=request.user_input
    )

    try:
        collection_ref = db.collection("superhero-01-03").document("development").collection("prompts")

        prompt_data = prompt.model_dump()  
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


class CreateResponseRequest(BaseModel):
    prompt_id: str
    ai_response: str

@app.post("/create_response")
async def create_response(request: CreateResponseRequest):
    """
    Endpoint to create a new response in Firestore.
    """
    response = Response(
        id=request.prompt_id,
        ai_response=request.ai_response,
        created_at=datetime.now()
    )

    try:
        collection_ref = db.collection("superhero-01-03").document("development").collection("ai_responses")

        response_data = response.model_dump()  
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
        print(chat_documents)

        chats = []
        for doc in chat_documents:
            chat = Chat.from_firestore(doc)
            print(chat)
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

class UpdateChatRequest(BaseModel):
    chat_id: str
    prompt_id: str
    response_id: str

@app.post("/update_chat")
async def update_chat(request: UpdateChatRequest):
    """
    Endpoint to update a chat in Firestore by adding a new prompt and response.
    """
    try:
        # Get the chat document reference
        chat_ref = db.collection("superhero-01-03").document("development").collection("chats").document(request.chat_id)
        
        # Check if the chat exists
        chat_doc = chat_ref.get()
        if not chat_doc.exists:
            raise HTTPException(status_code=404, detail="Chat not found")

        # Get the prompt and response references
        prompt_ref = db.collection("superhero-01-03").document("development").collection("prompts").document(request.prompt_id)
        response_ref = db.collection("superhero-01-03").document("development").collection("ai_responses").document(request.response_id)

        # Check if the prompt and response exist
        if not prompt_ref.get().exists:
            raise HTTPException(status_code=404, detail="Prompt not found")
        if not response_ref.get().exists:
            raise HTTPException(status_code=404, detail="Response not found")

        # Add the prompt and response to the chat
        chat_data = chat_doc.to_dict()
        if "prompts" not in chat_data:
            chat_data["prompts"] = []
        chat_data["prompts"].append(prompt_ref)

        # Update the chat document in Firestore
        chat_ref.update(chat_data)

        return {"success": True, "message": "Chat updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while updating the chat: {str(e)}")

class UpdatePromptRequest(BaseModel):
    prompt_id: str
    response_id: str

@app.put("/update_prompt")
async def update_prompt(request: UpdatePromptRequest):
    """
    Endpoint to update a prompt in Firestore by adding a response reference.
    """
    try:
        # Get the prompt document reference
        prompt_ref = db.collection("superhero-01-03").document("development").collection("prompts").document(request.prompt_id)
        
        # Check if the prompt exists
        prompt_doc = prompt_ref.get()
        if not prompt_doc.exists:
            raise HTTPException(status_code=404, detail="Prompt not found")

        # Get the response reference
        response_ref = db.collection("superhero-01-03").document("development").collection("ai_responses").document(request.response_id)

        # Check if the response exists
        if not response_ref.get().exists:
            raise HTTPException(status_code=404, detail="Response not found")

        # Update the response field in the prompt document
        prompt_ref.update({
            "response": response_ref
        })

        return {"success": True, "message": "Prompt updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while updating the prompt: {str(e)}")


"""

DELETE ENDPOINTS

"""

@app.delete("/delete_chat/{chat_id}")
async def do(chat_id: str):
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


@app.post("/convert")
async def convert_requirement(request: RequirementRequest):
    gherkin_output = gemini.convert_to_gherkin(request.requirement)
    return {"gherkin": gherkin_output}