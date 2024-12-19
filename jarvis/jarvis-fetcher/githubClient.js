/**
 * Fetches the contents of a repository from GitHub.
 * @param {object} octokit - An authenticated Octokit instance.
 * @param {string} org - The GitHub organization name.
 * @param {string} repo - The repository name.
 * @param {string} [path=""] - The path within the repository to fetch contents from. Defaults to the repository root.
 * @returns {Promise<Array|Object>} - A promise that resolves to the repository contents. 
 * The result can be an array of file/folder metadata or a single file's metadata, depending on the path.
 */
export async function fetchRepoContents(octokit, org, repo, path = "") {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: org,
        repo,
        path
    });
    return data;
}

export async function addWebhook(octokit, org, repo, webhookUrl) {
    const data = await octokit.request('POST /repos/{owner}/{repo}/hooks', {
        owner: org,
        repo: repo,
        name: 'web',
        active: true,
        events: [
            'push',
        ],
        config: {
            url: webhookUrl,
            content_type: 'json',
            insecure_ssl: '0'
        },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}

export async function removeWebhook(octokit, org, repo, webhookUrl) {
    // Get all webhooks for the repository
    const { data: webhooks } = await octokit.request('GET /repos/{owner}/{repo}/hooks', {
        owner: org,
        repo: repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    // Find the webhook with the matching URL
    const webhook = webhooks.find(hook => hook.config.url === webhookUrl);

    if (!webhook) {
        throw new Error(`Webhook with URL ${webhookUrl} not found in repository ${org}/${repo}.`);
    }

    // Delete the webhook
    await octokit.request('DELETE /repos/{owner}/{repo}/hooks/{hook_id}', {
        owner: org,
        repo: repo,
        hook_id: webhook.id,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    console.log(`Webhook with URL ${webhookUrl} successfully removed in ${org}/${repo}.`);
}
