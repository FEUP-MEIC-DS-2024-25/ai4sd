from flask import abort
from db import db
import json

# Get all projets
def get_all_projects():
    projects_ref = db.collection("ReqToStory").stream()
    return [{"id": project.id, "name": project.to_dict().get("name")} for project in projects_ref]

# Get project by id
def get_project_by_id(project_id):
    project_ref = db.collection("ReqToStory").document(project_id).get()
    if project_ref.exists:
        return {"id": project_ref.id}
    return None

# Get all project content
def get_project_content(project_id):
    project = get_project_by_id(project_id)
    if not project:
        return None
    project_content = []
    requirements_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").stream()

    for requirement in requirements_ref:
        original_data = requirement.to_dict()
        user_stories = get_user_stories_by_requirement_id(project_id, requirement.id)
        req_dict = {
            "version": original_data.get("version"),
            "content": original_data.get("content"),
            "user_stories": user_stories,
        }
        project_content.append(req_dict)

    return project_content

# Fetches user stories associated with a specific requirement ID.
def get_user_stories_by_requirement_id(project_id, req_id):
    """
    Fetches user stories associated with a specific requirement ID.

    Args:
        project_id (str): The project ID.
        req_id (str): The requirement ID.

    Returns:
        list: A list of dictionaries, where each dictionary contains user story data for a specific version.
            The dictionary structure is:
            {
                "version": int,
                "user_stories": list
            }
    """
    all_content = []

    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)
    user_stories_versions_ref = req_ref.collection("UserStoriesVersion")

    for us_version in user_stories_versions_ref.stream():
      version_dict = us_version.to_dict()
      user_stories_list = []

      # Get user stories for this specific version
      user_stories_ref = us_version.reference.collection("UserStory")  # Use reference for cleaner code
      user_stories_docs = user_stories_ref.stream()  

      for us_doc in user_stories_docs:
        user_story_data = us_doc.to_dict()
        user_stories_list.append(user_story_data)

      us_dict = {
        "version": version_dict.get("version"),
        "user_stories": user_stories_list
      }

      all_content.append(us_dict)

    return all_content


# Save project 
def save_project(name):
    projects_ref = db.collection("ReqToStory")
    existing_project = projects_ref.where("name", "==", name).stream()

    for project in existing_project:
        project_data = project.to_dict() 
        return (project.id, project_data.get("n_versions", 0))
    
    docs = projects_ref.stream()
    
    max_id = 0
    for doc in docs:
        try:
            doc_id = int(doc.id)  
            if doc_id > max_id:
                max_id = doc_id
        except ValueError:
            continue

    id = max_id + 1


    new_project = projects_ref.document(str(id))
    new_project.set({"name": name, "n_versions": 0})

    return (new_project.id, 0) 

# Save requirement of a project
def save_requirement(project_id, content, new):
    project_ref = db.collection("ReqToStory").document(project_id)
    requirements_ref = project_ref.collection("Requirements")

    doc_snapshot = project_ref.get()
    
    if doc_snapshot.exists:
        data = doc_snapshot.to_dict()
        last_version = data.get("n_versions", 0)
    else:
        last_version = 0

    if new:
        requirement = requirements_ref.document()
        requirement.set({
            "version": last_version + 1,
            "content": content,
            "n_us_versions": 0
        })

        project_ref.update({"n_versions": last_version + 1})

        return requirement.id

    else:
        requirement = requirements_ref.where("version", "==", last_version).get()

        if requirement:
            requirement = requirement[0] 
        else:
            requirement = None  

    if requirement:
        return requirement.id 
    else:
        return None 

# Get requirement id by the project and its version
def get_requirement_id(project_id, version):
    project_ref = db.collection("ReqToStory").document(project_id)
    requirements_ref = project_ref.collection("Requirements")
    requirements = requirements_ref.where("version", "==", version).get()

    if requirements:
        requirement = requirements[0]
        return requirement.id 
    else:
        return None 

#Find place where save user stories
def save_user_stories(project_id, req_id, user_stories):
    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)


    req_doc = req_ref.get()

    if req_doc.exists:

        n_us_versions = req_doc.to_dict().get('n_us_versions', 0)

        req_us = req_ref.collection("UserStoriesVersion")

        new_user_stories_version = req_us.document(str(n_us_versions + 1))

        new_user_stories_version.set({
            "version": n_us_versions + 1,
        })

        us_collection= new_user_stories_version.collection("UserStory")

        save_user_story(us_collection, user_stories)

        req_ref.update({"n_us_versions": n_us_versions + 1})

# Save user stories
def save_user_story(doc, user_stories):
    user_stories = json.loads(user_stories)
    for us in user_stories:
        user_story = doc.document(str(us["index"]))
        user_story.set({
            "index": us["index"],
            "user_story": us["user_story"],
            "feedback": 0
        })

# update user story content
def update_user_story_content(project_id, req_version, version, index, content):
    req_id = get_requirement_id(project_id, req_version)
    if not req_id:
        raise ValueError("Requirement ID not found.")
    
    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)
    us_version = req_ref.collection("UserStoriesVersion").document(version)
    us = us_version.collection("UserStory")

    user_story = us.where("index", "==", index).get()
    if len(user_story) != 1:
        raise ValueError("More than one or no user stories match the given index.")
    
    user_story_ref = user_story[0].reference
    user_story_ref.update({"user_story": content})

# update user story feedback
def update_user_story_feedback(project_id, req_version, version, index, feedback):
    req_id = get_requirement_id(project_id, req_version)
    if not req_id:
        raise ValueError("Requirement ID not found.")
    
    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)
    us_version = req_ref.collection("UserStoriesVersion").document(version)
    us = us_version.collection("UserStory")

    user_story = us.where("index", "==", index).get()
    if len(user_story) != 1:
        raise ValueError("More than one or no user stories match the given index.")
    
    user_story_ref = user_story[0].reference
    user_story_ref.update({"feedback": feedback})


# Delete project by id
def delete_project(id):
    project_ref = db.collection("ReqToStory").document(id)
    if not project_ref.exists: 
        abort(404, description="Project not found") 
    project_ref.delete()

# Delete requirement by project_id and its vertion
def delete_requirement(project_id, req_id):
    req_id = get_requirement_id(project_id, req_id)
    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)
    if(req_ref):
        req_ref.delete()

# Delete user story
def delete_user_story(project_id, req_version, version, index):
    req_id = get_requirement_id(project_id, req_version)
    if not req_id:
        raise ValueError("Requirement ID not found.")
    
    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)
    us_version = req_ref.collection("UserStoriesVersion").document(version)
    us = us_version.collection("UserStory")

    user_story = us.where("index", "==", index).get()
    if len(user_story) != 1:
        raise ValueError("More than one or no user stories match the given index.")
    
    user_story_ref = user_story[0].reference
    user_story_ref.delete()
    