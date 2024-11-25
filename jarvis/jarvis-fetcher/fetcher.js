import { fetchRepoContents, downloadFile } from "./githubClient.js";
import { saveFile, ensureDownloadDir } from "./utils.js";
import { config } from "../config.js";

function extractRepoDetails(repoUrl) {
    const repoPath = repoUrl.replace("https://github.com/", "").split("/");
    if (repoPath.length !== 2) {
        throw new Error("Invalid repository URL format. Expected format: https://github.com/{org}/{repo}");
    }
    return repoPath;
}

async function findFiles(octokit, org, repo, path = "", files = []) {
    try {
        const contents = await fetchRepoContents(octokit, org, repo, path);

        for (const content of contents) {
            //TODO: Adapt to more types of code files
            if (content.type === "file" && content.name.endsWith(".py")) {
                files.push({
                    name: content.name,
                    download_url: content.download_url,
                });
                console.log(`Found Python file: ${content.name}`);
            } else if (content.type === "dir") {
                console.log(`Entering directory: ${content.name}`);
                await findFiles(octokit, org, repo, content.path, files);
            }
        }
        return files;
    } catch (error) {
        console.error("Error fetching repository contents:", error.message);
        throw error;  // Rethrow to handle at higher level
    }
}

async function downloadAndSaveFiles(pythonFiles) {
    for (const file of pythonFiles) {
        try {
            const fileStream = await downloadFile(file.download_url);
            saveFile(fileStream, file.name, config.downloadDir);
        } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error.message);
            throw error; // Rethrow to handle at higher level
        }
    }
}

async function processRepo(octokit, repoUrl) {
    try {
        const [org, repo] = extractRepoDetails(repoUrl);

        const pythonFiles = await findFiles(octokit, org, repo);
        ensureDownloadDir();
        await downloadAndSaveFiles(pythonFiles);

        console.log(`Downloaded ${pythonFiles.length} Python files from ${repoUrl}`);
    } catch (error) {
        console.error("Error processing repository:", error.message);
    }
}

export { processRepo };
