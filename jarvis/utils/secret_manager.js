import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { config } from '../config.js';

//process.env.GOOGLE_APPLICATION_CREDENTIALS = config.serviceAccountKeyPath;


export async function accessSecret(secretName) {
    const client = new SecretManagerServiceClient();

    const [version] = await client.accessSecretVersion({
        name: `projects/hero-alliance-feup-ds-24-25/secrets/${secretName}/versions/latest`,
    });
    const secretPayload = version.payload.data.toString('utf8');
    console.log(`Secret ${secretName} accessed successfully.`);
    return secretPayload;
}

