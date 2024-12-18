import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import * as path from 'path';

const fs = require('fs')
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

export class ArchitectureResultsPanel {
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly originalMarkdownText: string;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, patternResult: string) {
        this.originalMarkdownText = patternResult; // Save markdown results obtained from LLM 
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables); // Call dispose method when window closed
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri); // Set the HTML content for the webview panel
        this._setWebviewMessageListener(this._panel.webview); // Setup listener for webview
    }

    public static render(extensionUri: vscode.Uri, patternResult: string) {
        const panel = vscode.window.createWebviewPanel(
            "architectureResults",
            "Architecture Results",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(extensionUri.fsPath, 'out', 'superheroes', 'Archy')),
                    vscode.Uri.file(path.join(extensionUri.fsPath, 'src', 'superheroes', 'Archy', 'panels'))
                ],
            }
        );

        new ArchitectureResultsPanel(panel, extensionUri, patternResult);
    }

    public dispose() {
        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(async (message: any) => {
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
                    } catch (error: any) {
                        vscode.window.showErrorMessage(`Execution failed: ${error.message || "Unknown error occurred"}`);
                    }
                    return;
            }
        }, undefined, this._disposables);
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const webviewUri = getUri(webview, extensionUri, ["out", "superheroes", "Archy","webview.js"]);
        const stylesUri = getUri(webview, extensionUri, ["src", "superheroes", "Archy", "panels", "ArchitectureResultsPanel.css"]);
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
