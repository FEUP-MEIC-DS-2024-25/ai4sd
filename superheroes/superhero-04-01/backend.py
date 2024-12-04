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
from datetime import datetime
import base64

load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)

db = firestore.Client()

storage_client = storage.Client()
bucket_name = 'rrbuddy' 

def upload_to_gcs(file_data, filename):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_string(file_data)
    return blob.public_url

@app.route('/api/process', methods=['POST'])
def process():
    try:
        output_type = request.form.get('outputType')
        output_language = request.form.get('outputLanguage')
        additional_info = request.form.get('additionalInfo')
        files_data = request.files.getlist('files')

        prompt_urls = []
        for file in files_data:
            file_url = upload_to_gcs(file.read(), f"prompt_{file.filename}")
            prompt_urls.append(file_url)
        
        files_text = files.process_files(files_data)

        prompt = prompting.generate(files_text, additional_info, output_language)
        response = model.generate_content(prompt)

        if output_type == 'pdf':
            filename = files.create_response_pdf(response.candidates[0].content.parts[0].text)
        else: 
            filename = files.create_response_txt(response.candidates[0].content.parts[0].text)

        answer_urls = []
        with open(filename, 'rb') as f:
            answer_url = upload_to_gcs(f.read(), f"answer_{filename}")
            answer_urls.append(answer_url)

        data = {
            'date': datetime.datetime.now(tz=datetime.timezone.utc),
            'title': request.form.get('title', 'Untitled'),
            'prompt_file_url': prompt_urls,
            'answer_file_url': answer_urls
        }

        db.collection("chat_history_rrbuddy").document().set(data, merge=True)

        answer_urls = []
        with open(filename, 'rb') as f:
            answer_url = upload_to_gcs(f.read(), f"answer_{filename}")
            answer_urls.append(answer_url)

        data = {
            'date': datetime.datetime.now(tz=datetime.timezone.utc),
            'title': request.form.get('title', 'Untitled'),
            'prompt_file_url': prompt_urls,
            'answer_file_url': answer_urls
        }

        db.collection("chat_history_rrbuddy").document().set(data, merge=True)

        return send_file(filename, as_attachment=True)

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
