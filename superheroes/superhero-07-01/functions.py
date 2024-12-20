import re
import google.generativeai as genai
from google.cloud import secretmanager
import os

key = "AIzaSyCAhIoSs93i2maxH8A3ESi3LmqCygp2sxY"

def getSecretKey():
    try:
        client = secretmanager.SecretManagerServiceClient()
        resource_name = client.secret_version_path("hero-alliance-feup-ds-24-25", "superhero-07-01", "latest")
        response = client.access_secret_version(request={"name": resource_name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        print(f"Error accessing secret using ADC: {e}")
        # Fallback for local development, trying to read credentials from environment variables
        if "GOOGLE_API_KEY" in os.environ:
            try:
                return os.environ["GOOGLE_API_KEY"]
            except Exception as e:
                print(f"Error accessing secret from environment variable: {e}")
        return None

def check_if_user_story_format(user_story):
    pattern = r"^As an? [a-zA-Z\s']+,? I want to [a-zA-Z\s']+,? so that [a-zA-Z\s']+\.?$"

    if re.match(pattern, user_story, re.IGNORECASE):
        return True
    else:
        return False

def call_gemini_api(user_input):
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_input)

    return response