import { BUCKET_NAME, STORAGE_CLIENT } from "../consts";

const fileName = 'helloworld.txt';

/**
 * Example function that reads a file from a Google Cloud Storage bucket and logs its contents.
 */
async function readFromBucket() {
    try {
        // Reference the file in the bucket
        const file = STORAGE_CLIENT.bucket(BUCKET_NAME).file(fileName);

        // Read file contents
        const [contents] = await file.download();
        console.log('File contents:');
        console.log(contents.toString());
    } catch (err) {
        console.error('Error reading file from bucket:', err);
    }
}

readFromBucket();
