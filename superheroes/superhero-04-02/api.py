from flask import Blueprint, request, jsonify,  render_template
import json

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


#@api.route("/create_project", methods=["POST"])
#def create_theme():
#    data = request.get_json()
#    print(data.get("name"))
#
#    if not data or not data.get("name"):
#        return jsonify({"error": "Missing theme name"}), 400
#
#    project_name = data["name"]
#    project = add_theme(project_name)
#
#    if project == None:
#        return jsonify({"message": "Theme already exist"}), 201
#    return jsonify({"message": "Theme created successfully"}), 201
#
#@api.route('/', methods=['GET', 'POST'])
#def index():
#    if request.method == 'POST':
#        project_name = request.form['name']
#        # ... outros campos
#
#        # Salvar no banco de dados (substitua por sua lógica)
#        project_id = len(projects) + 1
#        projects[project_id] = {'name': project_name, ...}
#
#        return redirect(url_for('project_details', project_id=project_id))
#
#    return render_template('create_project.html')
#
#@api.route('/project/<int:project_id>')
#def project_details(project_id):
#    project = get_project_by_id(project_id)
#    if project:
#        return render_template('index.html', project=project)
#    else:
#        return jsonify({"error": "Project not found"}), 404
#

#@api.route("/add_theme", methods=["POST"])
#def create_theme():
#    data = request.get_json()
#    print(data.get("name"))
#
#    if not data or not data.get("name"):
#        return jsonify({"error": "Missing theme name"}), 400
#
#    theme_name = data["name"]
#    theme = add_theme(theme_name)
#
#    if theme == None:
#        return jsonify({"message": "Theme already exist"}), 201
#    return jsonify({"message": "Theme created successfully"}), 201