from flask import Blueprint, request, jsonify
from database import *

api = Blueprint('api', __name__)

@api.route('/projects', methods=['GET'])
def get_projects():
    try:
        projects = get_all_projects()
        return jsonify({"response": projects}), 200
    except Exception as e:
        print(f"Error fetching projects: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500


@api.route('/project/<int:project_id>/content', methods=['GET'])
def get_content(project_id):
    try:
        content = get_project_content(str(project_id))
        if content is None:
            return jsonify({"error": "Project not found"}), 404
        return jsonify({"response": content}), 200
    except Exception as e:
        print(f"Error fetching content: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@api.route('/project/<int:project_id>/delete/', methods=['DELETE'])
def delete_proj(project_id):
    try:
        delete_project(project_id)
        return jsonify({"response": "Project deleted successfully"}), 200
    except Exception as e:
        print(f"Error fetching projects: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500
    
############################################################################################
#NEED FIX

@api.route('/project/userstory/feedback', methods=['POST'])
def user_story_feedback():
    try:
        data = request.get_json()
        project_id = data.get("project_id")
        req_version = data.get("req_version")
        version = data.get("version")
        index =  data.get("index")
        feedback = data.get("feedback")        
        update_user_story_feedback(project_id, req_version, version, index, feedback)
        return jsonify({"response": "Feedback add with success"}), 200
    except Exception as e:
        print(f"Error: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500
    
    
@api.route('/project/userstory/update', methods=['POST'])
def user_story_update():
    try:
        data = request.get_json()
        project_id = data.get("project_id")
        req_version = data.get("req_version")
        version = data.get("version")
        index =  data.get("index")
        content = data.get("content") 
        #update_user_story_content(project_id, req_version, version, index, content)
        update_user_story_content(str(1), 1, str(1), 1, "OLA")
        return jsonify({"response": "Update made with success"}), 200
    
    except ValueError as ve:
        error_message = str(ve)
        error_message = f"Error: {ve}, Project ID: {project_id}, Req Version: {req_version}, Version: {version}, Index: {index}, Content: {content}"
        return jsonify({"error": error_message}), 400  
    
    except Exception as e:
        print(f"Error: {e}")
        error_message = f"Error: {e}, Project ID: {project_id}, Req Version: {req_version}, Version: {version}, Index: {index}, Content: {content}"
        return jsonify({"error": error_message}), 500

