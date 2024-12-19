import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { config } from "../config.js";
import fs from "fs";
import path from "path";

/**
 * Ensures that the service account key is available at the specified path.
 * If the key is not already available, it reads the encoded JSON secret
 * and decodes it to create the service account key file.
 *
 * @throws {Error} If the key cannot be read or saved.
 */
export async function ensureServiceAccountKey() {
    if (!fs.existsSync(config.serviceAccountKeyPath)) {
        console.log("Reading encoded JSON secret");
        await readEncodedJSONSecret(config.encodedServiceAccountKeyPath, config.serviceAccountKeyPath);
    }
}

/**
 * Reads an encoded JSON secret from a specified file path, decodes it,
 * and saves the decoded JSON object to a new file.
 *
 * @param {string} secretPath - The path to the file containing the encoded JSON secret.
 * @param {string} savePath - The path where the decoded JSON should be saved.
 * @throws {Error} If the file cannot be read, decoded, or saved.
 */
export async function readEncodedJSONSecret(secretPath, savePath) {
    console.log(`Reading secret from ${secretPath} to save to ${savePath}`);

    try {
        // Read the file synchronously
        const secret = fs.readFileSync(secretPath, 'utf8');
        const decodedString = atob(secret);
        const jsonObject = JSON.parse(decodedString);

        // Ensure the directory exists
        const dirPath = path.dirname(savePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
        }

        // Convert the JSON object to a string and write it to a file
        await fs.writeFile(savePath, JSON.stringify(jsonObject, null, 2), (err) => {
            if (err) {
                console.error("Error saving JSON to file:", err);
            } else {
                console.log(`Secret JSON saved to ${savePath}`);
            }
        });
        console.log(`Successfully read secret ${secretPath}`);
    } catch (err) {
        console.error(`Error reading secret file at ${secretPath}:`, err.message);
    }


}

/**
 * Accesses a secret stored in Google Cloud Secret Manager.
 *
 * @param {string} secretName - The name of the secret to access.
 * @returns {Promise<string>} The payload of the accessed secret as a UTF-8 string.
 * @throws {Error} If the secret cannot be accessed or does not exist.
 */
export async function accessSecret(secretName) {
    const client = new SecretManagerServiceClient();

    const [version] = await client.accessSecretVersion({
        name: `projects/hero-alliance-feup-ds-24-25/secrets/${secretName}/versions/latest`,
    });
    const secretPayload = version.payload.data.toString('utf8');
    console.log(`Secret ${secretName} accessed successfully.`);
    return secretPayload;
}



