from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from api.utils.github_api import (
    get_issues,
    get_user_stories,
    get_commits,
    get_contributors_activity,
    get_all_commits,
)
from api.utils.gemini_api import send_prompt


def handle_api_response(data, success_prompt):
    """
    Handle the response for API calls.

    :param data: Data fetched from an external API.
    :param success_prompt: The prompt to send if data is valid.
    :return: Response object.
    """
    if not data:
        return Response(
            {"error": "Failed to find repo. Make sure it's public or data exists."},
            status=404,
        )

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
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastCommitHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": [\n'
        "      {\n"
        '        "description": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ]\n"
        "  },\n"
        '  "meta": {\n'
        '    "analyzedCommits": 0, // integer\n'
        '    "analyzedBranches": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
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
        f"Be as extensive as you want to explain why you think the pattern is present.\n{issues}\n\n"
        "Please output it in the following JSON format: {\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastIssueHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedIssues": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}"
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
        return Response(
            {"error": "Failed to find repo or no user stories available."}, status=404
        )

    prompt = (
        "Analyze the following user stories for complexity and identify potential architectural challenges. "
        "Provide insights based on their descriptions and story points. Please return your response in the following JSON format:\n"
        "{\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [],\n'
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedUserStories": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}\n\n"
    )
    for story in user_stories:
        prompt += f"Description:\n{story['description']}\n"
        if story.get("story_points") is not None:
            prompt += f"Story Points: {story['story_points']}\n"
        prompt += "\n"

    response = send_prompt(prompt)
    return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_contributors_activity(request, repo_owner, repo_name):
    """
    Analyze contributors' activity in a GitHub repository to understand how habits influence architecture.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    contributors_activity = get_contributors_activity(repo_owner, repo_name)
    if not contributors_activity:
        return Response(
            {"error": "Failed to fetch contributors' activity."}, status=404
        )

    prompt = (
        "Analyze the following contributors' activity for patterns or habits that might influence the architecture. "
        "Identify any areas where their contributions impact architectural decisions.\n\n"
        f"{contributors_activity}\n"
        "Please output it in the following JSON format: {\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastIssueHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedIssues": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}"
    )
    response = send_prompt(prompt)
    return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_commit_sizes(request, repo_owner, repo_name):
    """
    Monitor commit sizes to identify areas needing architectural refactoring.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    commits = get_all_commits(repo_owner, repo_name)
    if not commits:
        return Response({"error": "Failed to fetch commits."}, status=404)

    prompt = (
        "Analyze the sizes of the following commits to identify areas where the architecture might become complex "
        "or need refactoring. Highlight any unusually large commits and their potential impact on the architecture.\n\n"
        "Please output it in the following JSON format: {\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastIssueHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedIssues": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}"
    )
    for commit in commits:
        commit_message = commit.get("commit", {}).get("message", "")
        commit_size = commit.get("stats", {}).get(
            "total", 0
        )  # Requires enabling commit stats API
        prompt += f"Commit Message: {commit_message}\nSize: {commit_size}\n\n"

    response = send_prompt(prompt)
    return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_architecture_trends(request, repo_owner, repo_name):
    """
    Analyze historical trends in architectural patterns over time.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    commits = get_all_commits(repo_owner, repo_name)
    if not commits:
        return Response({"error": "Failed to fetch commits."}, status=404)

    prompt = (
        "Analyze the historical trends in architectural patterns based on the following commits. "
        "Describe how the architecture evolved over time and the possible reasons for changes.\n\n"
        "Please output it in the following JSON format: {\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastIssueHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedIssues": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}"
    )
    for commit in commits:
        commit_message = commit.get("commit", {}).get("message", "")
        commit_date = commit.get("commit", {}).get("committer", {}).get("date", "")
        prompt += f"Commit Date: {commit_date}\nMessage: {commit_message}\n\n"

    response = send_prompt(prompt)
    return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_full_repo(request, repo_owner, repo_name):
    """
    Perform a comprehensive analysis of a GitHub repository using all available data.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    # Fetch data from all endpoints
    commits = get_all_commits(repo_owner, repo_name)
    issues = get_issues(repo_owner, repo_name)
    user_stories = get_user_stories(repo_owner, repo_name)
    contributors_activity = get_contributors_activity(repo_owner, repo_name)

    # Check if at least one data source is available
    if not (commits or issues or user_stories or contributors_activity):
        return Response(
            {"error": "Failed to fetch any data from the repository."}, status=404
        )

    # Construct the prompt
    prompt = (
        "Perform a comprehensive analysis of the following GitHub repository based on the provided data. "
        "Identify potential architectural patterns, challenges, and recommendations for improvement.\n\n"
        "Please output it in the following JSON format: {\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastIssueHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedIssues": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}"
    )

    # Add commits data
    if commits:
        prompt += "### Commits:\n"
        for commit in commits[
            :5
        ]:  # Include a summary of the first 5 commits for brevity
            commit_message = commit.get("commit", {}).get("message", "")
            commit_date = commit.get("commit", {}).get("committer", {}).get("date", "")
            prompt += f"- Date: {commit_date}, Message: {commit_message}\n"
        prompt += "\n"

    # Add issues data
    if issues:
        prompt += "### Issues:\n"
        for issue in issues[:5]:  # Include a summary of the first 5 issues
            title = issue.get("title", "")
            body = issue.get("body", "")
            prompt += f"- Title: {title}\n  Description: {body}\n"
        prompt += "\n"

    # Add user stories data
    if user_stories:
        prompt += "### User Stories:\n"
        for story in user_stories[:5]:  # Include a summary of the first 5 user stories
            description = story.get("description", "")
            story_points = story.get("story_points", "Unknown")
            prompt += f"- Description: {description}\n  Story Points: {story_points}\n"
        prompt += "\n"

    # Add contributors' activity data
    if contributors_activity:
        prompt += "### Contributors' Activity:\n"
        for contributor in contributors_activity[
            :5
        ]:  # Include the first 5 contributors
            login = contributor.get("login", "Unknown")
            contributions = contributor.get("contributions", 0)
            prompt += f"- Contributor: {login}, Contributions: {contributions}\n"
        prompt += "\n"

    # Send the consolidated prompt to the analysis function
    response = send_prompt(prompt)
    return Response(response)


@csrf_exempt
@api_view(["GET"])
def analyze_commit_activity(request, repo_owner, repo_name):
    """
    Analyze commits activity in a GitHub repository to understand how habits influence architecture.
    Focused on the commit activity (frequency, size, etc.) of all contributors.

    :param request: The HTTP request.
    :param repo_owner: GitHub repository owner.
    :param repo_name: GitHub repository name.
    :return: JSON response with analysis.
    """
    commits = get_all_commits(repo_owner, repo_name)
    if not commits:
        return Response({"error": "Failed to fetch commits."}, status=404)

    prompt = (
        "Analyze the commit activity of all contributors in the following GitHub repository to understand how habits influence architecture. "
        "Focus on the commit frequency, size, and patterns to identify areas that might require architectural refactoring.\n\n"
        "Describe how the commit acitvity evolved over time and the possible reasons for changes.\n\n"
        "Please output it in the following JSON format: {\n"
        '  "repositoryAnalysis": {\n'
        '    "repoName": "", // string\n'
        '    "lastIssueHash": "", // string\n'
        '    "analysisDate": "", // string (ISO date format)\n'
        '    "predictedDesignPatterns": [\n'
        "      {\n"
        '        "patternName": "", // string\n'
        '        "confidence": 0.0, // float (0.0 to 1.0)\n'
        '        "evidence": [\n'
        "          {\n"
        '            "type": "", // string ("file", "commit", "branch", etc.)\n'
        '            "path": "", // string (file path or branch name)\n'
        '            "reason": "" // string (explanation of why this is evidence)\n'
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ],\n"
        '    "unusualPatterns": []\n'
        "  },\n"
        '  "meta": {\n'
        '    "analyzedIssues": 0, // integer\n'
        '    "linesOfCode": 0, // integer\n'
        '    "toolVersion": "" // string\n'
        "  }\n"
        "}"
    )
    for commit in commits:
        commit_message = commit.get("commit", {}).get("message", "")
        commit_date = commit.get("commit", {}).get("committer", {}).get("date", "")
        prompt += f"Commit Date: {commit_date}\nMessage: {commit_message}\n\n"

    response = send_prompt(prompt)
    return Response(response)
