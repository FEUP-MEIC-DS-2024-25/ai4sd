import fs from "fs";
import { App } from "octokit";
import { config } from "../config.js";

let PRIVATE_KEY;

try {
    PRIVATE_KEY = fs.readFileSync(config.privateKeyPath, "utf-8");
} catch (error) {
    throw new Error(`Failed to read private key file: ${config.privateKeyPath}. ${error.message}`);
}

export const app = new App({
    appId: config.appId,
    privateKey: PRIVATE_KEY,
});

export async function getAuthOctokit(org) {
    //TODO: Error treatment in case the app is not installed
    const installation = await app.octokit.request("GET /orgs/{org}/installation", { org });
    return await app.getInstallationOctokit(installation.data.id);
}
