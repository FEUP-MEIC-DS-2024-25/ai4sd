from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from .firestoreHelper import db_helper
from .routers.chat import router as chat_router
from .routers.history import router as history_router
from fastapi.staticfiles import StaticFiles

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
    # allow_origins=[CORS_URL],
    allow_origins=["*"],
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

# Serve the Swagger UI static files
swagger_static_path = os.path.join(os.path.dirname(__file__), "Swagger")
if os.path.exists(swagger_static_path):
    app.mount("/swagger", StaticFiles(directory=swagger_static_path, html=True), name="swagger")
else:
    raise FileNotFoundError(f"Swagger UI static files not found at {swagger_static_path}")

@app.get("/")
async def serve_swagger_ui():
    index_file_path = os.path.join(swagger_static_path, "redirect.html")
    if os.path.exists(index_file_path):
        return FileResponse(index_file_path)
    return {"error": "Swagger UI index.html not found"}

#@app.get("/")
#def read_root():
#    # Path to the index.html file
#    index_file_path = os.path.join(os.path.dirname(__file__), "index.html")
#    if os.path.exists(index_file_path):
#        return FileResponse(index_file_path)
#    else:
#        return {"error": "index.html not found"}


# try:
#     new_chat_validator(json_data)
#     print("JSON is valid.")
# except ValidationError as e:
#     print(f"Validation failed: {e.message}")
# except Exception as e:
#     print(f"Error: {str(e)}")

