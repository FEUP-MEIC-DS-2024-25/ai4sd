import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { config } from '../config.js';

process.env.GOOGLE_APPLICATION_CREDENTIALS = config.serviceAccountKeyPath;

const client = new SecretManagerServiceClient();

export async function accessSecret(secretName) {
    const [version] = await client.accessSecretVersion({
        name: `projects/hero-alliance-feup-ds-24-25/secrets/${secretName}/versions/latest`,
    });
    const secretPayload = version.payload.data.toString('utf8');
    console.log(`Secret ${secretName} accessed successfully.`);
    return secretPayload;
}

