import fs from "fs";
import { App } from "octokit";
import { config } from "../config.js";
import { readFileContents } from "./utils.js";
import { GITHUB_APP_PRIVATE_KEY_PATH, PASSPHRASE } from "../consts.js";
import { fetchAndDecryptDocument } from "../utils/secrets.js";


//if (!fs.existsSync(GITHUB_APP_PRIVATE_KEY_PATH)) await fetchAndDecryptDocument(PASSPHRASE);
//const PRIVATE_KEY = await readFileContents(GITHUB_APP_PRIVATE_KEY_PATH);

/**
 * GitHub App instance for authenticating API requests.
 * @type {App}
 */
export const app = new App({
    appId: config.appId,
    privateKey: PRIVATE_KEY,
});

/**
 * Retrieves an authenticated Octokit instance for a specific GitHub organization.
 * @param {string} org - The GitHub organization name.
 * @returns {Promise<object>} - A promise that resolves to an authenticated Octokit instance.
 * @throws {Error} - Throws an error if the app is not installed on the organization or the request fails.
 */
export async function getAuthOctokit(org) {
    //TODO: Error treatment in case the app is not installed
    const installation = await app.octokit.request("GET /orgs/{org}/installation", { org });
    return await app.getInstallationOctokit(installation.data.id);
}