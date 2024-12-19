import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";

export function getTemplate(fileName: string, webview: vscode.Webview, dirName: string): string {
    const extensionUri = vscode.Uri.file(path.join(dirName, "../../../"));

    // Constructing the URIs manually, with path module, so older versions of the VS Code API are supported
    const templatePath = vscode.Uri.file(
        path.join(extensionUri.fsPath, "public", "template", fileName)
    );
    const styleUri = webview.asWebviewUri(
        vscode.Uri.file(path.join(extensionUri.fsPath, "public", "css"))
    );
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.file(path.join(extensionUri.fsPath, "public", "js"))
    );
    const imageUri = webview.asWebviewUri(
        vscode.Uri.file(path.join(extensionUri.fsPath, "public", "images"))
    );
    const content = fs.readFileSync(templatePath.fsPath, 'utf-8');

    return content
        .replaceAll('{{styleUri}}', styleUri.toString())
        .replaceAll('{{scriptUri}}', scriptUri.toString())
        .replaceAll('{{imageUri}}', imageUri.toString());
}