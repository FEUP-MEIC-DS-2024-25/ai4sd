import * as vscode from 'vscode';

export class MyWebviewViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'whattheduck.webview';

    constructor(private readonly extensionUri: vscode.Uri) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true
        };

        // Set the HTML content of the webview
        webviewView.webview.html = this.getWebviewContent();

        // Listen for messages from the webview
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'refactor') {
                // Call renameAllVariables and pass the filters from the webview
                vscode.commands.executeCommand('whattheduck.refactor', message.filters);
            }
        });
    }

    private getWebviewContent(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    /* Root styling */
                    html,
                    body {
                        height: 100%;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-sideBar-background);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    /* Main container */
                    .container {
                        width: 90%;
                        max-width: 300px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 10px;
                    }

                    /* Checkbox container styling */
                    .checkbox-container {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 15px;
                        gap: 10px;
                    }

                    /* Checkbox styling */
                    input[type="checkbox"] {
                        display: none;
                    }

                    /* Label styling */
                    .checkbox-label {
                        display: flex;
                        align-items: center;
                        padding: 6px 10px;
                        width: 100%;
                        font-size: 13px;
                        background-color: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-sideBar-border);
                        border-radius: 2px;
                        cursor: pointer;
                        transition: background-color 0.2s, border-color 0.2s;
                        box-sizing: border-box;
                    }

                    /* Style for the selected state */
                    input[type="checkbox"]:checked + .checkbox-label {
                        background-color: rgba(0, 0, 0, 0.1);
                        background-blend-mode: multiply;
                        border-color: var(--vscode-button-background);
                    }

                    /* Hover effect */
                    .checkbox-label:hover {
                        border-color: var(--vscode-editorHoverHighlight-background);
                    }

                    /* Button styling */
                    .button-container {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }

                    button {
                        width: 100%;
                        padding: 10px 0;
                        font-size: 13px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <div class="checkbox-container">
                        <input type="checkbox" id="renameVariables" />
                        <label for="renameVariables" class="checkbox-label">
                            Rename Variables
                        </label>

                        <input type="checkbox" id="inlineTemps" />
                        <label for="inlineTemps" class="checkbox-label">
                            Inline Temporary Variables
                        </label>

                        <input type="checkbox" id="extractVariables" />
                        <label for="extractVariables" class="checkbox-label">
                            Extract Variables
                        </label>

                        <input type="checkbox" id="extractMethods" />
                        <label for="extractMethods" class="checkbox-label">
                            Extract Methods
                        </label>

                        <input type="checkbox" id="renameMethods" />
                        <label for="renameMethods" class="checkbox-label">
                            Rename Methods
                        </label>

                        <input type="checkbox" id="inlineMethods" />
                        <label for="inlineMethods" class="checkbox-label">
                            Inline Methods
                        </label>

                        <input type="checkbox" id="replaceTempWithQuery" />
                        <label for="replaceTempWithQuery" class="checkbox-label">
                            Replace Temp with Query
                        </label>

                        <input type="checkbox" id="removeAssignmentsToParameters" />
                        <label for="removeAssignmentsToParameters" class="checkbox-label">
                            Remove Assignments to Parameters
                        </label>

                        <input type="checkbox" id="removeParameters" />
                        <label for="removeParameters" class="checkbox-label">
                            Remove Parameters
                        </label>

                        <input type="checkbox" id="replaceMagicNumbers" />
                        <label for="replaceMagicNumbers" class="checkbox-label">
                            Replace Magic Numbers
                        </label>

                        <input type="checkbox" id="consolidateDuplicateConditionals" />
                        <label for="consolidateDuplicateConditionals" class="checkbox-label">
                            Consolidate Duplicate Conditionals
                        </label>

                        <input type="checkbox" id="removeNestedConditionals" />
                        <label for="removeNestedConditionals" class="checkbox-label">
                            Remove Nested Conditionals
                        </label>
                    </div>

                    <div class="button-container">
                        <button id="refactorButton">Refactor</button>
                    </div>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();

                    document.getElementById('refactorButton').addEventListener('click', () => {
                        // Get all checked filters
                        const filters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                            .map(checkbox => checkbox.id);

                        // Send the selected filters to the VS Code extension
                        vscode.postMessage({ command: 'refactor', filters });
                    });
                </script>
            </body>
            </html>`;
    }
}
