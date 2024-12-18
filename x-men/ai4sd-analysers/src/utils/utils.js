import * as vscode from "vscode";
export function showError(prefix, error) {
    if (error instanceof Error) {
        vscode.window.showErrorMessage(`${prefix} Error: ${error.message}`);
    }
    else {
        vscode.window.showErrorMessage(`${prefix} Error: ${String(error)}`);
    }
}
export function openMarkdownFile(filePath) {
    vscode.workspace.openTextDocument(filePath).then((document) => {
        vscode.commands.executeCommand("markdown.showPreviewToSide", document.uri);
    });
}
export function parseApiMdResponse(jsonData) {
    let markdown = "# Architectural Patterns\n\n";
    if (jsonData.hasOwnProperty("data")) {
        markdown += `${jsonData["data"]}\n\n`;
    }
    return markdown;
}
