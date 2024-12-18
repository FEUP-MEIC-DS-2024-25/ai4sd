import { publishToEchoJarvis } from './publisher.js';

/**
 * Handles incoming GitHub webhook events.
 * @param {string} event - The GitHub event type (e.g., 'push', 'pull_request').
 * @param {object} payload - The payload of the event.
 */
export async function handleWebhookEvent(event, payload) {
    switch (event) {
        case 'push':
            await handlePushEvent(payload);
            break;
        case 'pull_request':
            await handlePullRequestEvent(payload);
            break;
        default:
            console.log(`Unhandled event type: ${event}`);
    }
}