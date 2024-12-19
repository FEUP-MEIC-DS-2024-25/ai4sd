import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import * as repoUtils from "../../utils/repo";
import * as utils from "../../utils/utils";
import { getTemplate } from '../../utils/vscode';
import { sendRequest, buildApiUrl } from "./utils/request";
import { API_REMOTE_ENDPOINT } from "./utils/constants";

export async function analyzeRemote(llm: string): Promise<void> {
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
    const html = getTemplate("progressId.html", panel.webview, __dirname);
    panel.webview.html = html.replace("Analyzing Repository...", "Analyzing Remote Repository...");

    const apiUrl = buildApiUrl(API_REMOTE_ENDPOINT);
    const params = {
        'repo': remote_url,
        'llm': llm
    };
        
    try {
        const jsonData = await sendRequest(apiUrl, "POST", params);
        const markdownContent = utils.parseApiMdResponse(jsonData);
        repoUtils.writeToFile(markdownFilePath, markdownContent);
        utils.openMarkdownFile(markdownFilePath);
    } catch (error) {
        utils.showError("Command Execution", error);
    }
    finally {
        panel.dispose();
    }
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