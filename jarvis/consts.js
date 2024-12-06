import { Storage } from '@google-cloud/storage';

const SERVICE_ACCOUNT_KEY_PATH = "jarvis-key-02-02.json";
const BUCKET_NAME = 'hero-alliance-nexus';
const STORAGE_CLIENT = new Storage({
    keyFilename: SERVICE_ACCOUNT_KEY_PATH,
});


export { SERVICE_ACCOUNT_KEY_PATH, BUCKET_NAME, STORAGE_CLIENT };