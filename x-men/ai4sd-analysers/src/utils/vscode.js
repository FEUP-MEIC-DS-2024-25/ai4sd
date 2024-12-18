import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
export function getTemplate(fileName, webview, dirName) {
    const extensionUri = vscode.Uri.file(path.join(dirName, "../../../"));
    const templatePath = vscode.Uri.joinPath(extensionUri, 'public', 'template', fileName);
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'public', 'css')) + "/";
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'public', 'js')) + "/";
    const imageUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'public', 'images')) + "/";
    const content = fs.readFileSync(templatePath.fsPath, 'utf-8');
    return content
        .replaceAll('{{styleUri}}', styleUri.toString())
        .replaceAll('{{scriptUri}}', scriptUri.toString())
        .replaceAll('{{imageUri}}', imageUri.toString());
}
