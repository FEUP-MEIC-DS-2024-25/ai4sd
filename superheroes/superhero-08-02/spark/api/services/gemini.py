import os
import google.generativeai as genai

class GeminiAPI:

    def __init__(self):
        genai.configure(api_key = os.getenv('GEMINI_API_KEY'))

    def prompt_gemini(self, prompt):
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text
    
geminiAPI = GeminiAPI()
