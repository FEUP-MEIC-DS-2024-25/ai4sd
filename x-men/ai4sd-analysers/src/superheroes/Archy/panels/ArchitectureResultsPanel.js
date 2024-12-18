import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
export class ArchitectureResultsPanel {
    _panel;
    _disposables = [];
    originalMarkdownText;
    constructor(panel, extensionUri, patternResult) {
        this.originalMarkdownText = patternResult; // Save markdown results obtained from LLM 
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables); // Call dispose method when window closed
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri); // Set the HTML content for the webview panel
        this._setWebviewMessageListener(this._panel.webview); // Setup listener for webview
    }
    static render(extensionUri, patternResult) {
        const panel = vscode.window.createWebviewPanel("architectureResults", "Architecture Results", vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "out"),
                vscode.Uri.joinPath(extensionUri, "src"), // Add CSS file
            ],
        });
        new ArchitectureResultsPanel(panel, extensionUri, patternResult);
    }
    dispose() {
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage(async (message) => {
            const command = message.command;
            switch (command) {
                case "saveOutput":
                    try {
                        const uri = await vscode.window.showSaveDialog({
                            filters: {
                                "Markdown Files": ["md"],
                            },
                        });
                        if (uri) {
                            // If user defines a save path
                            fs.writeFileSync(uri.fsPath, this.originalMarkdownText);
                            vscode.window.showInformationMessage("File saved successfully!");
                        }
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(`Execution failed: ${error.message || "Unknown error occurred"}`);
                    }
                    return;
            }
        }, undefined, this._disposables);
    }
    _getWebviewContent(webview, extensionUri) {
        const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
        const stylesUri = getUri(webview, extensionUri, ["src", "panels", "ArchitectureResultsPanel.css"]); // CSS file
        const nonce = getNonce();
        const htmlResult = md.render(this.originalMarkdownText);
        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
                <title>Architecture Results</title>
                <link href="${stylesUri}" rel="stylesheet">
            </head>
            <body>
                <h1>Results</h1>
                <pre id="outputText">${htmlResult}</pre>
                <vscode-button id="saveOutputButton">Save result</vscode-button>
                <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
            </body>
            </html>
        `;
    }
}
