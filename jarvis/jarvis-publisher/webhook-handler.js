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
 * Handles 'push' events, parsing the payload, and notifying superheroes.
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

/**
 * Handles 'pull_request' events, parsing the payload, and notifying superheroes, only if the PR has been closed and merged.
 * @param {object} payload - The payload of the pull request event.
 */
async function handlePullRequestEvent(payload) {
    const action = payload.action;
    const repo = payload.repository.full_name;
    const prNumber = payload.pull_request.number;
    const prTitle = payload.pull_request.title;
    const prUrl = payload.pull_request.html_url;
    const merged = payload.pull_request.merged;

    if (action === 'closed' && merged) {
        const message = {
            type: 'pull_request',
            repository: repo,
            pr_number: prNumber,
            pr_title: prTitle,
            pr_url: prUrl,
            merged: merged,
            timestamp: new Date().toISOString(),
        };

        await publishToEchoJarvis(message);
    } else {
        console.log(`Pull request event '${action}' ignored.`);
    }
}
