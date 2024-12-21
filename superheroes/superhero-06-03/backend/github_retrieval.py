# api/views.py

from github import Github, Auth


def get_github_artifacts(repo_url, token=None):
    _, _, _, owner, repo = repo_url.rstrip('/').split('/')
    g = Github(auth=Auth.Token(token)) if token else Github()

    try:
        repo = g.get_repo(f"{owner}/{repo}")
    except Exception as e:
        print(f"Error getting repository: {e}")
        return []
    
    artifacts = []
    def process_contents(contents):
        for content in contents:
            if content.type == 'file':
                if content.name.endswith(('.txt', '.md', '.py', '.java', 'js', 'html', 'css')):
                    file_content = content.decoded_content.decode('utf-8')
                    artifacts.append({
                        'name': content.name,
                        'path': content.path,
                        'content': file_content
                    })
            elif content.type == 'dir':
                process_contents(repo.get_contents(content.path))

    process_contents(repo.get_contents(""))
    return artifacts



