from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

import script

import json
from typing import List, Any

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class file(BaseModel):
    content: str

class responseModel(BaseModel):
    message: str
    data: List[Any]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/online")
def run_online(file: file):
    modelResponse = script.run_online(file.content)
    modelResponse = modelResponse.splitlines()
    modelResponse = "\n".join(modelResponse[1:-1])
    try:
        modelResponse = json.loads(modelResponse)
    except:
        response = responseModel(message="Failure", data=["error: The model's response was not a valid JSON.", modelResponse])
    else:
        response = responseModel(message="Success", data=modelResponse)
    return response

@app.post("/offline")
def run_offline(file: file):
    modelResponse = script.run_offline(file.content)
    modelResponse = modelResponse.splitlines()
    modelResponse = "\n".join(modelResponse[1:-1])
    try:
        modelResponse = json.loads(modelResponse)
    except:
        response = responseModel(message="Failure", data=["error: The model's response was not a valid JSON.", modelResponse])
    else:
        response = responseModel(message="Success", data=modelResponse)
    return response