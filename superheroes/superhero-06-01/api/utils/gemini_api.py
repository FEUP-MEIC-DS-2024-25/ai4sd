import google.generativeai as genai
from environs import Env

genai.configure(api_key = "AIzaSyBTLkRFPLvku9J9ft88JE2CagwcRw0uo9E")
model = genai.GenerativeModel("gemini-1.5-flash")

def send_prompt(prompt):
    response = model.generate_content(prompt)

    if not response:
        return "Failed to generate content"
    else:
        return response.text
    