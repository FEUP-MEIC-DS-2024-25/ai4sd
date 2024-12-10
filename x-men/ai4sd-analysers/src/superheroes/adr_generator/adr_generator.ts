import * as vscode from "vscode";

export async function execute(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        "adrGeneratorMenu",     // Panel identifier
        "ADR Generator",        // Panel title
        vscode.ViewColumn.Two,  // Column where it will be shown
        { enableScripts: true } // Allow script execution
    );

    // Menu HTML
    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ADR Generator</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 16px;
                }
                h1 {
                    background: -webkit-linear-gradient(#007acc, #808080);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-align: center;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin: 8px 0;
                    box-sizing: border-box;
                }
                button {
                    padding: 12px 28px;
                    background-color: #007acc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #005a9e;
                }
            </style>
        </head>
        <body>
            <h1>ADR Generator</h1>
            <label for="repo-url">Repository URL:</label>
            <input id="repo-url" type="text" placeholder="Enter repository link" />

            <label for="architectural-patterns">Architectural Patterns:</label>
            <input id="architectural-patterns" type="text" placeholder="Enter architectural patterns" />

            <button id="generate-button">Generate</button>

            <script>
                const vscode = acquireVsCodeApi();
                
                document.getElementById('generate-button').addEventListener('click', () => {
                    const repoUrl = document.getElementById('repo-url').value;
                    const patterns = document.getElementById('architectural-patterns').value;

                    vscode.postMessage({
                        command: 'generate',
                        data: { repoUrl, patterns }
                    });
                });
            </script>
        </body>
        </html>
    `;

    // Interacting with the backend on button press
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === "generate") {
            const { repoUrl, patterns } = message.data;

            if (!repoUrl || !patterns) {
                vscode.window.showErrorMessage("Both fields are required!");
                return;
            }

            try {
                const adrContent = await callBackendApi(repoUrl, patterns);
                const document = await vscode.workspace.openTextDocument({
                    language: "markdown",
                    content: adrContent
                });
                vscode.window.showTextDocument(document);
            } catch (error) {
                const fallbackMarkdown = `# ADR Generation Failed\n\nUnfortunately, we could not generate an ADR for the provided input.\n\n**Repository URL**: ${repoUrl}\n**Patterns**: ${patterns}`;
                const document = await vscode.workspace.openTextDocument({
                    language: "markdown",
                    content: fallbackMarkdown
                });
                vscode.window.showTextDocument(document);
            }
        }
    });
}

async function callBackendApi(repoUrl: string, patterns: string): Promise<string> {
    const apiUrl = "http://localhost:5000/generate"; // Python backend URL

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            repoUrl,
            patterns,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
}