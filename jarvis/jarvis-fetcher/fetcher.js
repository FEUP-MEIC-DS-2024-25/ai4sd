import { fetchRepoContents, fetchFileContent } from "./githubClient.js";

/**
 * Extracts organization and repository details from a GitHub URL.
 * @param {string} repoUrl - GitHub repository URL.
 * @returns {[string, string]} - Organization and repository name.
 * @throws {Error} - If the URL format is invalid.
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
 * Recursively finds files in a GitHub repository and reads their content.
 * @param {object} octokit - Authenticated Octokit instance.
 * @param {string} org - GitHub organization name.
 * @param {string} repo - Repository name.
 * @param {string} [path=""] - Directory path within the repository.
 * @param {Array} [files=[]] - Accumulator for storing file details.
 * @returns {Promise<Array>} - Array of file details with content.
 */
export async function fetchFiles(octokit, org, repo, path = "", files = []) {
    try {
        const contents = await fetchRepoContents(octokit, org, repo, path);
        console.log(`Found ${contents.length} items in ${path}`);

        for (const content of contents) {
            if (content.type === "file") {
                console.log(`Reading file: ${content.name}`);
                const fileDetails = await fetchFileContent(octokit, org, repo, content.path);
                const fileContent = Buffer.from(fileDetails.content, fileDetails.encoding).toString("utf-8");

                files.push({
                    name: content.name,
                    path: content.path,
                    content: fileContent,
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
