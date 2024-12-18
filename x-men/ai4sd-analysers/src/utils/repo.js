import * as vscode from "vscode";
import * as fs from "fs";
import { showError } from "./utils";
export function getRootWorkspaceFolderPath() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return null;
    }
    return workspaceFolders[0].uri.fsPath;
}
export function writeToFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, "utf-8");
    }
    catch (error) {
        showError("Writing to File", error);
    }
}
