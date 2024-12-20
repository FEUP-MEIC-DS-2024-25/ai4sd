import { Storage } from '@google-cloud/storage';
import { PubSub } from '@google-cloud/pubsub';

const USE_EMULATOR = process.env.PUBSUB_EMULATOR_HOST !== undefined;

const GITHUB_APP_PRIVATE_KEY_PATH = "jarvis-fetcher/keys/github_app_private.pem";
const SERVICE_ACCOUNT_KEY_PATH = USE_EMULATOR ? null : "./service_account_key.json"; // Emulator doesn't use credentials
const BUCKET_NAME = "hero-alliance-nexus";
const ECHO_JARVIS_TOPIC = "echo-jarvis";
const DOWNLOAD_DIR = "/downloads";
const PASSPHRASE = "jarvis-secrets";

const STORAGE_CLIENT = new Storage({
    keyFilename: SERVICE_ACCOUNT_KEY_PATH,
});

const PUBSUB_CLIENT = new PubSub(USE_EMULATOR ? {} : { keyFilename: SERVICE_ACCOUNT_KEY_PATH });

export {
    GITHUB_APP_PRIVATE_KEY_PATH,
    SERVICE_ACCOUNT_KEY_PATH,
    BUCKET_NAME,
    ECHO_JARVIS_TOPIC,
    DOWNLOAD_DIR,
    PASSPHRASE,
    STORAGE_CLIENT,
    PUBSUB_CLIENT,
};
