import { publishToEchoJarvis } from './publisher.js';
import { PUBSUB_CLIENT, ECHO_JARVIS_TOPIC } from '../consts.js';

// Ensure PUBSUB_EMULATOR_HOST is set
if (!process.env.PUBSUB_EMULATOR_HOST) {
    console.error('Please set PUBSUB_EMULATOR_HOST to point to the Pub/Sub emulator.');
    process.exit(1);
}

// Create the topic if it doesn't already exist
async function ensureTopicExists() {
    const [topics] = await PUBSUB_CLIENT.getTopics();
    if (!topics.find(topic => topic.name.endsWith(ECHO_JARVIS_TOPIC))) {
        console.log(`Creating topic: ${ECHO_JARVIS_TOPIC}`);
        await PUBSUB_CLIENT.createTopic(ECHO_JARVIS_TOPIC);
    }
}

// Run the test
(async () => {
    await ensureTopicExists();

    const testMessage = {
        id: 1,
        content: "Hello, Pub/Sub emulator!",
    };

    try {
        await publishToEchoJarvis(testMessage);
        console.log('Test completed successfully.');
    } catch (error) {
        console.error('Test failed:', error);
    }
})();
