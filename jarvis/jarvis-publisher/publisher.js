import { ECHO_JARVIS_TOPIC, PUBSUB_CLIENT } from '../consts';

/**
 * Publishes a message to the 'echo-jarvis' Pub/Sub topic.
 * @param {object} message - The message object to publish.
 */
export async function publishToEchoJarvis(message) {
    const dataBuffer = Buffer.from(JSON.stringify(message));

    try {
        const messageId = await PUBSUB_CLIENT.topic(ECHO_JARVIS_TOPIC).publishMessage(dataBuffer);
        console.log(`Message ${messageId} published to topic ${topicName}.`)
    } catch (error) {
        console.error(`Error publishing message to ${topicName}:`, error.message)
        throw error;
    }
}