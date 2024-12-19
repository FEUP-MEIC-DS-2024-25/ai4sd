import json
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions import check_if_user_story_format, call_gemini_api

# Initialize FastAPI
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserStoryRequest(BaseModel):
    user_story: str

@app.post('/api/gemini')
def generate_answer(request: UserStoryRequest):
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
            return {"error": str(e)}
    else:
        return {"message": "User story format is incorrect."}
