from db import db

def get_all_projects():
    projects_ref = db.collection("ReqToStory").stream()
    return [{"id": project.id, "name": project.to_dict().get("name")} for project in projects_ref]

def get_project_by_id(project_id):
    project_ref = db.collection("ReqToStory").document(project_id).get()
    if project_ref.exists:
        return {"id": project_ref.id}
    return None

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


def get_user_stories_by_requirement_id(project_id, req_id):
    user_stories_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id).collection("UserStories")

    user_stories_versions = user_stories_ref.stream()

    all_content = []

    for us_version in user_stories_versions:
        story_data = us_version.to_dict()
        us_dict = {
            "version": story_data.get("version"),
            "user_stories": story_data.get("user_stories")
        }
        all_content.append(us_dict)

    return all_content



def save_project(name):
    projects_ref = db.collection("ReqToStory")
    existing_project = projects_ref.where("name", "==", name).stream()

    for project in existing_project:
        return (project.id, project.n_versions) 
    
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


def save_requirement(project_info, content, new):
    project_ref = db.collection("ReqToStory").document(project_info[0])
    requirements_ref = project_ref.collection("Requirements")

    if new:
        requirement = requirements_ref.document()
        requirement.set({
            "version": project_info[1] + 1,
            "content": content,
            "n_us_versions": 0
        })

        project_ref.update({"n_versions": project_info[1] + 1})

        return requirement.id

    else:
        last_version = len(list(requirements_ref.stream()))

        requirement = requirements_ref.where("version", "==", last_version).get()

        if requirement:
            requirement = requirement[0] 
        else:
            requirement = None  

    if requirement:
        return requirement.id 
    else:
        return None  

def save_user_stories(project_id, req_id, user_stories):
    req_ref = db.collection("ReqToStory").document(project_id).collection("Requirements").document(req_id)


    req_doc = req_ref.get()

    if req_doc.exists:

        n_us_versions = req_doc.to_dict().get('n_us_versions', 0)

        req_us = req_ref.collection("UserStories")

        new_user_stories = req_us.document()
        new_user_stories.set({
            "version": n_us_versions + 1,
            "user_stories": user_stories
        })

        req_ref.update({"n_us_versions": n_us_versions + 1})
