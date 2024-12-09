from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from database import *

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

    if(newContent):
        requirements_id = save_requirement(project_id, query, newContent)
    else:
        requirements_id = get_requirement_id(project_id, req_version)
    
    if(requirements_id == None):
        return jsonify({"error": "Requirement don't exist"}), 404
    

    save_user_stories(project_id, requirements_id, result)

    return jsonify({"response": result}), 200