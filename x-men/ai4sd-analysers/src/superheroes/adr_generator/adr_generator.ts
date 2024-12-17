import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

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
                input, label {
                    display: block;
                    margin: 8px 0;
                }
                input[type="text"] {
                    width: 100%;
                    padding: 8px;
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
                .checkbox-container {
                    display: flex;
                    align-items: center;
                }
                .checkbox-container label {
                    margin-left: 8px;
                }
            </style>
        </head>
        <body>
            <h1>ADR Generator</h1>
            <label for="repo-url">Repository URL:</label>
            <input id="repo-url" type="text" placeholder="Enter repository link" />

            <label for="architectural-patterns">Architectural Patterns:</label>
            <input id="architectural-patterns" type="text" placeholder="Enter architectural patterns" />

            <label for="save-path">Path to Save ADR:</label>
            <input id="save-path" type="text" placeholder="Enter local path to save ADR" />

            <div class="checkbox-container">
                <input id="save-checkbox" type="checkbox" />
                <label for="save-checkbox">Save ADR to the specified path</label>
            </div>

            <button id="generate-button">Generate</button>

            <script>
                const vscode = acquireVsCodeApi();
                
                document.getElementById('generate-button').addEventListener('click', () => {
                    const repoUrl = document.getElementById('repo-url').value;
                    const patterns = document.getElementById('architectural-patterns').value;
                    const savePath = document.getElementById('save-path').value;
                    const saveToFile = document.getElementById('save-checkbox').checked;

                    vscode.postMessage({
                        command: 'generate',
                        data: { repoUrl, patterns, savePath, saveToFile }
                    });
                });
            </script>
        </body>
        </html>
    `;

    // Interacting with the backend on button press
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === "generate") {
            const { repoUrl, patterns, savePath, saveToFile } = message.data;

            if (!repoUrl || !patterns) {
                vscode.window.showErrorMessage("Repository URL and Architectural Patterns are required!");
                return;
            }

            try {
                vscode.window.showInformationMessage(`Generating ADR File ...`);
                const adrContent = await callBackendApi(repoUrl, patterns);

                // Save ADR file only if the checkbox is checked
                if (saveToFile) {
                    if (!savePath) {
                        vscode.window.showErrorMessage("Path to save ADR is required when 'Save' is selected!");
                        return;
                    }

                    if (!fs.existsSync(savePath) || !fs.lstatSync(savePath).isDirectory()) {
                        vscode.window.showErrorMessage("Invalid path. Please provide a valid directory.");
                        return;
                    }

                    const fileName = `ADR_${Date.now()}.md`;
                    const fullPath = path.join(savePath, fileName);

                    fs.writeFileSync(fullPath, adrContent, { encoding: "utf8" });

                    vscode.window.showInformationMessage(`ADR successfully saved to ${fullPath}`);
                }

                // Open ADR content in a new editor tab
                const document = await vscode.workspace.openTextDocument({
                    language: "markdown",
                    content: adrContent
                });
                vscode.window.showTextDocument(document);
            } catch (error) {
                vscode.window.showErrorMessage("Error generating ADR");
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
