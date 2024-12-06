from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from api.utils.github_api import get_issues, get_user_stories, get_commits
from api.utils.gemini_api import send_prompt


def handle_api_response(data, success_prompt):
    """
    Handle the response for API calls.

    :param data: Data fetched from an external API.
    :param success_prompt: The prompt to send if data is valid.
    :return: Response object.
    """
    if not data:
        return Response({"error": "Failed to find repo. Make sure it's public or data exists."}, status=404)
    
    response = send_prompt(success_prompt)
    return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_repo_commits(request, repo_owner, repo_name):
    """
    Analyze commits of a GitHub repository for architectural patterns.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    commits = get_commits(repo_owner, repo_name)
    prompt = (
        f"I will send you commits, and you will answer with the architectural patterns that you can find from the commits. "
        f"Be as extensive as you want to explain why you think the pattern is present.\n{commits}\n\n"
        "Please output it in the following JSON format: {\n"
        "  \"repositoryAnalysis\": {\n"
        "    \"repoName\": \"\", // string\n"
        "    \"lastCommitHash\": \"\", // string\n"
        "    \"analysisDate\": \"\", // string (ISO date format)\n"
        "    \"predictedDesignPatterns\": [\n"
        "      {\n"
        "        \"patternName\": \"\", // string\n"
        "        \"confidence\": 0.0, // float (0.0 to 1.0)\n"
        "        \"evidence\": [\n"
        "          {\n"
        "            \"type\": \"\", // string (\"file\", \"commit\", \"branch\", etc.)\n"
        "            \"path\": \"\", // string (file path or branch name)\n"
        "            \"reason\": \"\" // string (explanation of why this is evidence)\n"
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        "    \"unusualPatterns\": [\n"
        "      {\n"
        "        \"description\": \"\", // string\n"
        "        \"confidence\": 0.0, // float (0.0 to 1.0)\n"
        "        \"evidence\": [\n"
        "          {\n"
        "            \"type\": \"\", // string (\"file\", \"commit\", \"branch\", etc.)\n"
        "            \"path\": \"\", // string (file path or branch name)\n"
        "            \"reason\": \"\" // string (explanation of why this is evidence)\n"
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ]\n"
        "  },\n"
        "  \"meta\": {\n"
        "    \"analyzedCommits\": 0, // integer\n"
        "    \"analyzedBranches\": 0, // integer\n"
        "    \"linesOfCode\": 0, // integer\n"
        "    \"toolVersion\": \"\" // string\n"
        "  }\n"
        "}"
    )
    return handle_api_response(commits, prompt)


@csrf_exempt
@api_view(["GET"])
def analyze_repo_issues(request, repo_owner, repo_name):
    """
    Analyze issues of a GitHub repository for architectural patterns.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    issues = get_issues(repo_owner, repo_name)
    prompt = (
        f"I will send you issues, and you will answer with the architectural patterns that you can find from the issues. "
        f"Be as extensive as you want to explain why you think the pattern is present.\n{issues}\n"
    )
    return handle_api_response(issues, prompt)


@csrf_exempt
@api_view(["GET"])
def analyze_user_stories(request, repo_owner, repo_name):
    """
    Analyze user stories of a GitHub repository for complexity and architectural challenges.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    user_stories = get_user_stories(repo_owner, repo_name)
    if not user_stories:
        return Response({"error": "Failed to find repo or no user stories available."}, status=404)

    prompt = (
        "Analyze the following user stories for complexity and identify potential architectural challenges. "
        "Provide insights based on their descriptions and story points.\n\n"
    )
    for story in user_stories:
        prompt += f"Description:\n{story['description']}\n"
        if story.get('story_points') is not None:
            prompt += f"Story Points: {story['story_points']}\n"
        prompt += "\n"

    response = send_prompt(prompt)
    return Response(response)
