import google.generativeai as genai
from google.cloud import secretmanager

key = ""
try:
    client = secretmanager.SecretManagerServiceClient()
    resource_name = client.secret_version_path(
        "hero-alliance-feup-ds-24-25", "superhero-06-01-secret", "3"
    )
    response = client.access_secret_version(name=resource_name)
    key = response.payload.data.decode("UTF-8")
except Exception as e:
    # fallback if doesnt work
    print(f"Error in accessing secret: {e}")


if key == "":
    key = "AIzaSyBTLkRFPLvku9J9ft88JE2CagwcRw0uo9E"

genai.configure(api_key=key)
model = genai.GenerativeModel("gemini-1.5-flash")


def send_prompt(prompt):
    response = model.generate_content(prompt)

    if not response:
        return "Failed to generate content"
    else:
        return response.text
