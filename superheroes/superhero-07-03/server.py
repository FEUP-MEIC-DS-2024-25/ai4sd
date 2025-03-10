from flask import Flask, request, jsonify
from flask_cors import CORS
from concurrent import futures
import google.generativeai as genai
import os
from dotenv import load_dotenv
import threading
import time

load_dotenv()

#with open('/etc/gemini_token', 'r') as file:
 # GEMINI_API_KEY = file.read().strip()

GEMINI_API_KEY = "AIzaSyAo7X1_n5zB69B_iAJgZeU1-o3vjs1DZQ4"

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://104.155.4.93", "https://superhero-07-03-150699885662.europe-west1.run.app"]}})

progress = {"status": 0, "result": ""}


def process_file_with_real_progress(prompt):
    global progress
    progress["status"] = 0
    progress["result"] = ""
    seen_chunks = set()

    try:
        progress["status"] = 10  

        
        chunks = model.generate_content(prompt, stream=True)  
        for i, chunk in enumerate(chunks):
            time.sleep(0.5)  
            if chunk.text not in seen_chunks: 
                seen_chunks.add(chunk.text)
                progress["result"] += chunk.text 
                progress["status"] += 20 if progress["status"] < 80 else 0


        
        progress["status"] = 100 
    except Exception as e:
        progress["status"] = 100
        progress["error"] = str(e)

@app.route('/UploadFile', methods=['POST'])
def UploadFile():

    global progress

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        file_content = file.read().decode('utf-8')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    prompt = "Analyze and explain the following unit test code, providing feedback on the following aspects: Test structure and clarity.Coverage: Are all relevant cases (including edge cases) covered? Efficiency: Are there redundant or unnecessary test cases? Suggested improvements for refactoring the test code. Recommend additional test cases for better coverage (including edge cases, performance, etc.). Recommend tools, libraries, or strategies for improving the testing process. Here is the code:\n\n " + file_content

    threading.Thread(target=process_file_with_real_progress, args=(prompt,)).start()

    return jsonify({"message": "File processing started"}), 200    
    
@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify(progress)


@app.route('/Chat', methods=['POST'])
def Chat():

    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({"error": "No content provided"}), 400

    
    try:
        ai_answer = model.generate_content(content)
        if ai_answer:
            response = {"content": ai_answer.text}
            return jsonify(response), 200
        else:
            return jsonify({"error": "Failed to generate content"}), 500
    except Exception as e:
        return jsonify({"error": f"Chat processing failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
