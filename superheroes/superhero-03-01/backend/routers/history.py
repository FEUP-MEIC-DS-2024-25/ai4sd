from fastapi import APIRouter, HTTPException
from backend.back_server import db_helper


router = APIRouter()

@router.get("/")
#async def get_history(page: int = 1, page_size: int = 10):
#    """
#    Fetch chat history entries filtered by specific conditions, sorted by the latest message timestamp.
#    
#    :param page: The current page for pagination (default: 1).
#    :param page_size: The number of items per page (default: 10).
#    :return: A list of chat history entries.
#    """
#    try:
#        # Construct the filter query
#        filters = {
#            "members": {"$all": ["You", "Gemini"]},  # Ensure both 'You' and 'Gemini' are in members
#            "description": {"$regex": "Conversation with Gemini", "$options": "i"},  # Case-insensitive match
#        }
#        
#        # Use the `read` method to fetch the data
#        chat_history = db_helper.read(
#            collection_name="chat_history",
#            filters=filters,
#            sort_field="messages.timestamp",  # Sort by timestamp in messages
#            sort_order=-1,  # Descending order for the latest messages first
#            page=page,
#            page_size=page_size
#        )
#
#        chat_history = [
#            {**chat, "_id": str(chat["_id"])} for chat in chat_history
#        ]
#        
#        return {"chat_history": chat_history}
#
#    except Exception as e:
#        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
async def get_history():
    try:
       # Query all documents from the collection
        chat_history = db_helper.read("chat_history", {})
        
        # Convert ObjectId to string for each document
        for chat in chat_history:
            chat['_id'] = str(chat['_id'])
        
        sorted_history = sorted(
            chat_history,
            key=lambda chat: chat["messages"][-1]["timestamp"] if chat["messages"] else "",
            reverse=True  # Sort in descending order (latest first)
        )

        return sorted_history
       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")