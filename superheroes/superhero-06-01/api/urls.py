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
    path(
        "analyze_contributors/<str:repo_owner>/<str:repo_name>",
        views.analyze_contributors_activity,
        name="analyze_contributors_activity",
    ),
    path(
        "analyze_commit_sizes/<str:repo_owner>/<str:repo_name>",
        views.analyze_commit_sizes,
        name="analyze_commit_sizes",
    ),
    path(
        "analyze_architecture_trends/<str:repo_owner>/<str:repo_name>",
        views.analyze_architecture_trends,
        name="analyze_architecture_trends",
    ),
    path(
        "analyze_full_repo/<str:repo_owner>/<str:repo_name>",
        views.analyze_full_repo,
        name="analyze_full_repo",
    ),
]

