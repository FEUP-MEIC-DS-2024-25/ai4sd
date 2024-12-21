from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
from google.cloud import secretmanager
from dotenv import load_dotenv
from database import *



# Example requiremnts
# 1. The system must allow users to log in with email and password.
# 2. The system must send email notifications for important events.
# 3. Users must be able to view their order history.
# 4. The system must have a password recovery option.
# 5. Users can customize their notification preferences.

load_dotenv()

def access_secret():
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/hero-alliance-feup-ds-24-25/secrets/superhero-04-02-secret/versions/latest"
        response = client.access_secret_version(request={"name": name})
        os.environ["API_KEY"] = response.payload.data.decode("UTF-8")
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        print(f"Error accessing secret using ADC: {e}")
        return os.getenv("API_KEY", None)
    
api_key = access_secret()


genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

blueprint = Blueprint("gemini_api", __name__)

INVEST_text = (
    "Must follow the INVEST characteristics.\n"
    "INVEST is an acronym that defines the essential characteristics of a good user story in agile development.\n"
    "Independent: Each user story should be self-contained, without relying on others to be completed:\n"
    "Negotiable: The details of the story can be discussed and adjusted as needed by the project.\n"
    "Valuable: The story should provide real value to the user or the business.\n"
    "Estimable: The complexity of the story should be quantifiable to allow for the creation of a realistic development plan.\n"
    "Small: The story should be small enough to be completed within a sprint.\n"
    "Testable: The story should have clear acceptance criteria, allowing verification of whether it has been implemented correctly.\n"
)

@blueprint.route("/generate", methods=["POST"])
def generate_response():
    data = request.get_json()
    project_name = data.get("name")
    query = data.get("query")
    language = data.get("language", "en")
    
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
        f"With the use of the following requirements, give a list of user stories\n",
        f"The user stories have the format: {format_info['user_story']}\n",
        INVEST_text,
        'Give in a JSON format, where there is "index" and the "user_story" are type string so wrapped in quotation marks.\n',
        "The result must be only a JSON list, no more information.\n",
        "Don't add any more text or newlines to the JSON, without ```json```.\n",
        f"Generate the response in {language} language.\n",
        f"Here is the requirements:\n{query}.",
    ])

    response = model.generate_content(prompt)
    result = response.text.replace("```json", "").replace("```", "")

    project_info = save_project(project_name)

    requirements_id = save_requirement(project_info[0], query, True)

    save_user_stories(project_info[0], requirements_id, result)

    content = {
        "project_id" : project_info[0],
        "user_stories" : result
    }

    return jsonify({"response": content}), 200


@blueprint.route("/regenerate", methods=["POST"])
def regenerate_response():
    data = request.get_json()
    project_id = data.get("project_id")
    req_version = data.get("req_version")
    query = data.get("query")
    newContent = data.get("newContent")
    language = data.get("language", "en")
    
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
        f"With the use of the following requirements, give a list of user stories\n",
        f"The user stories have the format: {format_info['user_story']}\n",
        INVEST_text,
        'Give in a JSON format, where there is "index" and the "user_story" are type string so wrapped in quotation marks\n',
        "The result must be only a JSON list, no more information.\n",
        "Don't add any more text or newlines to the JSON, without ```json```.\n",
        f"Generate the response in {language} language.\n",
        f"Here is the requirements:\n{query}.",
    ])
    response = model.generate_content(prompt)
    result = response.text.replace("```json", "").replace("```", "")

    if(newContent):
        requirements_id = save_requirement(project_id, query, newContent)
    else:
        requirements_id = get_requirement_id(project_id, req_version)
    
    if(requirements_id == None):
        return jsonify({"error": "Requirement don't exist"}), 404
    

    save_user_stories(project_id, requirements_id, result)

    return jsonify({"response": result}), 200
