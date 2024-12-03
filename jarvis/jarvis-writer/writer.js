import { Storage } from '@google-cloud/storage';
import { config } from '../config.js';

const storage = new Storage({
    keyFilename: config.serviceAccountKeyPath,
});

const bucketName = 'hero-alliance-nexus';

export async function writeToBucket(org, repo, filePath, fileContents) {
    try {
        const absolutePath = `${org}/${repo}/${filePath}`;
        // Reference the file in the bucket
        const file = storage.bucket(bucketName).file(absolutePath);

        // Write file contents
        await file.save(fileContents);
        console.log(`File "${absolutePath.substring(absolutePath.lastIndexOf('/') + 1)}" written to bucket "${bucketName}" successfully.`);
    } catch (err) {
        console.error('Error writing file to bucket:', err);
    }
}
