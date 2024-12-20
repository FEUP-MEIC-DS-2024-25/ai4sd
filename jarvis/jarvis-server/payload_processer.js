import { fetchRepoContents } from "../jarvis-fetcher/githubClient.js";
import { downloadFiles } from "../jarvis-fetcher/utils.js";
import { deleteFromBucket, writeToBucket } from "../jarvis-writer/writer.js";

/**
 * Extracts the added, removed, and modified files from the GitHub webhook payload.
 * @param {object} payload - The GitHub webhook payload containing commit details.
 * @returns {Array} - An array of objects representing the files and their change types (added, removed, or modified).
 * Each object contains:
 * - {string} file - The file path.
 * - {string} changeType - The type of change ('added', 'removed', or 'modified').
 */
function extractChanges(payload) {
    const changes = [];

    // Loop through each commit in the payload
    payload.commits.forEach(commit => {
        ['added', 'removed', 'modified'].forEach(changeType => {
            commit[changeType].forEach(file => {
                changes.push({
                    file,
                    changeType
                });
            });
        });
    });

    return changes;
}

/**
 * Processes the changes (added, removed, modified files) from the GitHub webhook payload and updates the storage bucket.
 * @param {object} octokit - The authenticated Octokit instance used to interact with the GitHub API.
 * @param {object} payload - The GitHub webhook payload containing commit details, including the list of changed files.
 * @throws {Error} - Throws an error if any operation (file fetch, download, or write/delete) fails.
 * 
 * For each change in the payload:
 * - If the file is removed, it will be deleted from the bucket.
 * - If the file is added or modified, its content will be fetched and written to the bucket.
 */
export function processChanges(octokit, payload) {
    const changes = extractChanges(payload);
    changes.forEach(async change => {
        const owner = payload.repository.owner.name;
        const repo = payload.repository.name;

        try {
            if (change.changeType === 'removed') {
                await deleteFromBucket(owner, repo, change.file);
            } else {
                const metadata = await fetchRepoContents(octokit, owner, repo, change.file);
                const fileWContent = await downloadFiles([metadata]);
                await writeToBucket(owner, repo, fileWContent[0].path, fileWContent[0].content);
            }
        } catch (error) {
            console.error(`Failed to process change for file ${change.file}:`, error);
        }
    });
}


