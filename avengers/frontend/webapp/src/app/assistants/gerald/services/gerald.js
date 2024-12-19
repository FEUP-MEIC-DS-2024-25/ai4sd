export function startChat() {
    //TODO: Implement function to communicate with the backend so it creates a chatbot
    return true;
}

export async function sendMsg(msg) {
    //TODO: Implement function to communicate with the backend so it send a msg and receives a response
    return "This is a dummy response for test purpose";
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
