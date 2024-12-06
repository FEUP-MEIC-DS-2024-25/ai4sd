import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging
import files
import prompting
from pathlib import Path
from google.cloud import secretmanager

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

os.environ["API_KEY"] = "AIzaSyCWobjVmSeZWRE9nSh78rqUr9CWduURChE"
print(os.environ["API_KEY"])

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)


@app.route('/api/process', methods=['POST'])
def process():
    try:
        output_type = request.form.get('outputType')
        output_language = request.form.get('outputLanguage')
        additional_info = request.form.get('additionalInfo')
        files_data = request.files.getlist('files')
        files_text = files.process_files(files_data)

        prompt = prompting.generate(files_text, additional_info, output_language)
        response = model.generate_content(prompt)

        if output_type == 'pdf':
            filename = files.create_response_pdf(response.candidates[0].content.parts[0].text)
        else: 
            filename = files.create_response_txt(response.candidates[0].content.parts[0].text)
        
        return send_file(filename, as_attachment=True)

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
