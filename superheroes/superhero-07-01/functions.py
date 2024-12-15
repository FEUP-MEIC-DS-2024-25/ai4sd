import re
import google.generativeai as genai

def check_if_user_story_format(user_story):
    pattern = r"^As an? [a-zA-Z\s']+,? I want to [a-zA-Z\s']+,? so that [a-zA-Z\s']+\.?$"

    if re.match(pattern, user_story, re.IGNORECASE):
        return True
    else:
        return False

def call_gemini_api(user_input):
    genai.configure(api_key="")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_input)

    return response