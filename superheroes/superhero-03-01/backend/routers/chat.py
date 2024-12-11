from typing import List
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
from bson import ObjectId
from backend.back_server import db_helper
from ..JSONValidation.validators import new_chat_validator, ValidationError
import datetime
from fastapi.responses import JSONResponse


router = APIRouter()

class NewMessage(BaseModel):
    authorName: str
    body: str
    timestamp: str
    isDeleted: bool

class Message(BaseModel):
    currentConversation: str
    newMessage: NewMessage

# def createGeminiContext(messages):
#     return " ".join([message['body'] for message in messages])

def createGeminiContext(chat, new_message):
    if 'pinnedMessages' in chat and len(chat['pinnedMessages']) > 0:
        print(f"ERROR: Pinned messages exist but logic to handle is not implemented yet.")
        return "ERROR: Pinned messages exist but logic to handle is not implemented yet."
    else:  # No pinned messages - Context is done from messages only.
        complete_messages = chat['messages'] + [new_message]
        context = (
            "I am working on requirements engineering. I would like original features suggestions based on existing project requirements.\n"
            "Next is the current state of my suggestions in a conversation format. I would like you to answer the latest message while taking into account the previous conversation.\n"
            "If you are suggesting new features, your answer should outline them so that it is clear what they are.\n"
            "If the latest message is a question, your answer should be a short and clear response only to that question but taking into account the conversation if necessary.\n"
        )
        for message in complete_messages:
            context += f"\n{message['authorName']}: {message['body']}"
        return context


@router.post("/")
async def send_message(message: Message):
    # Validate the request body
    try:
        new_chat_validator(message.model_dump())
    except ValidationError as e:
        # Log to the terminal
        print(f"ERROR:  POST /chat/ Bad request: {e.message}")
        raise HTTPException(status_code=400, detail=f"Bad request: {e.message}")
    
    try:
        LLM_API_KEY = os.getenv("C3T1_LLM_API_KEY")
        if not LLM_API_KEY:
            raise ValueError("C3T1_LLM_API_KEY not found in environment variables")

        success, chat = db_helper.getChat(message.currentConversation)

        
        if success:
            # complete_messages = chat[0]['messages'] + [message.newMessage.model_dump()]
            context = createGeminiContext(chat, message.newMessage.model_dump())
        else:
            context = message.newMessage.body

        # Send the context to the gemini
        headers = {
            "Content-Type": "application/json",
        }
        gemini_payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": context
                        }
                    ]
                }
            ]
        }

        # gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={LLM_API_KEY}"
        gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key={LLM_API_KEY}"

        gemini_response = requests.post(gemini_api_url, json=gemini_payload, headers=headers)
        if gemini_response.status_code != 200:
            raise HTTPException(status_code=gemini_response.status_code, detail="Currently unable to generate response. Error with Gemini API.")

        response_message = gemini_response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No response from LLM")

        # Construct the message object
        new_message = {
            "authorName": "Gemini",
            "body": response_message,
            "timestamp": datetime.datetime.now().isoformat(),
            "isDeleted": False
        }
        
        # If everything is successful, update the database
        if success: # If the chat already exists
            new_messages = [message.newMessage.model_dump() , new_message]
            db_helper.addMessagesToChat(message.currentConversation, new_messages)
            
            return JSONResponse(content=new_message, status_code=200)
        
        else: # If the chat is new
            conversation = db_helper.createChat(message.newMessage.model_dump())
            conversationId = conversation['id']
            res= db_helper.addMessagesToChat(conversationId, [new_message])
            return JSONResponse(content=res, status_code=201)
    except Exception as e:
        # Clean up the database if something goes wrong
        # TODO
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/pin/{id}")
async def get_pin_message_by_id(id: str):
    try:
        exists, chat = db_helper.getPinnedMessages(id)
        if not exists:
            raise HTTPException(status_code=404, detail="Chat not found")

        return JSONResponse(content=chat, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

class PinMessageRequest(BaseModel):
    message: str

@router.post("/pin/{id}")
async def pin_messages_by_id(id: str, messages: List[str]):
    try:
        pinned_messages = []
        for message in messages:
            chat = db_helper.addPinnedToChat(id, message)
            if not chat:
                raise HTTPException(status_code=404, detail="Chat not found")
            pinned_messages.append(chat['pinnedMessages'][-1])

        return JSONResponse(content=pinned_messages, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}")
async def get_message_by_id(id: str):
    try:
        exists, chat = db_helper.getChat(id)
        if not exists:
            raise HTTPException(status_code=404, detail="Chat not found")
        return chat

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")