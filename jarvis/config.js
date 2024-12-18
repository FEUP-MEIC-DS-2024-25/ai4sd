import dotenv from "dotenv";
import { DOWNLOAD_DIR, GITHUB_APP_PRIVATE_KEY_PATH, SERVICE_ACCOUNT_KEY_PATH } from "./consts.js";

dotenv.config();

console.log("APP_ID:", process.env.APP_ID);
console.log("GITHUB_ORG:", process.env.GITHUB_ORG);

export const config = {
    appId: process.env.APP_ID,
    org: process.env.GITHUB_ORG,
    privateKeyPath: GITHUB_APP_PRIVATE_KEY_PATH,
    serviceAccountKeyPath: SERVICE_ACCOUNT_KEY_PATH,
    downloadDir: DOWNLOAD_DIR
};

console.log("SERVICE_ACCOUNT_PATH:", config.serviceAccountKeyPath);


if (!config.appId || !config.org) {
    const missingVars = [];
    if (!config.appId) missingVars.push("APP_ID");
    if (!config.org) missingVars.push("GITHUB_ORG");
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
}
