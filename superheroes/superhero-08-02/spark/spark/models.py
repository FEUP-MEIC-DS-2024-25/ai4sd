from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    github_username = models.CharField(max_length=39, blank=True, null=True, unique=True)
    github_token = models.CharField(max_length=255, blank=True, null=True)
    miro_token = models.CharField(max_length=255, blank=True, null=True)

    def owned_projects(self):
        return self.owned_projects.all()
    
    def member_projects(self):
        return self.member_projects.all()

    def __str__(self):
        return self.user.username
    
class SparkProject(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    github_project_link = models.URLField(blank=True, null=True, unique=True)
    miro_board_link = models.URLField(blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(Profile, related_name='member_projects', blank = True)

    def __str__(self):
        return self.name