import os
import shutil
from django.shortcuts import render, get_object_or_404, redirect
from .models import Project
from .forms import ProjectForm, ProjectEditForm
from django.conf import settings

# View to create a project
def create_project(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save()
            return redirect('view_project', project_id=project.id)
    else:
        form = ProjectForm()
    
    return render(request, 'create_project.html', {'form': form})

# View to display a project
def view_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    plantuml_image_url = f"{settings.MEDIA_URL}plantuml_images/{project.id}_diagram.png"
    return render(request, 'view_project.html', {'project': project, 'plantuml_image_url': plantuml_image_url})

# View to edit a project (only plantuml code and name can be updated)
def edit_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    if request.method == 'POST':
        form = ProjectEditForm(request.POST, instance=project)
        if form.is_valid():
            project = form.save(commit=False)
            project.save(update_fields=['name', 'plantuml_code'])
            return redirect('view_project', project_id=project.id)
    else:
        form = ProjectEditForm(instance=project)
    
    return render(request, 'edit_project.html', {'form': form, 'project': project})

# list all projects
def list_projects(request):
    projects = Project.objects.all()
    return render(request, 'list_projects.html', {'projects': projects})

# View to delete a project
def delete_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    plantuml_image_path = f"{settings.MEDIA_ROOT}/plantuml_images/{project.id}_diagram.png"
    plantuml_input = f"{settings.MEDIA_ROOT}/plantuml_input/{project.id}.txt"
    project_repo = project.github_link.split('/')[-1]
    repo = f"{settings.MEDIA_ROOT}/repos/{project_repo}" 
    project.delete()
    if os.path.exists(plantuml_image_path):
        os.remove(plantuml_image_path)
    if os.path.exists(plantuml_input):
        os.remove(plantuml_input)
    if os.path.exists(repo):
        shutil.rmtree(repo)
    return redirect('list_projects')
