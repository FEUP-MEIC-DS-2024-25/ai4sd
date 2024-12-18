import { App } from "octokit";
import { config } from "../config.js";
import { accessSecret } from "../utils/secret_manager.js";

/**
 * Retrieves an authenticated Octokit instance for a specific GitHub organization.
 * @param {string} org - The GitHub organization name.
 * @returns {Promise<object>} - A promise that resolves to an authenticated Octokit instance.
 * @throws {Error} - Throws an error if the app is not installed on the organization or the request fails.
 */
export async function getAuthOctokit(org) {
    config.privateKey = await accessSecret('jarvis-secret2');

    const app = new App({
        appId: config.appId,
        privateKey: config.privateKey,
    });

    //TODO: Error treatment in case the app is not installed
    const installation = await app.octokit.request("GET /orgs/{org}/installation", { org });
    return await app.getInstallationOctokit(installation.data.id);
}