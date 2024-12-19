import { getAuthOctokit } from "./jarvis-fetcher/auth.js";
import { config } from "./config.js";
import { uploadRepo } from "./jarvis-writer/writer.js";
import { accessSecret } from "./utils/secret_manager.js";

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


import fs from "fs";
import path from "path";

const secretpath = './service_account_key.txt';

try {
    // Read the file synchronously
    const secret = fs.readFileSync(secretpath, 'utf8');
    console.log(`Secret read from file: ${secret}`);
    const decodedString = atob(secret);
    console.log(`Decoded secret: ${decodedString}`);
    const jsonObject = JSON.parse(decodedString);
    console.log(`Secret JSON object:`, jsonObject);

    const filePath = './service_account_key.json';

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Convert the JSON object to a string and write it to a file
    await fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), (err) => {
        if (err) {
            console.error("Error saving JSON to file:", err);
        } else {
            console.log(`Secret JSON saved to ${filePath}`);
        }
    });
    console.log(`Successfully read secret ${secretpath}`);
} catch (err) {
    console.error(`Error reading secret file at ${secretpath}:`, err.message);
}

const octokit = await getAuthOctokit(config.org); // Get authenticated Octokit instance
//await uploadRepo(octokit, config.org, "T07_G05"); // Upload all repositories in the organization


