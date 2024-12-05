from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from api.utils.github_api import get_issues
from api.utils.github_api import get_commits
from api.utils.gemini_api import send_prompt


@csrf_exempt
@api_view(["GET"])
def analyze_repo_commits(request, repo_owner, repo_name):
    commits = get_commits(repo_owner, repo_name)
    if not commits:
        return Response("Failed to find repo. Make sure it's public", 404)
    else:
        response = send_prompt(
            f"I will send you commits, and you will answer with the architectural patterns that you can find from the commits. Be as extensive as you want to explain why do you think that the pattern is present. \n{commits}\n"
        )
        return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_repo_issues(request, repo_owner, repo_name):
    issues = get_issues(repo_owner, repo_name)
    if not issues:
        return Response("Failed to find repo. Make sure it's public", 404)
    else:
        response = send_prompt(
            f"I will send you issues, and you will answer with the architectural patterns that you can find from the issues. Be as extensive as you want to explain why do you think that the pattern is present. \n{issues}\n"
        )
        return Response(response)
