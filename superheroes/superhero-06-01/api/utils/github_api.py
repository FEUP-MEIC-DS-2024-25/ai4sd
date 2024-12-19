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
def get_commits(repo_owner, repo_name, branch="main"):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits?sha={branch}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch commits: {response.status_code}")
        return None
    
def get_user_stories(repo_owner, repo_name):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    params = {'state': 'all'}  # Fetch both open and closed issues
    response = requests.get(url, params=params)
    if response.status_code == 200:
        issues = response.json()
        user_stories = []
        for issue in issues:
            # Extract the title and body as the description
            title = issue.get('title', '')
            body = issue.get('body', '')
            if title == None:
                title = ""
            if body == None:
                body = ""
            description = title + '\n' + body
            # Extract story points from labels or body (assuming story points are labeled or mentioned)
            story_points = extract_story_points(issue)
            user_stories.append({
                'description': description,
                'story_points': story_points,
                'url': issue.get('html_url', '')
            })
        return user_stories
    else:
        print(f"Failed to fetch issues: {response.status_code}")
        return None

def extract_story_points(issue):
    # Example logic to extract story points from labels
    for label in issue.get('labels', []):
        if 'story point' in label['name'].lower():
            try:
                return int(label['name'].split()[-1])  # Assumes label format like "Story Point: 5"
            except ValueError:
                continue
    # Alternatively, parse the body to find story points
    # Implement your parsing logic here
    return None