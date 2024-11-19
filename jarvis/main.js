import { App } from "octokit"; 
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const APP_ID = process.env.APP_ID;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;

if (!PRIVATE_KEY_PATH) {
    throw new Error("PRIVATE_KEY_PATH environment variable is not set.");
}

let PRIVATE_KEY;
try {
    PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, "utf-8");
} catch (error) {
    throw new Error(`Failed to read private key file: ${PRIVATE_KEY_PATH}. ${error.message}`);
}

const app = new App({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
});

async function fetchPythonFiles(repoUrl) {
    const repoPath = repoUrl.replace("https://github.com/", "");
    const apiUrl = `https://api.github.com/repos/${repoPath}/contents`;

    try {
        const response = await axios.get(apiUrl);
        const files = response.data;

        // Filter for Python files
        const pythonFiles = files.filter((file) => file.name.endsWith(".py"));

        for (const file of pythonFiles) {
            const fileResponse = await axios.get(file.download_url);
            console.log(`File: ${file.name}`);
            console.log(fileResponse.data);
        }
    } catch (error) {
        console.error("Error fetching files:", error.message);
    }
}

async function main() {
    try {
        const installation = await app.octokit.request("GET /orgs/{org}/installation", {
            org: "FEUP-MEIC-DS-2024-25",
        });

        console.log(installation.data["id"]); // Installation ID

        // await fetchPythonFiles("https://github.com/dbarnett/python-helloworld");
    } catch (error) {
        console.error("Error fetching installation:", error.message);
    }
}

main();
