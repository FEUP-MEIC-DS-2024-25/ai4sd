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