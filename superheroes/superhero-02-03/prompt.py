from flask import Flask, request, jsonify
import os
import google.generativeai as genai
import re
import time
from dotenv import load_dotenv

LAST_REQUEST_TIME = 0

app = Flask(__name__)

# Load environment variables
load_dotenv()
api_key = os.getenv("API_KEY")
output_dir = "./backend"
genai.configure(api_key=api_key)

# Model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.85,
    "top_k": 55,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": 2},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": 2},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": 2},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": 2},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

chat_session = model.start_chat(history=[])

# Validation functions
def validate_github_url(url):
    if not url:
        return False
    pattern = r"^https://github\.com/[\w-]+/[\w-]+$"
    return bool(re.match(pattern, url))

def validate_architectural_patterns(patterns):
    if not patterns:
        return False
    return bool(patterns.strip())

# API endpoint to generate ADR
@app.route("/generate-adr", methods=["GET", "POST"])
def generate_adr():
    try:
        if request.method == "POST":
            # Ensure the Content-Type is application/json
            if request.content_type != "application/json":
                return jsonify({"error": "Unsupported Media Type. Please set 'Content-Type: application/json'"}), 415
            
            data = request.get_json()
            if not data:
                return jsonify({"error": "Invalid or missing JSON data"}), 400
            
            github_link = data.get("github_link")
            architectural_patterns = data.get("architectural_patterns")
        else:  # GET request
            github_link = request.args.get("github_link")
            architectural_patterns = request.args.get("architectural_patterns")
        
        # Validate inputs
        if not validate_github_url(github_link):
            return jsonify({"error": "Invalid GitHub URL format"}), 400

        if not validate_architectural_patterns(architectural_patterns):
            return jsonify({"error": "Architectural patterns cannot be empty"}), 400

        prompt = f"""
Create an ADR in Markdown format for the project at {github_link}. 
Base the ADR on this template:
# Title
## Status
Define the status (e.g., proposed, accepted, rejected, deprecated, superseded).
## Context
Describe the specific issue motivating this decision and why these architectural patterns were chosen: {architectural_patterns}.
## Decision
State the specific changes proposed or implemented, focusing on the architectural approach.
## Consequences
Explain what becomes easier or harder due to this decision.
"""

        # Rate-limiting logic
        RATE_LIMIT = 60  # requests per minute
        global LAST_REQUEST_TIME
        current_time = time.time()

        time_since_last_request = current_time - LAST_REQUEST_TIME
        min_interval = 60 / RATE_LIMIT  # minimum interval between requests in seconds

        if time_since_last_request < min_interval:
            time_to_wait = min_interval - time_since_last_request
            time.sleep(time_to_wait)

        LAST_REQUEST_TIME = time.time()


        # Generate ADR
        response = chat_session.send_message(prompt)
        if response and response.text:
            os.makedirs(output_dir, exist_ok=True)
            adr_path = os.path.join(output_dir, "ADR.md")
            with open(adr_path, "w") as file:
                file.write(response.text.strip())
            return jsonify({"message": "ADR generated successfully", "path": adr_path}), 200
        else:
            return jsonify({"error": "No response from the model"}), 500

    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route("/", methods=["GET"])
def health_check():
    return "ADR Generator API is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
