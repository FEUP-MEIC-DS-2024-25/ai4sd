/**
 * Fetches the contents of a repository from GitHub.
 * @param {object} octokit - An authenticated Octokit instance.
 * @param {string} org - The GitHub organization name.
 * @param {string} repo - The repository name.
 * @param {string} [path=""] - The path within the repository to fetch contents from. Defaults to the repository root.
 * @returns {Promise<Array|Object>} - A promise that resolves to the repository contents. 
 * The result can be an array of file/folder metadata or a single file's metadata, depending on the path.
 */
export async function fetchRepoContents(octokit, org, repo, path = "") {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path
    });
    return data;
}