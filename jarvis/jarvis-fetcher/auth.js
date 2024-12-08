import fs from "fs";
import { App } from "octokit";
import { config } from "../config.js";

let PRIVATE_KEY;

try {
    PRIVATE_KEY = fs.readFileSync(config.privateKeyPath, "utf-8");
} catch (error) {
    throw new Error(`Failed to read private key file: ${config.privateKeyPath}. ${error.message}`);
}


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