from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from .firestoreHelper import db_helper
from .routers.chat import router as chat_router
from .routers.history import router as history_router

#from .JSONValidation.validators import new_chat_validator, ValidationErro


# Load the API key from .env file
CORS_URL = "https://storage.googleapis.com/hero-alliance-avengers/"




# collection_name its the name of the collection like if was a table in a database. Data is a dictionary with the data
# that you want to insert with the key as the column name and the value as the value like if was a json

#db_helper.create("chat_history", {"user_message": "Hello", "llm_response": "Hi there"})
#print(db_helper.read("chat_history"))
#db_helper.update("chat_history", {"user_message": "Hello"}, {"llm_response": "Hello, how can I help you?"})
#print(db_helper.read("chat_history"))
#db_helper.delete("chat_history", {"user_message": "Hello"})
#print(db_helper.read("chat_history"))


app = FastAPI()

app.include_router(chat_router, prefix="/chat")
app.include_router(history_router , prefix="/history")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8082", "http://localhost:3000", CORS_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


json_data = {
    "currentConversation": "67379c1d11de43d326741305",
    "newMessage": {
        "authorName": "You",
        "body": "Can you help me?",
        "timestamp": "2024-11-15T18:33:25.896Z",
        "isDeleted": False
    }
}


# try:
#     new_chat_validator(json_data)
#     print("JSON is valid.")
# except ValidationError as e:
#     print(f"Validation failed: {e.message}")
# except Exception as e:
#     print(f"Error: {str(e)}")

