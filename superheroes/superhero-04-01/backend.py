from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import files
import prompting
from pathlib import Path
from google.cloud import firestore, storage, secretmanager
import datetime
import base64
from google.cloud import secretmanager
import json
import firebase_admin
from firebase_admin import credentials, firestore
from typing import List
import os
import files as Files

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

# Environment and Firebase initialization
def initialize_firebase():
    try: 
        if not firebase_admin._apps:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
            print("Firebase initialized using Application Default Credentials")
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase using ADC: {e}")
        if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "hero-alliance-feup-ds-24-25-146d9ba8a2d0.json"
        if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
            try:
                cred_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
                if Path(cred_path).exists():
                    print(f"Initializing Firebase using Service Account from {cred_path}")
                    cred = credentials.Certificate(cred_path)
                    if not firebase_admin._apps:
                        firebase_admin.initialize_app(cred)
                        print("Firebase initialized using Service Account from GOOGLE_APPLICATION_CREDENTIALS.")
                    return firestore.client()
                else:
                    print("Error: the file specified in GOOGLE_APPLICATION_CREDENTIALS doesn't exist")
            except Exception as e:
                print(f"Error initializing Firebase from GOOGLE_APPLICATION_CREDENTIALS: {e}")
        return None
    
os.environ["ASSISTANT_ID"] = "superhero-04-01"
db = initialize_firebase()
if db is None:
    print("Could not initialize Firebase. Exiting.")
    exit(1)

secretmanager_client = secretmanager.SecretManagerServiceClient()
secret_name = f"projects/hero-alliance-feup-ds-24-25/secrets/superhero-04-01-secret/versions/latest"
response = secretmanager_client.access_secret_version(request={"name": secret_name})
if "payload" in response:
    os.environ["API_KEY"] = response.payload.data.decode("UTF-8")
else:
    print("Error: Could not retrieve the secret from Secret Manager.")
    exit(1)

import google.generativeai as genai
genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

storage_client = storage.Client()
bucket_name = "hero-alliance-nexus"

def upload_file_to_gcs(bucket_name, folder_path, file, filename):
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(f"{folder_path}/{filename.split('/')[-1]}")
        blob.upload_from_file(file)
        blob.make_public()
        print(f"File '{filename.split('/')[-1]}' uploaded to '{folder_path}' in bucket '{bucket_name}'.")
        return blob.public_url
    except Exception as e:
        print(f"Error uploading file: {e}")
        raise

def create_folder_in_bucket(bucket_name, folder_path):
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(f"{folder_path}/placeholder.txt")
        blob.upload_from_string("This is a placeholder file for the folder.")
        print(f"Folder '{folder_path}' created successfully in bucket '{bucket_name}'.")
        return f"Folder '{folder_path}' created successfully."
    except Exception as e:
        import traceback
        print(f"Error creating folder: {e}")
        print(traceback.format_exc())
        return str(e)

def add_entry_to_firestore(data):
    print("Data to be added:", data)
    try:
        chat_history_ref = db.collection("superhero-04-01").document("chat_history")
        entries_ref = chat_history_ref.collection("entries")
        entries_ref.add(data)
        print("Conversation added successfully!")
    except Exception as e:
        print(f"Error: {e}")

@app.post('/api/create_folder')
async def create_folder():
    try:
        folder_name = 'assets/superhero-04-01'
        message = create_folder_in_bucket(bucket_name, folder_name)
        return JSONResponse(content={"status": "success", "message": message})
    except Exception as e:
        print(f"Error in creating folder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/process')
async def process(
    outputType: str = Form(...),
    outputLanguage: str = Form(...),
    additionalInfo: str = Form(...),
    files: List[UploadFile] = File(...),
    promptType: str = Form(...)
    # filters: str = Form(...)
):
    try:
        # # selected_filters = json.loads(filters)
        # non_functional = [filter.split('.')[1] for filter in selected_filters if '.' in filter]
        # functional = True if selected_filters[0] == "Functional" else False

        # print("FUNCTIONAL:", functional)
        # print("NON-FUNCTIONAL:", non_functional)

        # filters_information = ""

        # if functional:
        #     filters_information = "Classify the given list of requirements into functional (labelled as F)"
        
        # if non_functional and functional:
        #     filters_information += f" and non-functional requirements (labelled as NF) into these categories {non_functional}. If there are other requirements that don't match these requirements, discard them."
        # elif non_functional and not functional:
        #     filters_information += f"Classify the given list of requirements into non-functional (labelled as NF), into these categories {non_functional}. If there are other requirements that don't match these categories, discard them."

        # print(filters_information)
        
        files_text = Files.process_files(files)
        prompt = prompting.generate(files_text, additionalInfo, outputLanguage, promptType, "")
        response = model.generate_content(prompt)

        if outputType == 'pdf':
            filename = Files.create_response_pdf(response.candidates[0].content.parts[0].text)
        else: 
            filename = Files.create_response_txt(response.candidates[0].content.parts[0].text)
        
        with open(filename, 'rb') as file:
            public_url = upload_file_to_gcs(bucket_name, 'assets/superhero-04-01', file, filename)

        add_entry_to_firestore({
            'title': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'response_file_url': public_url
        })

        if (filename.endswith('.pdf')):
            return FileResponse(filename, media_type='application/pdf')
        else :
            return FileResponse(filename, media_type='text/plain')

    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/history')
async def get_history():
    try:
        entries = db.collection(os.environ["ASSISTANT_ID"]).document("chat_history").collection("entries").stream()
        history = [entry.to_dict() for entry in entries]
        return JSONResponse(content={"status": "success", "history": history})
    except Exception as e:
        print(f"Error retrieving chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def delete_collection(db, collection_path):
    docs = db.collection(collection_path).stream()
    for doc in docs:
        doc.reference.delete()

@app.post('/api/reset')
async def reset():
    try:
        delete_collection(db, f"{os.environ['ASSISTANT_ID']}/chat_history/entries")
        return JSONResponse(content={"status": "success"})
    except Exception as e:
        print(f"Error resetting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/list_blobs')
async def list_blobs():
    try:
        blobs = storage_client.bucket(bucket_name).list_blobs(prefix="assets/superhero-04-01")
        blob_names = [blob.name for blob in blobs]

        print(f"Found blobs: {blob_names}")
        return JSONResponse(content={"status": "success", "blobs": blob_names})
    except Exception as e:
        print(f"Error listing blobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/delete_gcs_folder')
async def delete_folder():
    try:
        folder_path = "assets/superhero-04-01"
        bucket = storage_client.bucket(bucket_name)

        blobs_deleted = []
        blobs = bucket.list_blobs(prefix=folder_path)
        for blob in blobs:
            blob.delete()
            blobs_deleted.append(blob.name)

        print(f"Deleted {len(blobs_deleted)} objects from folder '{folder_path}'.")

        return JSONResponse(content={
            "status": "success",
            "message": f"Deleted {len(blobs_deleted)} objects from folder '{folder_path}'.",
            "deleted_blobs": blobs_deleted
        })

    except Exception as e:
        print(f"Error deleting folder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)