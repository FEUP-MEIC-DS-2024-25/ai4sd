from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions import check_if_user_story_format, call_gemini_api
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserStoryRequest(BaseModel):
    user_story: str

def register_story2test_api(app: FastAPI):
    @app.post('/api/gemini')
    def generate_answer(request: UserStoryRequest):
        print(request);
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

register_story2test_api(app)