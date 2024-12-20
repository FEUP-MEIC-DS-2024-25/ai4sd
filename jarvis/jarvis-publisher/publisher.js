import { ECHO_JARVIS_TOPIC, PUBSUB_CLIENT } from '../consts.js';

/**
 * Publishes a message to the 'echo-jarvis' Pub/Sub topic.
 * @param {object} message - The message object to publish.
 */
export async function publishToEchoJarvis(message) {
    const dataBuffer = Buffer.from(JSON.stringify(message));

    // Wrap the dataBuffer in an object with a 'data' field for Pub/Sub
    const pubsubMessage = {
        data: dataBuffer,
    };

    try {
        const messageId = await PUBSUB_CLIENT.topic(ECHO_JARVIS_TOPIC).publishMessage(pubsubMessage);
        console.log(`Message ${messageId} published to topic ${ECHO_JARVIS_TOPIC}.`)
    } catch (error) {
        console.error(`Error publishing message to ${ECHO_JARVIS_TOPIC}:`, error.message)
        throw error;
    }
}