import { processRepo } from "./jarvis-fetcher/fetcher.js";
import { getAuthOctokit } from "./jarvis-fetcher/auth.js";
import { config } from "./config.js";

const octokit = await getAuthOctokit(config.org); // Get authenticated Octokit instance
processRepo(octokit, "https://github.com/FEUP-MEIC-DS-2024-25/T02_G02_BackEnd");