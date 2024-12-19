import json
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions import check_if_user_story_format, call_gemini_api
from datetime import datetime
from firebase_admin import credentials, firestore, initialize_app
from google.cloud.firestore import SERVER_TIMESTAMP

# Initialize Firestore
cred = credentials.Certificate("hero-alliance-feup-ds-24-25-07-01.json")
initialize_app(cred)
db = firestore.client()

# Initialize FastAPI
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserStoryRequest(BaseModel):
    user_story: str


class Message(BaseModel):
    id: str
    conversation_id: str
    is_ai: bool
    content: str
    created_at: datetime

    @classmethod
    def from_firestore(cls, doc: firestore.DocumentSnapshot):
        data = doc.to_dict()
        data["id"] = doc.id
        data["created_at"] = data["created_at"].isoformat()
        return cls(**data)


class Conversation(BaseModel):
    id: str
    created_at: datetime
    messages: List[Message]

    @classmethod
    def from_firestore(cls, doc: firestore.DocumentSnapshot):
        data = doc.to_dict()
        data["id"] = doc.id
        data["created_at"] = data["created_at"].isoformat()
        messages_ref = db.collection("superhero-07-01").document("development").collection("messages").where(
            "conversation_id", "==", doc.id).stream()
        data["messages"] = [Message.from_firestore(message) for message in messages_ref]
        return cls(**data)


@app.post('/api/gemini')
def generate_answer(request: UserStoryRequest):
    if check_if_user_story_format(request.user_story):
        with open("requests.json", "r") as file:
            gemini_prompt = json.load(file)

        full_prompt = request.user_story + " " + gemini_prompt["gemini_prompt"]

        try:
            answer = call_gemini_api(full_prompt)
            return {
                "message": "User story format is correct. ",
                "prompt": full_prompt,
                "answer": answer.text
            }
        except Exception as e:
            return {"error": str(e)}
    else:
        return {"message": "User story format is incorrect."}


# Route to get all conversations
@app.get("/conversations", response_model=List[Conversation])
async def get_all_conversations():
    conversations_ref = db.collection("superhero-07-01").document("development").collection("conversations").stream()
    return [Conversation.from_firestore(doc) for doc in conversations_ref]


# Route to get a specific conversation by its ID
@app.get("/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    conversation_doc = db.collection("superhero-07-01").document("development").collection("conversations").document(
        conversation_id).get()
    if not conversation_doc.exists:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return Conversation.from_firestore(conversation_doc)


# Route to create a new conversation
@app.post("/", response_model=Conversation)
async def create_conversation():
    conversation_ref = db.collection("superhero-07-01").document("development").collection("conversations").document()
    conversation_data = {
        "created_at": SERVER_TIMESTAMP
    }
    conversation_ref.set(conversation_data)
    conversation_doc = conversation_ref.get()
    return Conversation.from_firestore(conversation_doc)


# Route to send a prompt to a conversation
@app.post("/{conversation_id}/send_prompt")
async def send_prompt(conversation_id: str, prompt: str):
    conversation_ref = db.collection("superhero-07-01").document("development").collection("conversations").document(
        conversation_id)
    conversation_doc = conversation_ref.get()
    if not conversation_doc.exists:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    if check_if_user_story_format(prompt):
        with open("requests.json", "r") as file:
            gemini_prompt = json.load(file)

        full_prompt = f"{prompt} {gemini_prompt['gemini_prompt']}"

        try:
            ai_response = call_gemini_api(full_prompt)

            human_message_ref = db.collection("superhero-07-01").document("development").collection(
                "messages").document()
            human_message_ref.set({
                "conversation_id": conversation_id,
                "is_ai": False,
                "content": prompt,
                "created_at": SERVER_TIMESTAMP
            })

            ai_message_ref = db.collection("superhero-07-01").document("development").collection("messages").document()
            ai_message_ref.set({
                "conversation_id": conversation_id,
                "is_ai": True,
                "content": ai_response,
                "created_at": SERVER_TIMESTAMP
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        return {"message": "User story format is incorrect."}

    return {"message": "Prompt sent and messages added successfully."}


# Route to delete a conversation and its messages
@app.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str):
    conversation_ref = db.collection("superhero-07-01").document("development").collection("conversations").document(
        conversation_id)
    conversation_doc = conversation_ref.get()
    if not conversation_doc.exists:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    messages_ref = db.collection("superhero-07-01").document("development").collection("messages").where(
        "conversation_id", "==", conversation_id).stream()
    for message_doc in messages_ref:
        db.collection("superhero-07-01").document("development").collection("messages").document(
            message_doc.id).delete()

    conversation_ref.delete()
    return {"message": "Conversation and associated messages deleted successfully."}


# Route to redirect to the latest created conversation
@app.get("/", response_model=Conversation)
async def redirect_to_latest_conversation():
    # Get the latest conversation by created_at field
    conversations_ref = db.collection("superhero-07-01").document("development").collection("conversations")
    latest_conversation = conversations_ref.order_by("created_at", direction=firestore.Query.DESCENDING).limit(
        1).stream()

    latest_conversation_doc = next(latest_conversation, None)
    if not latest_conversation_doc:
        raise HTTPException(status_code=404, detail="No conversations found.")

    conversation_id = latest_conversation_doc.id
    return RedirectResponse(url=f"/{conversation_id}")
