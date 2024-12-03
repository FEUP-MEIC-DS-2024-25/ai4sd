import axios from "axios";

export async function fetchRepoContents(octokit, org, repo, path = "") {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path,
    });
    return data;
}

export async function fetchFileContents(octokit, org, repo, path) {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path,
        headers: {
            Accept: "application/vnd.github.raw+json"
        }
    });

        // Check for Content-Type in the response headers
        const contentType = response.headers['content-type'];
        console.log("Content-Type:", contentType); // Log the Content-Type

    return data;
}

export async function downloadFile(url) {
    const response = await axios.get(url);
    return response.data;
}
