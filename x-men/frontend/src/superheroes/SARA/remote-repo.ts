import * as vscode from "vscode";
import * as path from "path";
import * as http from "http";
import * as fs from "fs";

import * as repoUtils from "../../utils/repo";
import * as utils from "../../utils/utils";
import { getTemplate } from '../../utils/vscode';
import { buildApiUrl } from "../../utils/repo";

export async function analyzeRemote(): Promise<void> {
    const markdownFilePath = path.join(
        __dirname,
        "remote_architectural_patterns.md"
    );
    const workspacePath = repoUtils.getRootWorkspaceFolderPath();
    const remote_url = getGitRemoteUrl(workspacePath!);
    if (!remote_url) {
        return;
    }

    const panel = vscode.window.createWebviewPanel('progress','Analyzing Remote Repository',vscode.ViewColumn.Two,{});
    const html = getTemplate("progressId", panel.webview, __dirname);
    panel.webview.html = html.replace("Analyzing Repository...", "Analyzing Remote Repository...");
        
    try {
        const jsonData = await fetchJsonData(buildApiUrl(remote_url));
        const markdownContent = utils.parseApiMdResponse(jsonData);
        repoUtils.writeToFile(markdownFilePath, markdownContent);
        panel.dispose();
        utils.openMarkdownFile(markdownFilePath);
    } catch (error) {
        utils.showError("Command Execution", error);
    }
}

async function fetchJsonData(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        http
        .get(url, (res) => {
            let data = "";

            if (res.statusCode !== 200) {
                reject(new Error(`Request to SARA API failed with status ${res.statusCode}: ${res.statusMessage}}`));
                res.resume(); // Consume the response data to free up memory
                return;
            }

            res.on("data", (chunk) => {
            data += chunk;
            });

            res.on("end", () => {
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                utils.showError("Parsing Data", error);
            }
            });
        })
        .on("error", (err) => {
            reject(new Error(`Error fetching from the URL: ${err.message}`));
        });
    });
}

function getGitRemoteUrl(workspacePath: string): string | null {
    const gitConfigPath = path.join(workspacePath, ".git", "config");

    // Check if the .git/config file exists
    if (!fs.existsSync(gitConfigPath)) {
        vscode.window.showErrorMessage(
        `.git/config file not found in ${workspacePath}. Is this a Git repository?`
        );
        return null;
    }

    const contents = fs.readFileSync(gitConfigPath, "utf-8");

    const remoteUrlMatch = contents.match(/\[remote "[^"]*"\][\s\S]*?url = (.*)/);

    if (remoteUrlMatch && remoteUrlMatch[1]) {
        return remoteUrlMatch[1].trim(); // Return the remote URL (e.g., 'https://github.com/user/repo.git')
    } else {
        vscode.window.showErrorMessage("No Git remote URL found. Is one defined?");
        return null;
    }
}