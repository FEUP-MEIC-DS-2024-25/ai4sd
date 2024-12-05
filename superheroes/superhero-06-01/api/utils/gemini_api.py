import google.generativeai as genai
from environs import Env

env = Env()
env.read_env()
genai.configure(api_key = env.str("API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def send_prompt(prompt):
    response = model.generate_content(prompt)

    if not response:
        return "Failed to generate content"
    else:
        return response.text
    