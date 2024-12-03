import { fetchRepoContents, downloadFile, fetchFileContent } from "./githubClient.js";
import { saveFile, ensureDownloadDir } from "./utils.js";
import { config } from "../config.js";
import { writeToBucket } from "../jarvis-writer/writer.js";

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
        console.log(`Found ${contents.length} items in ${path}`);

        for (const content of contents) {
            //TODO: Adapt to more types of code files
            if (content.type === "file") {
                console.log(`Found file: ${content.name}`);

                const fileDetails = await fetchFileContent(octokit, org, repo, content.path);
                const fileContent = Buffer.from(fileDetails.content, fileDetails.encoding).toString("utf-8");

                files.push({
                    name: content.name,
                    path: content.path,
                    file_content: fileContent,
                });
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
        for (const file of pythonFiles) {
            writeToBucket(org, repo, file.path, file.file_content);
        }
        //await downloadAndSaveFiles(pythonFiles);

        console.log(`Downloaded ${pythonFiles.length} Python files from ${repoUrl}`);
    } catch (error) {
        console.error("Error processing repository:", error.message);
    }
}

export { processRepo };
