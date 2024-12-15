const name = 'projects/150699885662/secrets/superhero-03-02-secre/versions/latest';
// const name = 'projects/my-project/secrets/my-secret/versions/latest';

// Imports the Secret Manager library
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Instantiates a client
const client = new SecretManagerServiceClient();

export async function accessSecretVersion() {
    const [version] = await client.accessSecretVersion({
        name: name,
    });

    // Extract the payload as a string.
    const payload = version.payload.data.toString();

    // WARNING: Do not print the secret in a production environment - this
    // snippet is showing how to access the secret material.
    // console.info(`Payload: ${payload}`);
    return payload;
}