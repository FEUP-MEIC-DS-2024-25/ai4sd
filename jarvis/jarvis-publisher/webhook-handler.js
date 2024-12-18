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

/**
 * Handles 'push' events, parsing the payload, and notifying superheroes
 * @param {object} payload - The payload of the push event.
 */
async function handlePushEvent(payload) {
    const repo = payload.repository.full_name;
    const pusher = payload.pusher.name;
    const commitMessage = payload.head_commit.message;
    const commitUrl = payload.head_commit.url;

    // Message built with a good number of fields, so that it can be informative to superheroes
    const message = {
        type: 'push',
        repository: repo,
        pusher: pusher,
        commit_message: commitMessage,
        commit_url: commitUrl,
        timestamp: new Date().toISOString(),
    }

    await publishToEchoJarvis(message);
}
