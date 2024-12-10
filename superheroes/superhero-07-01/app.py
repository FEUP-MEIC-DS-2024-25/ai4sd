from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions import check_if_user_story_format, call_gemini_api
from datetime import datetime
import json
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("hero-alliance-feup-ds-24-25-07-01.json")
initialize_app(cred)
db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserStoryRequest(BaseModel):
    user_story: str

class Conversation(BaseModel):
    title: str

def register_story2test_api(app: FastAPI):
    @app.post('/api/gemini/{conversation_id}')
    async def generate_answer(conversation_id: str, request: UserStoryRequest):
        conversation_ref = db.collection("conversations").document(conversation_id)
        conversation = conversation_ref.get()
        
        if not conversation.exists:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if check_if_user_story_format(request.user_story):
            with open("requests.json", "r") as file:
                gemini_prompt = json.load(file)
        
            full_prompt = request.user_story + " " + gemini_prompt["gemini_prompt"]

            try:
                answer = call_gemini_api(full_prompt)
                
                user_message = {
                    "author": "user",
                    "text": request.user_story,
                    "timestamp": datetime.utcnow()
                }
                db.collection("messages").add({**user_message, "conversation_id": conversation_id})

                gemini_message = {
                    "author": "gemini",
                    "text": answer.text,
                    "timestamp": datetime.utcnow()
                }
                db.collection("messages").add({**gemini_message, "conversation_id": conversation_id})

                return {
                    "message": "User story format is correct. ",
                    "prompt": full_prompt,
                    "answer": answer.text
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        else:
            return {"message": "User story format is incorrect."}

    @app.post('/api/new-chat')
    async def create_conversation(conversation: Conversation):
        conversation_data = {
            "title": conversation.title,
            "timestamp": datetime.utcnow(),
        }
        conversation_ref = db.collection("conversations").add(conversation_data)
        return {"id": conversation_ref[1].id, "title": conversation.title}

    @app.delete('/api/delete-chat/{current_conversation_id}/{conversation_id}')
    async def delete_conversation(current_conversation_id: str, conversation_id: str):
        conversation_ref = db.collection("conversations").document(conversation_id)
        conversation = conversation_ref.get()

        if not conversation.exists:
            raise HTTPException(status_code=404, detail="Conversation to delete not found")

        messages_query = db.collection("messages").where("conversation_id", "==", conversation_id)
        messages = messages_query.stream()
        for message in messages:
            message.reference.delete()

        current_conversation_ref.delete()

        current_conversation_ref = db.collection("conversations").document(current_conversation_id)
        current_conversation = current_conversation_ref.get()

        if not current_conversation.exists:
            raise HTTPException(status_code=404, detail="Conversation to return not found")

        current_conversation_data = current_conversation.to_dict()
        current_conversation_data["id"] = current_conversation_id

        return {"message": "Conversation deleted successfully", "returned_conversation": current_conversation_data}


register_story2test_api(app)