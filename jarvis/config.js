import dotenv from "dotenv";

dotenv.config();

export const config = {
    appId: process.env.APP_ID,
    privateKeyPath: process.env.PRIVATE_KEY_PATH,
    org: process.env.GITHUB_ORG,
    serviceAccountKeyPath: process.env.SERVICE_ACCOUNT_KEY_PATH,
    downloadDir: "./downloads"
};

if (!config.appId || !config.privateKeyPath || !config.org) {
    const missingVars = [];
    if (!config.appId) missingVars.push("APP_ID");
    if (!config.privateKeyPath) missingVars.push("PRIVATE_KEY_PATH");
    if (!config.org) missingVars.push("GITHUB_ORG");
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
}
