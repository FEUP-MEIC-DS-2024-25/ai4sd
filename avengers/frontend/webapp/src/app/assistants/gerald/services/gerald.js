const URL = 'http://localhost:8000';

export async function createProject(githubAccountName, githubRepoName) {
    const response = await fetch(`${URL}/create_project`, {
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
    const response = await fetch(`${URL}/create_chat_session`, {
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
            return response.blob();
        }
    }

}

export async function getMessages(sessionId) {
    const response = await fetch(`${URL}/get_messages/${sessionId}`, {
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
    const response = await fetch(`${URL}/generate_response`, {
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
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('file', file);

    const response = await fetch(`${URL}/upload_file`, {
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