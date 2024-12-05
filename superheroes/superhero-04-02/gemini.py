from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from database import *
import random

model = genai.GenerativeModel(model_name="gemini-1.5-flash")


# Example requiremnts
# 1. The system must allow users to log in with email and password.
# 2. The system must send email notifications for important events.
# 3. Users must be able to view their order history.
# 4. The system must have a password recovery option.
# 5. Users can customize their notification preferences.

load_dotenv()
api_key = os.getenv("API_KEY")

genai.configure(api_key=api_key)

blueprint = Blueprint("gemini_api", __name__)

@blueprint.route("/generate", methods=["POST"])
def generate_response():
    data = request.get_json()
    query = data.get("query")
    language = data.get("language", "en")
    
    numero_aleatorio = random.randint(0, 100)
    project_name = f"teste{numero_aleatorio}"
    project_info = save_project(project_name)
    requirements_id = save_requirement(project_info, query, True)

    if not query:
        return jsonify({"error": "No query provided"}), 400

    formats = {
        "en": {
            "user_story": "As a [...], I want [...], so that [...]",
            "given_when_then": "given/when/then"
        },
        "pt": {
            "user_story": "Como [...], eu quero [...], para que [...]",
            "given_when_then": "dado/quando/então"
        },
        "es": {
            "user_story": "Como [...], quiero [...], para que [...]",
            "given_when_then": "dado/cuando/entonces"
        }
    }

    format_info = formats.get(language, formats["en"])  

    prompt = str([
        f"With the use of the following requirements, give a list of userstories and a list of possible acceptance criteria for each user story.\n",
        f"The userstories have the format: {format_info['user_story']}\n",
        f"Each acceptance test inside the acceptance criteria have the {format_info['given_when_then']} format\n"
        'Give in a JSON format, where there is "index" and the "user_story" are type string so wrapped in quotation marks, and the "acceptance_criteria" a list of acceptance tests, all of type string so wrapped in quotation marks within a JSON list.\n',
        "The result must be only a JSON list, no more information.\n",
        "Don't add any more text or newlines to the JSON, without ```json```.\n",
        f"Generate the response in {language} language.\n",
        f"Here is the requirements:\n{query}.",
    ])

    response = model.generate_content(prompt)
    result = response.text.replace("```json", "").replace("```", "")
    save_user_stories(project_info[0], requirements_id, result)
    return jsonify({"response": result}), 200

    