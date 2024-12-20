import { Storage } from '@google-cloud/storage';

const GITHUB_APP_PRIVATE_KEY_PATH = "jarvis-fetcher/keys/github_app_private.pem"
const SERVICE_ACCOUNT_KEY_PATH = "./service_account_key.json";
const BUCKET_NAME = "hero-alliance-nexus";
const STORAGE_CLIENT = new Storage({
    keyFilename: SERVICE_ACCOUNT_KEY_PATH,
});
const DOWNLOAD_DIR = "/downloads";
const PASSPHRASE = "jarvis-secrets";


export { GITHUB_APP_PRIVATE_KEY_PATH, SERVICE_ACCOUNT_KEY_PATH, BUCKET_NAME, STORAGE_CLIENT, DOWNLOAD_DIR, PASSPHRASE };