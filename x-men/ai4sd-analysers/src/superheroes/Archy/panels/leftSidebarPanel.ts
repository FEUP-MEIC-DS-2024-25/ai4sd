import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { processArchitecture } from "../scripts/processArchitecture";
import { ArchitectureResultsPanel } from "./ArchitectureResultsPanel.js";
import {fetchRecentRequests, RecentRequest} from "../utilities/firebase";
import * as admin from "firebase-admin";
import * as path from 'path';

export class LeftSidebarPanel implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        
        console.log("Resolve webview");


        this._view = webviewView;
        const webview = webviewView.webview;
        

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

       fetchRecentRequests()
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
                    // Call the backend to get the full request details by its ID
                    const response = await fetch(`https://superhero-02-04-150699885662.europe-west1.run.app/requests/${message.id}`);
                    
                    if (!response.ok) {
                        throw new Error("Failed to fetch the request data");
                    }
                    
                    const { resultMarkdown } = await response.json(); // Extract the resultMarkdown content
            
                    // Render the markdown content in your panel
                    ArchitectureResultsPanel.render(this._extensionUri, resultMarkdown);
            
                    vscode.window.showInformationMessage("Loading recent request...");
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
                    title: "Analyzing architecture...",
                    cancellable: false
                },
                async (progress) => {
                    let index = 0;
                    const loadingMessages = [
                        "Analyzing the project's architecture",
                        "Analyzing the project's architecture .",
                        "Analyzing the project's architecture ..",
                        "Analyzing the project's architecture ..."
                    ];
            
                    const interval = setInterval(() => {
                        progress.report({ message: loadingMessages[index] });
                        index = (index + 1) % loadingMessages.length;
                    }, 500);
            
                    try {
                        // Perform the analysis
                        const resultMarkdown = await processArchitecture(includeCommits, includeDocumentation, language);
                        clearInterval(interval);
                        progress.report({ message: "Analysis Complete!" });
            
                        // Send the resultMarkdown to the backend
                        const response = await fetch('https://superhero-02-04-150699885662.europe-west1.run.app/requests/save-markdown', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                resultMarkdown: resultMarkdown,
                                mode: mode, // ensure `mode` is defined
                            }),
                        });
            
                        if (response.ok) {
                            vscode.window.showInformationMessage("Results saved to Firestore!");
                        } else {
                            vscode.window.showErrorMessage("Failed to save the results to Firestore.");
                        }
            
                        // Return resultMarkdown so the next part of the code can access it
                        return resultMarkdown;
            
                    } catch (error: unknown) {
                        clearInterval(interval);
                    
                        // Check if 'error' has a 'message' property
                        if (typeof error === 'object' && error !== null && 'message' in error) {
                            const typedError = error as { message: string };
                            vscode.window.showErrorMessage(`Execution failed: ${typedError.message || 'Unknown error occurred'}`);
                        } else {
                            vscode.window.showErrorMessage('Execution failed: Unknown error occurred');
                        }
                    
                        return null; // Return null in case of error
                    }
                }
            );
            
            // Handle the resultMarkdown once the promise resolves
            progressNotification.then(resultMarkdown => {
                if (resultMarkdown) {
                    ArchitectureResultsPanel.render(this._extensionUri, resultMarkdown);
                }
            });
            
            /*
            if (message.command === "archy.startExecution") {
                const includeCommits = message.includeCommits;
                const includeDocumentation = message.includeDocumentation;
                const language = message.language || "english"; // Default language
        
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
                            // Perform the analysis
                            const resultMarkdown = await processArchitecture(includeCommits, includeDocumentation, language);
        
                            clearInterval(interval); // Stop updating progress
                            progress.report({ message: "Analysis Complete!" });
        
                            // Directly render the results in the webview
                            ArchitectureResultsPanel.render(this._extensionUri, resultMarkdown);
        
                            vscode.window.showInformationMessage("Analysis complete! Results displayed.");
                        } catch (error: any) {
                            clearInterval(interval);
                            vscode.window.showErrorMessage(`Execution failed: ${error.message || "Unknown error occurred"}`);
                        }
                    }
                );  
            }*/
        });
        
    }

    show(): void {
        if (this._view) {
            this._view.show?.(true); // Reveal the view if it exists
        }
    }

    _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri, recentRequests: RecentRequest[]) {
        console.log("Resolve html");
      
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