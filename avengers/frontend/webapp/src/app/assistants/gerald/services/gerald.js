import { SUPPORTED_FILE_TYPES } from '../constants/fileTypes';


const APIURL = 'http://localhost:8000';

export async function createProject() {
    const url = new URL(window.location.href);
    let githubAccountName = url.searchParams.get("username");
    let githubRepoName = url.searchParams.get("repo");
    const response = await fetch(`${APIURL}/create_project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            github_account_name: githubAccountName,
            github_repo_name: githubRepoName
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error creating project: ${errorData.error}`);
    }

    const data = await response.json();
    return data.project;
}

export async function createChatSession(projectId) {
    const response = await fetch(`${APIURL}/create_chat_session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            project_id: projectId
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error creating chat session: ${errorData.error}`);
    }

    const data = await response.json();
    return data.session_id;
}

export function refreshUserToken() {
    window.location.href = "http://localhost:8000/auth/github-login";
}

export function getUserToken() {
    //get token from url
    const url = new URL(window.location.href);
    let token = url.searchParams.get("token");
    if (!token) {
        token = localStorage.getItem("userToken");
    } else {
        localStorage.setItem("userToken", token);
    }
    return token;
}

export async function getProjectId() {
    const url = new URL(window.location.href);
    let githubAccountName = url.searchParams.get("username");
    let githubRepoName = url.searchParams.get("repo");
    const response = await fetch(`${APIURL}/get_project_id`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            github_account_name: githubAccountName,
            github_repo_name: githubRepoName
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching project ID: ${errorData.error}`);
    }

    const data = await response.json();
    return data.project_id;
}

export async function getUserRepos() {
    let token = localStorage.getItem("userToken");

    if (token) {
        const response = await fetch("https://api.github.com/user/repos", {
            headers: {
                Authorization: `token ${token}`,
            },
        })

        if (response.status === 401) {
            return "401";
        } else {
            return response.json();
        }

    }
    else {
        return "401";
    }
}
export async function getUsername() {
    let token = localStorage.getItem("userToken");

    if (token) {
        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
            },
        })

        if (response.status === 401) {
            return "401";
        } else {
            const data = await response.json();
            console.log(data);
            return data.login;
        }

    }
}

export async function downloadRepo() {
    const url = new URL(window.location.href);
    let token = localStorage.getItem("userToken");
    let owner = url.searchParams.get("owner");
    let repo = url.searchParams.get("repo");
    let branch = url.searchParams.get("branch");
    let username = url.searchParams.get("username");

    if (owner && repo && branch && token){
        const response = await fetch(`http://localhost:8000/download/`, {
            headers: {
                Authorization: `token ${token}`,
            },
            method: 'POST',
            body: JSON.stringify({
                owner: owner,
                name: repo,
                branch: branch,
                token: token,
                username: username
            })
        })

        if (response.status === 401) {
            return "401";
        } else {
            await response.blob();
            let projID;
            try {
                projID = await getProjectId(username, repo);
            } catch (error) {
                if (error.message.includes('Project not found')) {
                    // Create project if it doesn't exist
                    const project = await createProject(username, repo);
                    projID = project.id;
                } else {
                    throw error;
                }
            }

            return projID;
        }
    }
}

export async function getMessages(sessionId) {
    const response = await fetch(`${APIURL}/get_messages/${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching messages: ${errorData.error}`);
    }

    const data = await response.json();
    return data;
}

export async function generateResponse(sessionId, message) {
    const response = await fetch(`${APIURL}/generate_response`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            content: message
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error generating response: ${errorData.error}`);
    }

    const data = await response.json();
    return data.response;
}

export async function uploadFile(sessionId, file) {
    if (!Object.keys(SUPPORTED_FILE_TYPES).includes(file.type)) {
        throw new Error('Unsupported file type');
    }

    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('file', file);

    const response = await fetch(`${APIURL}/upload_file`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error uploading file: ${errorData.error}`);
    }

    const data = await response.json();
    return data.message;
}

export async function getProjectSessions() {
    const response = await fetch(`${APIURL}/list_projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Error fetching project sessions');
    }

    const data = await response.json();
    return data;
}

export async function listChatSessions(projectId) {
    const response = await fetch(`${APIURL}/chat_sessions/${projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching chat sessions: ${errorData.error}`);
    }

    const data = await response.json();
    return data;
}

export async function repoExists() {
    const url = new URL(window.location.href);
    let githubAccountName = url.searchParams.get("username");
    let githubRepoName = url.searchParams.get("repo");
    const response = await fetch(`${APIURL}/check_project_downloaded`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            github_account_name: githubAccountName,
            github_repo_name: githubRepoName
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error checking if repo exists: ${errorData.error}`);
    }

    const data = await response.json();
    console.log(data);
    return data.exists;
}

