import { getAuthOctokit } from "./jarvis-fetcher/auth.js";
import { config } from "./config.js";
import { uploadRepo } from "./jarvis-writer/writer.js";

const octokit = await getAuthOctokit(config.org); // Get authenticated Octokit instance
uploadRepo(octokit, "https://github.com/FEUP-MEIC-DS-2024-25/T02_G02_BackEnd");