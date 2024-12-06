export async function fetchRepoContents(octokit, org, repo, path = "") {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path
    });
    return data;
}