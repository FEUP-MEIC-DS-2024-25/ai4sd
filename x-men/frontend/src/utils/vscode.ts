import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";

export function getTemplate(fileName: string, webview: vscode.Webview, dirName: string): string {
    const extensionUri = vscode.Uri.file(path.join(dirName, "../../../"));
    const templatePath = vscode.Uri.joinPath(extensionUri, 'public', 'template', fileName + '.html');
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'public', 'css', fileName +'.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'public', 'js', fileName + '.js'));
    const content = fs.readFileSync(templatePath.fsPath, 'utf-8');

    return content
        .replace('{{styleUri}}', styleUri.toString())
        .replace('{{scriptUri}}', scriptUri.toString());
}