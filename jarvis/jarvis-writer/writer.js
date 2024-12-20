import { extractRepoDetails, fetchFiles } from "../jarvis-fetcher/fetcher.js";
import { BUCKET_NAME, STORAGE_CLIENT } from "../consts.js";
import { downloadFiles } from "../jarvis-fetcher/utils.js";

/**
 * Writes a file to a Google Cloud Storage bucket at `org/repo/filePath`.
 * @param {string} org - GitHub organization name.
 * @param {string} repo - Repository name.
 * @param {string} filePath - Path of the file within the repository.
 * @param {string} fileContents - Content of the file to upload.
 */
export async function writeToBucket(org, repo, filePath, fileContents) {
    const absolutePath = `${org}/${repo}/${filePath}`;

    try {
        // Reference the file in the bucket
        const file = STORAGE_CLIENT.bucket(BUCKET_NAME).file(absolutePath);
        await file.save(fileContents);

        console.log(
            `File "${filePath.split('/').pop()}" written to bucket "${BUCKET_NAME}" successfully.`
        );
    } catch (err) {
        console.error(`Error writing file "${absolutePath}" to bucket:`, err.message);
        throw err; // Re-throw error to handle at a higher level if necessary
    }
}

/**
 * Deletes a file from a Google Cloud Storage bucket at `org/repo/filePath`.
 * @param {string} org - GitHub organization name.
 * @param {string} repo - Repository name.
 * @param {string} filePath - Path of the file within the repository.
 */
export async function deleteFromBucket(org, repo, filePath) {
    const absolutePath = `${org}/${repo}/${filePath}`;

    try {
        // Reference the file in the bucket
        const file = STORAGE_CLIENT.bucket(BUCKET_NAME).file(absolutePath);

        // Delete the file
        await file.delete();

        console.log(
            `File "${filePath.split('/').pop()}" deleted from bucket "${BUCKET_NAME}" successfully.`
        );
    } catch (err) {
        console.error(`Error deleting file "${absolutePath}" from bucket:`, err.message);
        throw err; // Re-throw error to handle at a higher level if necessary
    }
}

/**
 * Processes a GitHub repository by fetching files and uploading them to a storage bucket.
 * @param {object} octokit - Authenticated Octokit instance.
 * @param {string} repoUrl - GitHub repository URL.
 */
export async function uploadRepoByURL(octokit, repoUrl) {
    try {
        const [org, repo] = extractRepoDetails(repoUrl);
        _uploadRepo(octokit, org, repo);
    } catch (error) {
        console.error("Error during repository upload process:", error.message);
    }
}

/**
 * Processes a GitHub repository by fetching files and uploading them to a storage bucket.
 * @param {object} octokit - Authenticated Octokit instance.
 * @param {string} org - GitHub organization name.
 * @param {string} repo - Repository name.
 */
export async function uploadRepo(octokit, org, repo) {
    try {
        _uploadRepo(octokit, org, repo);
    } catch (error) {
        console.error("Error during repository upload process:", error.message);
    }
}

/**
 * Processes a GitHub repository by fetching files and uploading them to a storage bucket.
 * @param {object} octokit - Authenticated Octokit instance.
 * @param {string} org - GitHub organization name.
 * @param {string} repo - Repository name.
 */
async function _uploadRepo(octokit, org, repo) {
    try {
        console.log(`Starting processing for repository: ${org}/${repo}`);
        const files = await fetchFiles(octokit, org, repo);

        if (files.length === 0) {
            console.warn(`No files found in the repository: ${repoUrl}`);
            return;
        }

        const filesWContent = await downloadFiles(files);
        for (const file of filesWContent) {
            await writeToBucket(org, repo, file.path, file.content);
        }

        console.log(`Successfully processed ${files.length} files from ${org}/${repo}`);
    } catch (error) {
        throw error;  // Re-throw error to be handled at the higher level
    }
}
