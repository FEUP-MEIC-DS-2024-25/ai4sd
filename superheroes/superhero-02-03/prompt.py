import os
import google.generativeai as genai
import re
import time
from dotenv import load_dotenv

load_dotenv(dotenv_path="PATH/TO/ENV")
api_key = os.environ.get("API_KEY")
output_dir = "./backend"
genai.configure(api_key=api_key)

# Create the model
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
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": 2}
]

model = genai.GenerativeModel(
  model_name="gemini-1.5-pro",
  generation_config=generation_config,
  safety_settings=safety_settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

chat_session = model.start_chat(
  history=[
  ]
)

# Function to validate GitHub URL format
def validate_github_url(url):
    pattern = r"^https://github\.com/[\w-]+/[\w-]+$"
    if re.match(pattern, url):
        return True
    else:
        print("Invalid GitHub URL format. Please provide a valid URL.")
        return False

# Function to validate architectural patterns input
def validate_architectural_patterns(patterns):
    if patterns.strip():
        return True
    else:
        print("Architectural patterns cannot be empty. Please provide valid patterns.")
        return False

# Prompt user for input (GitHub URL and architectural patterns)
github_link = input("Link github:")
# Validate the GitHub URL
while not validate_github_url(github_link):
    github_link = input("Link github:")

architectural_patterns = input("Architectural Patterns:")

# Validate the architectural patterns
while not validate_architectural_patterns(architectural_patterns):
    architectural_patterns = input("Architectural Patterns:")

prompt = f"""
Create an ADR in Markdown format for the project at {github_link}. 
Base the ADR on this template:
"# Title 
## Status 
Define the status (e.g., proposed, accepted, rejected, deprecated, superseded).
## Context 
Describe the specific issue motivating this decision and why these architectural patterns were chosen: {architectural_patterns}.
## Decision 
State the specific changes proposed or implemented, focusing on the architectural approach.
## Consequences 
Explain what becomes easier or harder due to this decision."

Include as much relevant information as possible for each section based on the provided GitHub link and architectural patterns. Use concise and precise language without any additional comments.
"""

# Rate limiting logic (API limit check)
RATE_LIMIT = 60  # Example rate limit of 60 requests per minute
LAST_REQUEST_TIME = 0

def rate_limit_check():
    global LAST_REQUEST_TIME
    current_time = time.time()
    if current_time - LAST_REQUEST_TIME < 60 / RATE_LIMIT:
        time.sleep(60 / RATE_LIMIT - (current_time - LAST_REQUEST_TIME))
    LAST_REQUEST_TIME = time.time()

try:
    rate_limit_check()
    response = chat_session.send_message(prompt)
    
    if response and response.text:
        with open(output_dir +  "/ADR.md", "w") as file:
            file.write(response.text.strip())
        print("ADR written to ADR.md")
    else:
        print("No response from the model. Please check your input or try again.")
except Exception as e:
    print(f"An error occurred: {e}")