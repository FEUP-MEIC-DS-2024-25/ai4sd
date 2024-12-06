import * as vscode from "vscode";
import * as fs from "fs";

import { showError } from "./utils";

export function getRootWorkspaceFolderPath(): string | null {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return null;
  }

  return workspaceFolders[0].uri.fsPath;
}

export function writeToFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    showError("Writing to File", error);
  }
}

export function buildApiUrl(remoteUrl: string): string {
  const remoteUrlEncoded = encodeURIComponent(remoteUrl);
  const apiUrl = new URL(
    `${process.env.API_ENDPOINT}/${remoteUrlEncoded}`,
    process.env.API_BASE_URL
  );
  return apiUrl.href;
}
