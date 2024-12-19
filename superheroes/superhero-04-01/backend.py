import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging
import files
import prompting
from pathlib import Path
from google.cloud import firestore
from google.cloud import storage
import datetime
import base64
from google.cloud import secretmanager
import json
import datetime

import firebase_admin
from firebase_admin import credentials, firestore


# def get_secret(secret_id):
#     client = secretmanager.SecretManagerServiceClient()
#     project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
#     name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
#     response = client.access_secret_version(name=name)
#     return response.payload.data.decode("UTF-8")

# load_dotenv()

# on_google_cloud = os.getenv("GOOGLE_CLOUD_PROJECT") is not None

# if on_google_cloud:
#     os.environ["API_KEY"] = get_secret("RRBUDDY_API_KEY")

if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "hero-alliance-feup-ds-24-25-146d9ba8a2d0.json"

def initialize_firebase():
    """Initializes Firebase using Application Default Credentials (ADC)."""
    try: 
        # Use ADC by not passing explicit credentials.
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
        print("Firebase initialized using Application Default Credentials")
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase using ADC: {e}")
        # Fallback for local development, trying to read credentials from GOOGLE_APPLICATION_CREDENTIALS
        if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
            try:
                 cred_path = os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
                 if os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
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
secretmanager_client = secretmanager.SecretManagerServiceClient()
secret_name = f"projects/hero-alliance-feup-ds-24-25/secrets/superhero-04-01-secret/versions/latest"
response = secretmanager_client.access_secret_version(request={"name": secret_name})
os.environ["API_KEY"] = response.payload.data.decode("UTF-8")

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)


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

@app.route('/api/create_folder', methods=['GET', 'POST'])
def create_folder():
    try:
        folder_name = 'assets/superhero-04-01'
        message = create_folder_in_bucket(bucket_name, folder_name)
        return jsonify({"status": "success", "message": message})
    except Exception as e:
        print(f"Error in creating folder: {e}")
        return jsonify({"error": str(e)}), 500
    
# @app.route('/api/upload', methods=['POST'])
# def upload():
#     try:
#         folder_path = 'assets/superhero-04-01'
#         files_data = request.files.getlist('files')
#         uploaded_files = []

#         for file in files_data:
#             file.stream.seek(0)
#             public_url = upload_file_to_gcs(bucket_name, folder_path, file, file.filename)
#             uploaded_files.append({"filename": file.filename, "url": public_url})

#             add_entry_to_firestore({
#                 'date': datetime.datetime.now(tz=datetime.timezone.utc),
#                 'file_name': file.filename,
#                 'file_url': public_url
#             })

#         return jsonify({"status": "success", "uploaded_files": uploaded_files})
#     except Exception as e:
#         print(f"Error in uploading files: {e}")
#         return jsonify({"error": str(e)}), 500
    
@app.route('/api/process', methods=['POST'])
def process():
    try:
        output_type = request.form.get('outputType')
        output_language = request.form.get('outputLanguage')
        additional_info = request.form.get('additionalInfo')
        files_data = request.files.getlist('files')
        prompt_type = request.form.get('promptType')
        selected_filters = json.loads(request.form.get('filters'))

        print(selected_filters)

        non_functional = [filter.split('.')[1] for filter in selected_filters if '.' in filter]
        functional = True if selected_filters[0] == "Functional" else False


        print("FUNCTIONAL: " + str(functional))

        print("NON-FUNCTIONAL: " + str(non_functional))

        filters_information = ""

        if (functional):
            filters_information = "Classify the given list of requirements into functional (labelled as F)"
        
        if ((len(non_functional) > 0) and (functional)):
            filters_information += f" and non-functional requirements (labelled as NF) into these categories {non_functional}. If there are other requirements that don't match these requirements, discard them."
        elif (len(non_functional) > 0 and (not functional)):
            filters_information += f"Classify the given list of requirements into non-functional (labelled as NF), into these categories {non_functional}. If there are other requirements that don't match these categories, discard them."

        print(filters_information)
        
        files_text = files.process_files(files_data)
        prompt = prompting.generate(files_text, additional_info, output_language,prompt_type, filters_information)
        response = model.generate_content(prompt)

        if output_type == 'pdf':
            filename = files.create_response_pdf(response.candidates[0].content.parts[0].text)
        else: 
            filename = files.create_response_txt(response.candidates[0].content.parts[0].text)
        
        with open(filename, 'rb') as file:
            public_url = upload_file_to_gcs(bucket_name, 'assets/superhero-04-01', file, filename)

        add_entry_to_firestore({
            'title': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  
            'response_file_url': public_url
        })

        return send_file(filename, as_attachment=True)

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500
    

# Uncomment when we want to reset the chat history entries

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        entries = db.collection(os.environ["ASSISTANT_ID"]).document("chat_history").collection("entries").stream()
        history = [entry.to_dict() for entry in entries]
        return jsonify({"status": "success", "history": history})
    except Exception as e:
        print(f"Error retrieving chat history: {e}")
        return jsonify({"error": str(e)}), 500
    
def delete_collection(db, collection_path):
    docs = db.collection(collection_path).stream()
    for doc in docs:
        doc.reference.delete()

@app.route('/api/reset', methods=['POST'])
def reset():
    try:
        delete_collection(db, f"{os.environ['ASSISTANT_ID']}/chat_history/entries")
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error resetting chat history: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/list_blobs', methods=['GET'])
def list_blobs():
    try:
        blobs = storage_client.bucket(bucket_name).list_blobs(prefix="assets/superhero-04-01")
        blob_names = [blob.name for blob in blobs]

        print(f"Found blobs: {blob_names}")
        return jsonify({
            "status": "success",
            "blobs": blob_names
        })
    except Exception as e:
        print(f"Error listing blobs: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete_gcs_folder', methods=['GET'])
def delete_folder():
    try:
        folder_path = "assets/superhero-04-01"  
        bucket = storage_client.bucket(bucket_name)

        # DELETE EVERYTHING IN THE FOLDER, including subfolders
        blobs_deleted = []
        blobs = bucket.list_blobs(prefix=folder_path)
        for blob in blobs:
            blob.delete()
            blobs_deleted.append(blob.name)

        print(f"Deleted {len(blobs_deleted)} objects from folder '{folder_path}'.")

        return jsonify({
            "status": "success",
            "message": f"Deleted {len(blobs_deleted)} objects from folder '{folder_path}'.",
            "deleted_blobs": blobs_deleted
        })

    except Exception as e:
        print(f"Error deleting folder: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
