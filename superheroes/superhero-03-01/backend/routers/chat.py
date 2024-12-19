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
from fastapi.responses import PlainTextResponse

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

def createGeminiContext(chat, new_message):
    context = (
        "I am working on requirements engineering. I would like original features suggestions based on existing project requirements.\n"
        "I would like you to answer the latest message while taking into account the previous conversation.\n"
        "If you are suggesting new features, your answer should write them in bold so that it is clear what they are. Any explanation given for that \n"
        "If the latest message is a question, your answer should be a short and clear response only to that question but taking into account the conversation if necessary.\n"
    )

    if new_message.get('pinnedMessages') and len(new_message['pinnedMessages']) > 0:
        context += "Current existing requirements:\n"
        for pin in new_message['pinnedMessages']:
            context += f"- {pin}\n"
        context += "\n"

    context += "Conversation summary:\n"
    if chat.get('messages'):
        for msg in chat['messages']:
            context += f"- {msg['authorName']}: {msg['body']}\n"

    context += f"- {new_message['authorName']}: {new_message['body']}"
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
        if not success:
            # Make an empty chat object
            chat = {
                "id": str(uuid4()),
                "members": ["You", "Gemini"],
                "description": "New conversation",
                "messages": [],
                "pinnedMessages": [],
                "lastChanged": datetime.datetime.now().isoformat(),
                "totalMessages": 0
            }

        context = createGeminiContext(chat, message.newMessage.model_dump())

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

def createRequirementsGemini(text_content):
    try:
        context = (
            "Please format and organize the following software requirements.\n"
            "Your answer should contain **only** the requirements in simple text with a estimation in points and acceptance criteria.\n"
            "There must be nothing else in your response. Please use the following format:\n"
            "A. Functional Requirements\n"
            "| Story ID | User Story | Estimation (Points) | Acceptance Criteria |\n"
            "| -------- | ---------- | ------------------- | ------------------- |\n"
            "| FR1 | [User Story] | [Estimation] | [Acceptance Criteria] |\n"
            "B. Non-Functional Requirements\n"
            "| Story ID | User Story | Estimation (Points) | Acceptance Criteria |\n"
            "| -------- | ---------- | ------------------- | ------------------- |\n"
            "| NFR1 | [User Story] | [Estimation] | [Acceptance Criteria] |\n"
            f"Requirements to format:\n{text_content}"
        )

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

        gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key={LLM_API_KEY}"
        
        gemini_response = requests.post(gemini_api_url, json=gemini_payload, headers=headers)
        if gemini_response.status_code != 200:
            return text_content  # Return original content if API fails
            
        formatted_text = gemini_response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", text_content)
        return formatted_text

    except Exception as e:
        print(f"Error formatting requirements: {str(e)}")
        return text_content  # Return original content if processing fails

@router.get("/pin/{id}/export")
async def export_pinned_messages(id: str):
    try:
        exists, chat = db_helper.getPinnedMessages(id)
        if not exists or not chat.get("pinnedMessage"):
            raise HTTPException(status_code=404, detail="Chat not found or no pinned messages exist")

        # Format pinned messages into text
        pinned_messages = chat.get("pinnedMessage", [])
        text_content = ""
        for idx, msg in enumerate(pinned_messages, 1):
            text_content += f"{msg['message']}\n"

        # Ask gemini to format the requirements
        # formatted_requirements = createRequirementsGemini(text_content)

        # Return as text file
        return PlainTextResponse(
            content= text_content,
            headers={
                "Content-Disposition": f"attachment; filename=featurecraft_requirements_{id}.txt"
            }
        )

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