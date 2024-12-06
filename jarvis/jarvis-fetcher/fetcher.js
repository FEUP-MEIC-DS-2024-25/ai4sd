import { fetchRepoContents } from "./githubClient.js";

/**
 * Extracts organization and repository details from a GitHub URL.
 * @param {string} repoUrl - The GitHub repository URL (e.g., "https://github.com/org/repo").
 * @returns {[string, string]} - A tuple containing the organization name and repository name.
 * @throws {Error} - Throws an error if the URL format is invalid.
 */
export function extractRepoDetails(repoUrl) {
    const repoPath = repoUrl.replace("https://github.com/", "").split("/");
    if (repoPath.length !== 2) {
        throw new Error(
            "Invalid repository URL format. Expected format: https://github.com/{org}/{repo}"
        );
    }
    return repoPath;
}

/**
 * Recursively fetches files from a GitHub repository and collects their metadata.
 * @param {object} octokit - An authenticated Octokit.
 * @param {string} org - The GitHub organization name.
 * @param {string} repo - The repository name.
 * @param {string} [path=""] - The directory path within the repository. Defaults to the root directory.
 * @param {Array} [files=[]] - An accumulator array for storing file metadata (used for recursion).
 * @returns {Promise<Array>} - A promise that resolves to an array of file objects containing:
 * @returns {string} returns[].name - The name of the file.
 * @returns {string} returns[].path - The path of the file in the repository.
 * @returns {string} returns[].download_url - The URL to download the file's content.
 * @throws {Error} - Throws an error if fetching repository contents fails.
 */
export async function fetchFiles(octokit, org, repo, path = "", files = []) {
    try {
        const contents = await fetchRepoContents(octokit, org, repo, path);
        console.log(`Found ${contents.length} items in /${path}`);

        for (const content of contents) {
            if (content.type === "file") {
                console.log(`Reading file: ${content.name}`);
                files.push({
                    name: content.name,
                    path: content.path,
                    download_url: content.download_url,
                });
            } else if (content.type === "dir") {
                console.log(`Entering directory: ${content.name}`);
                await fetchFiles(octokit, org, repo, content.path, files);
            }
        }
        return files;
    } catch (error) {
        console.error("Error fetching repository contents:", error.message);
        throw error; // Rethrow to handle at a higher level.
    }
}
