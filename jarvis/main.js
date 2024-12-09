import { getAuthOctokit } from "./jarvis-fetcher/auth.js";
import { config } from "./config.js";
import { uploadRepo } from "./jarvis-writer/writer.js";

/**
 * Fetches all repositories in an organization.
 * @param {object} octokit - Authenticated Octokit instance.
 * @param {string} org - GitHub organization name.
 * @returns {Promise<Array>} - List of repository names.
 */
async function fetchOrgRepos(octokit, org) {
    try {
        const { data } = await octokit.request('GET /orgs/{org}/repos', {
            org: org,
            type: "all",
            per_page: 100
        });

        return data.map((repo) => repo.name);
    } catch (error) {
        console.error(`Error fetching repositories for org "${org}":`, error.message);
        throw error;
    }
}

/**
 * Uploads all repositories in a GitHub organization to a Google Cloud Storage bucket.
 * @param {object} octokit - Authenticated Octokit instance.
 * @param {string} org - GitHub organization name.
 */
export async function uploadAllReposInOrg(octokit, org) {
    try {
        console.log(`Fetching repositories for organization: ${org}`);
        const repos = await fetchOrgRepos(octokit, org);


        if (repos.length === 0) {
            console.log(`No repositories found for organization: ${org}`);
            return;
        }

        console.log(`Found ${repos.length} repositories in organization: ${org}`);
        for (const repo of repos) {
            try {
                await uploadRepo(octokit, org, repo);
            } catch (error) {
                console.error(`Error processing repository "${repo}":`, error.message);
                // Continue with the next repository in case of errors
            }
        }
        console.log(`Finished uploading all repositories for organization: ${org}`);
    } catch (error) {
        console.error(`Error during organization upload process:`, error.message);
    }
}


const octokit = await getAuthOctokit(config.org); // Get authenticated Octokit instance
await uploadAllReposInOrg(octokit, config.org); // Upload all repositories in the organization
