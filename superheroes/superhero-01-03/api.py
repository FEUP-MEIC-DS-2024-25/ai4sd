from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class SessionRequest(BaseModel):
    session_id: int

app = FastAPI()

@app.post("/get_chats")
async def get_chats(request: SessionRequest):
    return {
        [{
            "id": request.chat_id,
            "name": f"Chat {request.chat_id}",
            "message": [{ 
                "content": "I am an API test.",
                "sender": "bot" 
            }]
        }]
    }