from flask import Flask, request, jsonify
import os
import google.generativeai as genai
import re
import time
from google.cloud import secretmanager

app = Flask(__name__)

LAST_REQUEST_TIME = 0

# Secret Manager Configuration
SECRET_NAME = "superhero-02-03-secret"
PROJECT_ID = "hero-alliance-feup-ds-24-25"

# Fetch API Key from Secret Manager
def get_secret(secret_name, project_id):
    """Fetch the secret from Google Secret Manager."""
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
        response = client.access_secret_version(name=name)

        print("Attempting to access secret...")
        print(f"Using project: {project_id}")
        print(f"Using secret: {secret_name}")
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        raise RuntimeError(f"Error accessing secret: {e}")

# Load API Key
try:
    api_key = get_secret(SECRET_NAME, PROJECT_ID)
    print(f"Fetched API Key: {api_key[:5]}...")  # Log first few characters
    genai.configure(api_key=api_key)
except RuntimeError as e:
    print(f"Failed to fetch API key: {e}")
    exit(1)

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

# Validation functions
def validate_github_url(url):
    return bool(re.match(r"^https://github\.com/[\w-]+/[\w-]+$", url))

def validate_architectural_patterns(patterns):
    return bool(patterns and patterns.strip())

@app.route("/generate-adr", methods=["POST"])
def generate_adr():
    try:
        if request.content_type != "application/json":
            return jsonify({"error": "Unsupported Media Type. Set 'Content-Type: application/json'"}), 415

        data = request.get_json()
        github_link = data.get("github_link")
        architectural_patterns = data.get("architectural_patterns")

        if not validate_github_url(github_link):
            return jsonify({"error": "Invalid GitHub URL format"}), 400

        if not validate_architectural_patterns(architectural_patterns):
            return jsonify({"error": "Architectural patterns cannot be empty"}), 400

        # Generate ADR Prompt
        prompt = f"""
Create an ADR in Markdown format for the project at {github_link}. 
Base the ADR on this template:
# Title
## Status
Define the status (e.g., proposed, accepted, rejected, deprecated, superseded).
## Context
Describe the issue motivating this decision and why these architectural patterns were chosen: {architectural_patterns}.
## Decision
State the specific changes proposed or implemented, focusing on the architectural approach.
## Consequences
Explain what becomes easier or harder due to this decision.
"""

        # Rate-limiting
        RATE_LIMIT = 60  # requests per minute
        global LAST_REQUEST_TIME
        current_time = time.time()
        min_interval = 60 / RATE_LIMIT
        if current_time - LAST_REQUEST_TIME < min_interval:
            time.sleep(min_interval - (current_time - LAST_REQUEST_TIME))
        LAST_REQUEST_TIME = time.time()

        # Send the prompt to the API
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config,
            safety_settings=safety_settings,
        )
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt)

        if response and response.text:
            output_dir = os.path.join(os.getcwd(), "backend")
            os.makedirs(output_dir, exist_ok=True)
            adr_path = os.path.join(output_dir, "ADR.md")
            with open(adr_path, "w") as file:
                file.write(response.text.strip())
            return jsonify({"message": "ADR generated successfully", "path": adr_path}), 200
        else:
            return jsonify({"error": "No response from the model"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health_check():
    return "ADR Generator API is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
