from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from google.cloud import secretmanager
import os
import re
import markdown
from io import BytesIO
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

def access_secret(project_id, secret_id):
    try:
        client = secretmanager.SecretManagerServiceClient()
        resource_name = client.secret_version_path(project_id, secret_id, "latest")
        response = client.access_secret_version(request={"name": resource_name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        print(f"Error accessing secret: {e}")
        if "API_KEY" in os.environ:
            try:
                return os.environ["API_KEY"]
            except Exception as e:
                print(f"Error accessing secret from environment variable: {e}")
        return None

project_id = "hero-alliance-feup-ds-24-25"
secret_id = "superhero-01-02-secret"

API_KEY = access_secret(project_id, secret_id)

if API_KEY:
    secret_parts = API_KEY.split("=")
    if len(secret_parts) == 2:
        key = secret_parts[0]
        api_key = secret_parts[1]
        genai.configure(api_key=api_key)


app = FastAPI()
 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

@app.on_event("startup")
async def startup():
    global model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction=(
            "You are a chatbot that is only used to generate unit tests based on the code we give and only the code of unit test, you can also answer different questions in verification and validation field ONLY, you speak in English by default, give short answer by default but if the user needs more details you make it longer. Be polite."
        )
    )

@app.post("/api/chat-with-file")
async def chat_with_file(
    prompt: str = Form(...),  
    file: UploadFile = None   
):

    try:
        if file:
            file_contents = await file.read()

            file_bytes = BytesIO(file_contents)

            mime_type = file.content_type if file.content_type != "application/octet-stream" else "text/plain"

            myfile = genai.upload_file(file_bytes, mime_type=mime_type)

            result = model.generate_content([myfile, "\n\n", prompt])

        else:
            result = model.generate_content([prompt])

        markdown_response = result.text

        html_response = markdown.markdown(markdown_response, extensions=['fenced_code']).replace('\n', '&#10;')

        return JSONResponse(content={"response": html_response})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération de contenu: {str(e)}")

host = "0.0.0.0"  
port = int(os.getenv("PORT", 8080))  

if __name__ == "__main__":
    uvicorn.run(app, host=host, port=port)
