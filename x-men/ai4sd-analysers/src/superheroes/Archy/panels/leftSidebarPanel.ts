import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { processArchitecture } from "../scripts/processArchitecture";
import { ArchitectureResultsPanel } from "./ArchitectureResultsPanel.js";
import { getFirestore, fetchRecentRequests } from "../utilities/firebase";
import * as admin from "firebase-admin";
import * as path from 'path';

export class LeftSidebarPanel implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        
        this._view = webviewView;
        const webview = webviewView.webview;
        
        const firestore = getFirestore(this._extensionUri);

        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this._extensionUri.fsPath, 'out', 'superheroes', 'Archy')),
                vscode.Uri.file(path.join(this._extensionUri.fsPath, 'src', 'superheroes', 'Archy', 'assets'))
            ]
        };

        if (!this._view) {
            return;
        }

        webview.html = this._getLoadingHtml();

        fetchRecentRequests(firestore)
        .then((recentRequests) => {
            webview.html = this._getHtmlForWebview(webview, this._extensionUri, recentRequests);
        })
        .catch((error) => {
            vscode.window.showErrorMessage(`Failed to load recent requests: ${error.message}`);
        });

        // Handle messages from the sidebar webview
        webview.onDidReceiveMessage(async (message) => {
            const loadingMessages = [
                "Analyzing the project's architecture",
                "Analyzing the project's architecture .",
                "Analyzing the project's architecture ..",
                "Analyzing the project's architecture ..."
            ];

            if (message.command === "archy.loadRecentRequest") {
                try {
                    const docSnapshot = await firestore.collection("superhero-02-04").doc(message.id).get();
                    if (docSnapshot.exists) {
                        const data = docSnapshot.data();
                        const resultMarkdown = data?.resultMarkdown || "No content available for this request.";
                        ArchitectureResultsPanel.render(this._extensionUri, resultMarkdown); // Opens a new tab
                        vscode.window.showInformationMessage("Loading recent request...");
                    } else {
                        vscode.window.showErrorMessage("The selected request does not exist.");
                    }
                } catch (error: any) {
                    vscode.window.showErrorMessage(`Failed to load the recent request: ${error.message || "Unknown error"}`);
                }
                return;
            }
            
            let includeCommits = message.includeCommits;
            let includeDocumentation = message.includeDocumentation;
            let language = message.language || "english"; // default language is english

            let mode = "both";
            if (!includeDocumentation) {
                mode = "commits";
            } else if (!includeCommits) {
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
                        const resultMarkdown = await processArchitecture(includeCommits, includeDocumentation, language); // fetch markdown result
                        clearInterval(interval); // stop updating the notification when result arrives
                        progress.report({ message: "Analysis Complete!" });

                        const docRef = firestore.collection("superhero-02-04").doc();
                        await docRef.set({
                            mode: mode,
                            resultMarkdown: resultMarkdown,
                            timestamp: admin.firestore.FieldValue.serverTimestamp(),
                        });

                        vscode.window.showInformationMessage("Results saved to Firestore!");


                        return resultMarkdown;
                    } catch (error: any) {
                        clearInterval(interval);
                        vscode.window.showErrorMessage(`Execution failed: ${error.message || 'Unknown error occurred'}`);
                    }
                }
            );

            progressNotification.then(resultMarkdown => {
                if (resultMarkdown) {
                    ArchitectureResultsPanel.render(this._extensionUri, resultMarkdown);
                }
            });
        });
    }

    _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri, recentRequests: { id: string, mode: string }[]) {
        const webviewUri = getUri(webview, extensionUri, ["out", "superheroes", "Archy", "webview.js"]);
        const languagesJsonUri = webview.asWebviewUri(vscode.Uri.file(path.join(extensionUri.fsPath, 'src', 'superheroes', 'Archy', 'assets', 'languages.json')));
        const nonce = getNonce();

        const recentRequestsHtml = recentRequests.map(request => `
            <div class="sidebar-item" data-id="${request.id}">
                <span>${request.id}</span>
            </div>
        `).join('');
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
                            flex-direction: column;
                            width: 100%;
                            height: 100%;
                        }

                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            margin-left: 25px;
                        }

                        input[type="checkbox"] {
                            margin-right: 10px;
                        }

                        select option {
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            max-width: 300px; /* Adjust width as needed */
                            display: block;
                        }

                        select {
                            margin: 10px 0;
                            padding: 5px;
                            width: 100%;
                            max-width: 300px;
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

                        .dropdown {
                            padding: 10px;
                            padding-top: 20px;
                        }

                        .dropdown-button {
                            background-color: 0x000000;
                            color: 0x000000;
                            border: none;
                            cursor: pointer;
                            width: 100%;
                            text-align: left;
                        }

                        .dropdown-content {
                            display: none;
                            flex-direction: column;
                            margin-top: 10px;
                            padding-left: 10px;
                            border-left: 2px solid var(--vscode-foreground);
                        }

                        .dropdown-content .sidebar-item {
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            transition: background-color 0.2s ease;
                        }

                        .sidebar-item:hover {
                            background-color: var(--vscode-button-hoverBackground);
                        }

                        .sidebar-item:active {
                            background-color: var(--vscode-button-activeBackground);
                        }

                        .icon {
                            margin-right: 8px;
                        }

                        .sidebar-item span {
                            flex: 1;
                            color: var(--vscode-foreground);
                        }

                        .show {
                            display: flex;
                        }
                        </style>
                </head>
                <body>
                <div class="panel">
                    <!-- Checkboxes -->
                    <div class="menu">
                        <p>Select the data sources to infer the architecture of your project:</p>
                        <div>
                            <input type="checkbox" id="commits" checked />
                            <label for="commits">Commits</label>
                        </div>
                        <div>
                            <input type="checkbox" id="documentation" checked />
                            <label for="documentation">Documentation</label>
                        </div>

                        <!-- Language Selection -->
                        <p>Select the language for analysis results:</p>
                        <select id="languageSelector">
                            <option value="" disabled selected>Loading languages...</option>
                        </select>

                        <!-- Button -->
                        <p>Click the button below to infer the architecture of your opened project.</p>
                        <button id="leftSidebarStartButton">Infer Architecture</button>
                    </div>    

                    <div class="dropdown">
                        <div class="dropdown-button" id="toggleDropdown">▽ Previous Requests</button></div>
                        <div class="dropdown-content" id="dropdownContent">
                            ${recentRequestsHtml}
                        </div>
                    </div>
                    
                    <script nonce="${nonce}">
                        const vscode = acquireVsCodeApi();
                        const languagesJsonUri = "${languagesJsonUri}";
                        const languageSelector = document.getElementById('languageSelector');
                        const button = document.getElementById('leftSidebarStartButton');
                        const commits = document.getElementById('commits');
                        const documentation = document.getElementById('documentation');

                        const recentRequests = document.querySelectorAll('.sidebar-item');
                        recentRequests.forEach(item => {
                            item.addEventListener('click', () => {
                                const requestId = item.getAttribute('data-id');
                                vscode.postMessage({ command: 'archy.loadRecentRequest', id: requestId });
                            });
                        });

                        // Function to check if at least one checkbox is checked
                        function updateButtonState() {
                            button.disabled = !(commits.checked || documentation.checked);
                        }

                        // Event listeners for checkboxes
                        commits.addEventListener('change', updateButtonState);
                        documentation.addEventListener('change', updateButtonState);

                        // Fetch and populate languages
                        fetch(languagesJsonUri)
                            .then(response => response.json())
                            .then(languages => {
                                languageSelector.innerHTML = '<option value="" disabled selected>Select a language...</option>';
                                languages.forEach(language => {
                                    const option = document.createElement('option');
                                    option.value = language.code;
                                    option.textContent = \`\${language.name} (\${language.nativeName})\`;
                                    option.title = language.name; // Set the title for hover tooltip
                                    languageSelector.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Failed to load languages:', error);
                                languageSelector.innerHTML = '<option value="" disabled>Error loading languages</option>';
                            });

                        button.addEventListener('click', () => {
                            // Get the selected language
                            const selectedLanguage = languageSelector.value;

                            // Determine command based on checkbox states
                            vscode.postMessage({ 
                                command: 'archy.startExecution', 
                                includeCommits: commits.checked, 
                                includeDocumentation: documentation.checked,
                                language: selectedLanguage
                            });
                        });

                        const toggleButton = document.getElementById('toggleDropdown');
                        const dropdownContent = document.getElementById('dropdownContent');
                        dropdownContent.classList.add('show');

                        // Toggle the visibility of the dropdown content
                        toggleButton.addEventListener('click', () => {
                            const isHidden = dropdownContent.classList.contains('show');
                            if (isHidden) {
                                dropdownContent.classList.remove('show');
                            } else {
                                dropdownContent.classList.add('show');
                            }
                        });
                    </script>
                </div>
                </body>
            </html>
        `;
    }

    private _getLoadingHtml() {
     return /*html*/`
         <html>
             <body>
                 <div style="text-align: center; padding: 20px;">
                     <p>Loading history of requests...</p>
                 </div>
             </body>
         </html>
     `;
}
}


// This method is called when your extension is deactivated
export function deactivate() {}