from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'github_username', 'github_token']
    search_fields = ['user__username', 'github_username']