from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Helper model for Firestore DocumentReference
class FirestoreRef(BaseModel):
    reference_id: str  # Store Firestore DocumentReference as a string

    @classmethod
    def from_firestore(cls, ref: firestore.DocumentReference):
        return cls(reference_id=ref.path)  # Store the document path instead of the object

    def to_firestore_ref(self):
        return db.document(self.reference_id)  # Convert the path back to a DocumentReference

# Pydantic model for Prompt
class Prompt(BaseModel):
    created_at: datetime
    response: Optional[FirestoreRef]  # Firestore document reference for the response
    user_input: str

    @classmethod
    def from_firestore(cls, data: dict):
        # Convert Firestore fields to Pydantic-compatible structure
        data["created_at"] = data["created_at"].isoformat()  # Ensure datetime is ISO 8601
        if "response" in data and isinstance(data["response"], firestore.DocumentReference):
            data["response"] = FirestoreRef.from_firestore(data["response"])
        return cls(**data)

# Pydantic model for Chat
class Chat(BaseModel):
    name: str
    prompts: List[FirestoreRef]
    created_at: datetime

    @classmethod
    def from_firestore(cls, data: dict):
        # Convert Firestore data to a Pydantic-compatible structure
        data["prompts"] = [FirestoreRef.from_firestore(ref) for ref in data.get("prompts", [])]
        data["created_at"] = data["created_at"].isoformat()  # Ensure datetime is ISO 8601
        return cls(**data)

# FastAPI Application
app = FastAPI()

@app.get("/get_chats")
async def get_chats():
    try:
        doc_ref = db.collection("req2test").document("development").collection("chats").document("chat1")
        chat_data = doc_ref.get().to_dict()

        if chat_data:
            chat = Chat.from_firestore(chat_data)
            return chat
        else:
            return {"error": "No chat data found for this session ID"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/get_prompts")
async def get_prompts():
    try:
        doc_ref = db.collection("req2test").document("development").collection("prompts").document("prompt1")
        prompt_data = doc_ref.get().to_dict()

        if prompt_data:
            prompt = Prompt.from_firestore(prompt_data)
            return prompt
        else:
            return {"error": "No prompt data found for this session ID"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
