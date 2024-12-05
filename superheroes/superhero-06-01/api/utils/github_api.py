import requests

# Function to get issues
def get_issues(repo_owner, repo_name):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch issues: {response.status_code}")
        return None

# Function to get pull requests
def get_pull_requests(repo_owner, repo_name):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/pulls"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch pull requests: {response.status_code}")
        return None

# Function to get branches
def get_branches(repo_owner, repo_name):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/branches"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch branches: {response.status_code}")
        return None

# Function to get commits
def get_commits(repo_owner, repo_name, branch="master"):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits?sha={branch}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch commits: {response.status_code}")
        return None