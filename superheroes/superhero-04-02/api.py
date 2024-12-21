from flask import Blueprint, request, jsonify
from database import *

api = Blueprint('api', __name__)


# Api to get all projects
@api.route('/projects', methods=['GET'])
def get_projects():
    try:
        projects = get_all_projects()
        return jsonify({"response": projects}), 200
    except Exception as e:
        print(f"Error fetching projects: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500

# Api to get all projects
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

# Api delete a projects
@api.route('/project/<int:project_id>/delete/', methods=['DELETE'])
def delete_proj(project_id):
    try:
        delete_project(project_id)
        return jsonify({"response": "Project deleted successfully"}), 200
    except Exception as e:
        print(f"Error fetching projects: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500
    
# Api to give feedback to a user storie
@api.route('/project/userstory/feedback', methods=['POST'])
def user_story_feedback():
    try:
        data = request.get_json()
        project_id = data.get("project_id")
        req_version = data.get("req_version")
        version = data.get("version")
        index =  data.get("index")
        feedback = data.get("feedback")        
        update_user_story_feedback(str(project_id), req_version, str(version), str(index), feedback)
        return jsonify({"response": "Feedback add with success"}), 200
    except ValueError as ve:
        error_message = str(ve)
        return jsonify({"error": error_message}), 400  
    except Exception as e:
        print(f"Error: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500
    
# Api to update user storie
@api.route('/project/userstory/update', methods=['POST'])
def user_story_update():
    try:
        data = request.get_json()
        project_id = data.get("project_id")
        req_version = data.get("req_version")
        version = data.get("version")
        index =  data.get("index")
        content = data.get("content") 
        update_user_story_content(str(project_id), req_version, str(version), str(index), content)
        return jsonify({"response": "Update made with success"}), 200
    
    except ValueError as ve:
        error_message = str(ve)
        return jsonify({"error": error_message}), 400  
    
    except Exception as e:
        print(f"Error: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500

# Api to delete user story
@api.route('/project/userstory/delete', methods=['POST'])
def user_story_delete():
    try:
        data = request.get_json()
        project_id = data.get("project_id")
        req_version = data.get("req_version")
        version = data.get("version")
        index =  data.get("index") 
        delete_user_story(str(project_id), req_version, str(version), str(index))
        return jsonify({"response": "User deleted successfully"}), 200
    
    except ValueError as ve:
        error_message = str(ve)
        return jsonify({"error": error_message}), 400  
    
    except Exception as e:
        print(f"Error: {e}")
        error_message = str(e)
        return jsonify({"error": error_message}), 500
