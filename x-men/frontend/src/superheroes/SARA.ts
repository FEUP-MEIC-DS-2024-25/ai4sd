// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import * as utils from "../utils/utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function execute() {
  dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
  const markdownFilePath = path.join(
    __dirname,
    "architectural_patterns.md"
  );
  const workspacePath = utils.getRootWorkspaceFolderPath();
  const remote_url = getGitRemoteUrl(workspacePath!);
  if (!remote_url) {
    return;
  }

  try {
    const jsonData = await utils.fetchJsonData(buildApiUrl(remote_url));
    const markdownContent = parseApiMdResponse(jsonData);
    utils.writeToFile(markdownFilePath, markdownContent);
    openMarkdownFile(markdownFilePath);
  } catch (error) {
    utils.showError("Command Execution", error);
  }
}

function buildApiUrl(remoteUrl: string): string {
  const remoteUrlEncoded = encodeURIComponent(remoteUrl);
  const apiUrl = new URL(
    `${process.env.API_ENDPOINT}/${remoteUrlEncoded}`,
    process.env.API_BASE_URL
  );
  return apiUrl.href;
}

function openMarkdownFile(filePath: string): void {
  vscode.workspace.openTextDocument(filePath).then((document) => {
    vscode.commands.executeCommand("markdown.showPreviewToSide", document.uri);
  });
}

function parseApiMdResponse(jsonData: any): string {
  let markdown = "# Architectural Patterns\n\n";

  if (jsonData.hasOwnProperty("data")) {
    markdown += `${jsonData["data"]}\n\n`;
  }

  return markdown;
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

// This method is called when your extension is deactivated
export function deactivate() { }
