from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def setup_gemini_api():
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name="gemini-1.5-pro")

try:
    model = setup_gemini_api()
except ValueError as e:
    model = None  # Ensure model is None if setup fails
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
    uvicorn.run(app, host="0.0.0.0", port=3333)
