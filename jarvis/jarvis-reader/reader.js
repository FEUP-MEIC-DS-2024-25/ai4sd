import { Storage } from '@google-cloud/storage';
import { config } from '../config.js';

const storage = new Storage({
    keyFilename: config.serviceAccountKeyPath,
});

const bucketName = 'hero-alliance-nexus';
const fileName = 'helloworld.txt';

async function readFromBucket() {
    try {
        // Reference the file in the bucket
        const file = storage.bucket(bucketName).file(fileName);

        // Read file contents
        const [contents] = await file.download();
        console.log('File contents:');
        console.log(contents.toString());
    } catch (err) {
        console.error('Error reading file from bucket:', err);
    }
}

readFromBucket();
