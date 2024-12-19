import * as vscode from "vscode";

export function showError(prefix: string, error: unknown): void {
    if (error instanceof Error) {
        vscode.window.showErrorMessage(`${prefix} Error: ${error.message}`);
    } else {
        vscode.window.showErrorMessage(`${prefix} Error: ${String(error)}`);
    }
}

export function openMarkdownFile(filePath: string, update_if_opened: boolean = false): void {
    if (update_if_opened) {
        const file_name = filePath.substring(filePath.lastIndexOf('/') + 1);
        const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat();
        const index = tabs.findIndex(tab => tab.label === `Preview ${file_name}`);
        
        if (index !== -1) {
            updateMarkdownFile(filePath);
            return;
        }
    }

    vscode.workspace.openTextDocument(filePath).then((document) => {
        vscode.commands.executeCommand("markdown.showPreviewToSide", document.uri);
    });
}

export function updateMarkdownFile(filePath: string): void {
    vscode.workspace.openTextDocument(filePath).then(() => {
        vscode.commands.executeCommand("markdown.preview.refresh");
    });
}

export function parseApiMdResponse(jsonData: any): string {
    let markdown = "# Architectural Patterns\n\n";

    if (jsonData.hasOwnProperty("data")) {
        markdown += `${jsonData["data"]}\n\n`;
    }

    return markdown;
}