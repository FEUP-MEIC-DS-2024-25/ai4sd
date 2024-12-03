import axios from "axios";

export async function fetchRepoContents(octokit, org, repo, path = "") {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path,
    });
    return data;
}

export async function fetchFileContent(octokit, org, repo, path) {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path,
    });
    return data;
}

export async function downloadFile(url) {
    const response = await axios.get(url);
    return response.data;
}
