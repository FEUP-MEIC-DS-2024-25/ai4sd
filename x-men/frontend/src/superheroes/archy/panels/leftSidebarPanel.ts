import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { processArchitecture } from "../scripts/processArchitecture";
import { ArchitectureResultsPanel } from "./ArchitectureResultsPanel";

export class LeftSidebarPanel implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        const webview = webviewView.webview;

        webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // HTML content for the sidebar
        webview.html = this._getHtmlForWebview(webview, this._extensionUri);

        // Handle messages from the sidebar webview
        webview.onDidReceiveMessage(async (message) => {
            const loadingMessages = [
                "Analyzing the project's architecture",
                "Analyzing the project's architecture .",
                "Analyzing the project's architecture ..",
                "Analyzing the project's architecture ..."
            ];

            let mode = "both";
            if (message.command === 'archy.startExecutionBoth') {
                mode = "both";
            } else if (message.command === 'archy.startExecutionCommits') {
                mode = "commits";
            } else if (message.command === 'archy.startExecutionDocumentation') {
                mode = "documentation";
            }

            const progressNotification = vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "",
                    cancellable: false
                },
                async (progress) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        progress.report({ message: loadingMessages[index] });
                        index = (index + 1) % loadingMessages.length;
                    }, 500);

                    try {
                        const resultMarkdown = await processArchitecture(mode); // fetch markdown result
                        clearInterval(interval); // stop updating the notification when result arrives
                        progress.report({ message: "Analysis Complete!" });
                        return resultMarkdown;
                    } catch (error: any) {
                        clearInterval(interval);
                        vscode.window.showErrorMessage(`Execution failed: ${error.message || 'Unknown error occurred'}`);
                    }
                }
            );

            // When the markdown content is ready, render it on the right panel
            progressNotification.then(resultMarkdown => {
                if (resultMarkdown) {
                    ArchitectureResultsPanel.render(this._extensionUri, resultMarkdown);
                }
            });
        });
    }

    _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
        const nonce = getNonce();
        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Archy</title>
                    <style>
                        .panel {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                        }
                        body {
                            font-family: Arial, sans-serif;
                        }

                        div {
                            margin-bottom: 10px;
                            display: flex;
                            align-items: center;
                        }

                        input[type="checkbox"] {
                            margin-right: 10px;
                        }

                        button {
                            background-color: var(--vscode-button-background);
                            border: none;
                            border-radius: 5px;
                            color: var(--vscode-button-foreground);
                            padding: 10px 20px;
                            cursor: pointer;
                            transition: background-color 0.3s ease;
                            width: 100%;
                            max-width: 300px;
                            height: auto;
                        }

                        button:hover {
                            background-color: var(--vscode-button-hoverBackground);
                        }
                        
                        button:active {
                            background-color: var(--vscode-button-activeBackground);
                        }

                        button:focus {
                            outline: 2px solid var(--vscode-focusBorder);
                        }
                        
                        button:disabled {
                            background-color: var(--vscode-button-secondaryBackground);
                            color: var(--vscode-button-secundaryForeground);
                            cursor: not-allowed;
                        }
                    </style>
                </head>
                <body>
                    <!-- Checkboxes -->
                    <p>Select the data sources to infer the architecture of your project:</p>
                    <div>
                        <input type="checkbox" id="commits" checked />
                        <label for="commits">Commits</label>
                    </div>
                    <div>
                        <input type="checkbox" id="documentation" checked />
                        <label for="documentation">Documentation</label>
                    </div>

                    <!-- Button -->
                    <p>Click the button below to infer the architecture of your opened project.</p>
                    <button id="leftSidebarStartButton">Infer Architecture</button>
                    
                    <script nonce="${nonce}">
                        const vscode = acquireVsCodeApi();
                        const button = document.getElementById('leftSidebarStartButton');
                        const commits = document.getElementById('commits');
                        const documentation = document.getElementById('documentation');

                        // Function to check if at least one checkbox is checked
                        function updateButtonState() {
                            button.disabled = !(commits.checked || documentation.checked);
                        }

                        // Event listeners for checkboxes
                        commits.addEventListener('change', updateButtonState);
                        documentation.addEventListener('change', updateButtonState);

                        button.addEventListener('click', () => {
                            // Determine command based on checkbox states
                            if (commits.checked && documentation.checked) {
                                vscode.postMessage({ command: 'archy.startExecutionBoth' });
                            } else if (commits.checked) {
                                vscode.postMessage({ command: 'archy.startExecutionCommits' });
                            } else if (documentation.checked) {
                                vscode.postMessage({ command: 'archy.startExecutionDocumentation' });
                            }
                        });
                    </script>
                </body>
            </html>
        `;
    }
}


// This method is called when your extension is deactivated
export function deactivate() {}