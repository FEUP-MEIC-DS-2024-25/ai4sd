from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import google.generativeai as genai
from google.cloud import secretmanager
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://104.155.4.93", "https://104.155.4.93"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_secret(secret_name: str, project_id: str) -> str:
    """
    Retrieve a secret's value from Google Cloud Secret Manager.

    Args:
        secret_name (str): The name of the secret.
        project_id (str): The Google Cloud project ID.

    Returns:
        str: The value of the secret.
    """
    client = secretmanager.SecretManagerServiceClient()
    secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"

    try:
        response = client.access_secret_version(request={"name": secret_path})
        secret_value = response.payload.data.decode("UTF-8")
        return secret_value
    except Exception as e:
        raise RuntimeError(f"Error retrieving secret '{secret_name}': {str(e)}")

def setup_gemini_api():
    """
    Configure the Gemini API using a key retrieved from Google Cloud Secret Manager.
    """
    project_id = os.getenv("GCP_PROJECT_ID")
    secret_name = "superhero-07-02"

    if not project_id:
        raise ValueError("GCP_PROJECT_ID environment variable is not set")

    # Retrieve the API key from Secret Manager
    api_key = get_secret(secret_name, project_id)
    if not api_key:
        raise ValueError(f"Secret '{secret_name}' is empty or could not be retrieved")

    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name="gemini-1.5-pro")

try:
    model = setup_gemini_api()
except Exception as e:
    model = None
    print(f"Error: {e}")

def generate_unit_tests(function_code):
    prompt = f"""
    Given the following code:

    {function_code}

    Generate comprehensive unit tests for this function. Include:
    1. Test cases for normal inputs
    2. Test cases for edge cases
    3. Test cases for error conditions
    4. Each test case should have a small comment

    Use the unittest framework and provide explanations for each test case.

    If the code given is only unit tests, you should instead review the unit tests and give suggestions of how to improve them.
    """
    if not model:
        return "Model is not initialized. Check API key configuration."
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating tests: {str(e)}"

@app.post("/api/generate_tests")
async def generate_tests(request: Request):
    try:
        body = await request.json()
        function_code = body.get('function_code', '')
        file_content = body.get('file_content', '')

        if not function_code and file_content:
            function_code = file_content

        unit_tests = generate_unit_tests(function_code)
        return jsonable_encoder({'unit_tests': unit_tests})

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
