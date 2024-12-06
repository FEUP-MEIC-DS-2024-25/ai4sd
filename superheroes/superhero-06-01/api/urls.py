from django.urls import path
from . import views

urlpatterns = [
    path(
        "analyze_repo/<str:repo_owner>/<str:repo_name>",
        views.analyze_repo_commits,
        name="analyze_repo_commits",
    ),
    path(
        "analyze_repo_issues/<str:repo_owner>/<str:repo_name>",
        views.analyze_repo_issues,
        name="analyze_repo_issues",
    ),
    path(
        "analyze_user_stories/<str:repo_owner>/<str:repo_name>",
        views.analyze_user_stories,
        name="analyze_user_stories",
    ),
]

