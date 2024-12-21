from fastapi import APIRouter, HTTPException
from backend.back_server import db_helper
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/")
async def get_history():
    try:
       # Query all documents from the collection
        chat_history = db_helper.getLatestConversations(10)
        if not chat_history:
            return JSONResponse(status_code=204, content="Chat history not found")
        return JSONResponse(content=chat_history, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")