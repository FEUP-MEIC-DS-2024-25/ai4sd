# Jarvis

Jarvis is a service of AI4SD that fetches information from GitHub repositories and saves it to Nexus, our repository database. The end goal is that Jarvis automatically updates the repositories in Nexus when they receive new information.

## Current state

Currently, Jarvis fetches all the files from every repository in a pre-defined organization and saves them to Nexus, maintaining the same structure as the original repository. Jarvis also supports functions to upload a single repository to Nexus, using either its (HTTPS) URL or its name and organization.

## Technologies

Jarvis is built with **Node.js** and uses **Octokit** to interact with GitHub's REST API.

## Authentication
The `jarvis-fetcher` module [authenticates in the GitHub API](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28). This is in order to access higher rate limits and more endpoints, as well as access private repositories.

To achieve this, we created the **jarvis-fetcher** GitHub App. This way, users don't have to provide personal access tokens of their GitHub accounts, and instead simply install jarvis-fetcher in the repositories or organizations they wish Jarvis to have access to. This also allows for Jarvis actions to appear under the name Jarvis, instead of the user.

Currently, the **jarvis-fetcher** GitHub App **is only available for FEUP-MEIC-DS-2024-25 repositories**.

### Implementation

The `jarvis-fetcher` authentication was done as a GitHub App installation. We use the REST API to generate an installation access token, and then use it to authenticate requests. More information on this process can be found [here](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation).

## How to contribute

To add a new functionality to Jarvis, you'll likely want to have a new interaction with the GitHub API. To do this, add your new interactions to `jarvis-fetcher/githubClient.js`. Any overarching functionality of a new fetching feature that doesn't directly communicate with the GitHub API should be placed in `jarvis-fetcher/fetcher.js`. For functionalities that read or write to Nexus, develop them in `jarvis-reader/reader.js` or `jarvis-writer/writer.js`, respectively. Finally, call your new functions in `main.js`.

```js
const octokit = await getAuthOctokit(config.org); // Get authenticated Octokit instance
await uploadAllReposInOrg(octokit, config.org); // Upload all repositories in the organization
```

Make sure to **use the authenticate octokit instance defined in `main.js`.**

