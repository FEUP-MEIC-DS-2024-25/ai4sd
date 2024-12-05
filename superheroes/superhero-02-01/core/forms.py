from django import forms
from .models import Project

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'github_link']
        #, 'plantuml_code', 'response']

# Form for editing an existing project
class ProjectEditForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'plantuml_code']