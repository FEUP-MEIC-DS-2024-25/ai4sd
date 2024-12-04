from fastapi import FastAPI
from pydantic import BaseModel
from functions import check_if_user_story_format, call_gemini_api
import json

app = FastAPI()

class UserStoryRequest(BaseModel):
    user_story: str

def register_story2test_api(app: FastAPI):
    @app.post('/api/gemini/{conversation_id}')
    def generate_answer(conversation_id: str, request: UserStoryRequest):    
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
                return JsonResponse({"error": str(e)}, status=500)
        else:
            return {"message": "User story format is incorrect."}