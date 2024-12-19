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

from google.cloud import secretmanager

client = secretmanager.SecretManagerServiceClient()
project_id = "hero-alliance-feup-ds-24-25"
secret_name ="superhero-03-01-secret"
name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
response = client.access_secret_version(request={"name": name})
LLM_API_KEY = response.payload.data.decode("UTF-8")


# Check if API key is set
if not LLM_API_KEY:
    raise ValueError("superhero-03-01-secret not found in environment variables")


router = APIRouter()

class NewMessage(BaseModel):
    authorName: str
    body: str
    timestamp: str
    isDeleted: bool
    pinnedMessages: List[str]

class Message(BaseModel):
    currentConversation: str
    newMessage: NewMessage

# def createGeminiContext(messages):
#     return " ".join([message['body'] for message in messages])

def createGeminiContext(chat, new_message):
    # Combine chat messages and the new message
    complete_messages = [
        {
            "authorName": new_message.authorName,
            "body": new_message.body,
            "timestamp": new_message.timestamp,
            "isDeleted": new_message.isDeleted,
        }
    ]

    complete_messages = chat['messages'] + complete_messages
    context = (
        "I am working on requirements engineering. I would like original features suggestions based on existing project requirements.\n"
        "Next is the current state of my suggestions in a conversation format. I would like you to answer the latest message while taking into account the previous conversation.\n"
        "If you are suggesting new features, your answer should outline them so that it is clear what they are.\n"
        "If the latest message is a question, your answer should be a short and clear response only to that question but taking into account the conversation if necessary.\n"
    )
    # Handle pinned messages
    if new_message.pinnedMessages and len(new_message.pinnedMessages) > 0:
        pinned_context = "Pinned Requirements:\n" + "\n".join(
            f"- {requirement}" for requirement in new_message.pinnedMessages
        )
        context += f"\n\n{pinned_context}"
    for message in complete_messages:
        context += f"\n{message['authorName']}: {message['body']}"
    return context

def buildDescriptionContext(chat):
    """Builds context for description generation from chat content."""
    context = "Generate a brief one-line description (max 200 characters) for a conversation about software requirements based on the following content.\n\n"

    if chat.get('pinnedMessages'):
        context += "Current existing requirements:\n"
        for pin in chat['pinnedMessages']:
            context += f"- {pin['message']}\n"
        context += "\n"

    if chat.get('messages'):
        context += "Conversation summary:\n"
        for msg in chat['messages']:
            context += f"- {msg['body']}\n"
    print(f"Context: {context}")
    return context

def createDescription(chat):
    """Creates a description for the chat using Gemini."""
    try:
        context = buildDescriptionContext(chat)
        headers = {"Content-Type": "application/json"}
        gemini_payload = {
            "contents": [{
                "parts": [{
                    "text": context
                }]
            }]
        }

        gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key={LLM_API_KEY}"

        response = requests.post(gemini_api_url, json=gemini_payload, headers=headers)
        if response.status_code != 200:
            print(f"Gemini API error: {response.status_code}")
            return "New conversation"

        description = response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

        # Clean up
        description = description.strip().replace("\n", " ")

        return description if description else "New conversation"

    except Exception as e:
        print(f"Error generating description: {e}")
        return "New conversation"

def createGeminiContextWithPinnedMessages(new_message):
    # Initialize context with general instructions
    context = (
        "I am working on requirements engineering. I would like original feature suggestions based on existing project requirements.\n"
        "Next is the current state of my suggestions in a conversation format. I would like you to answer the latest message while taking into account the previous conversation.\n"
        "If you are suggesting new features, your answer should outline them so that it is clear what they are.\n"
        "If the latest message is a question, your answer should be a short and clear response only to that question but taking into account the conversation if necessary.\n"
    )

    # Handle pinned messages
    if new_message.pinnedMessages and len(new_message.pinnedMessages) > 0:
        pinned_context = "Pinned Requirements:\n" + "\n".join(
            f"- {requirement}" for requirement in new_message.pinnedMessages
        )
        context += f"\n\n{pinned_context}"

    # Combine chat messages and the new message
    complete_messages = [
        {
            "authorName": new_message.authorName,
            "body": new_message.body,
            "timestamp": new_message.timestamp,
            "isDeleted": new_message.isDeleted,
        }
    ]

    # Add conversation messages to the context
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
        if not LLM_API_KEY:
            raise ValueError("superhero-03-01-secret not found in environment variables")

        success, chat = db_helper.getChat(message.currentConversation)

        if success:
            # complete_messages = chat[0]['messages'] + [message.newMessage.model_dump()]
            context = createGeminiContext(chat, message.newMessage)
        else:
            context = createGeminiContextWithPinnedMessages(message.newMessage)


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

        pinned_messages = message.newMessage.pinnedMessages
        message.newMessage.pinnedMessages = None

# If everything is successful, update the database
        if success: # If the chat already exists
            new_messages = [message.newMessage.model_dump() , new_message]
            db_helper.addMessagesToChat(message.currentConversation, new_messages)
            
            return JSONResponse(content=new_message, status_code=200)
        
        else: # If the chat is new
            conversation = db_helper.createChat(message.newMessage.model_dump())
            conversationId = conversation['id']
            res= db_helper.addMessagesToChat(conversationId, [new_message])
            if pinned_messages:
                for pinned_message in pinned_messages:
                    db_helper.addPinnedToChat(conversationId, pinned_message)
            # Update the description based on the current conversation and pinned messages
            description = createDescription(res)
            descriptionSuccess = db_helper.updateChatDescription(conversationId, description)
            if not descriptionSuccess:
                raise HTTPException(status_code=500, detail="Internal server error: Failed to update chat description")

            # Get the updated chat
            exists, chat = db_helper.getChat(conversationId)
            if not exists:
                raise HTTPException(status_code=500, detail="Internal server error: Failed to retrieve chat after creation")

            return JSONResponse(content=chat, status_code=201)
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

class DeletePinnedMessageRequest(BaseModel):
    chatId: str
    pinnedMessageId: str

@router.delete("/pin/delete")
async def delete_pinned_message_by_id(body: DeletePinnedMessageRequest):
    try:
        success = db_helper.deletePinnedMessage(body.chatId, body.pinnedMessageId)
        if not success:
            return JSONResponse(content={"detail": "Pinned message not found"}, status_code=404)
        return JSONResponse(content={"message": "Pinned message deleted successfully."}, status_code=200)
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