import * as vscode from 'vscode';

export class MyWebviewViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'analysers.extensionSidePanel';

    constructor(private readonly context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        const entries = [
            {
                label: "ArchiDetect",
                description: "Executes ArchiDetect superhero",
                execute: async (context: vscode.ExtensionContext) => (await import('../superheroes/ArchiDetect/ArchiDetect.js')).execute()
            },
            {
                label: "Warden AI",
                description: "Executes Warden AI superhero",
                execute: async () => (await import('../superheroes/warden_ai/warden_ai.js')).execute()
            },
            {
                label: "SARA",
                description: "Executes SARA superhero",
                execute: async (context: vscode.ExtensionContext) => (await import('../superheroes/SARA/SARA.js')).execute(context)
            },
            {
                label: "Archy",
                description: "Executes Archy superhero",
                execute: async (context: vscode.ExtensionContext) => (await import('../superheroes/Archy/Archy.js')).execute(context)
            }
        ];


        webviewView.webview.options = {
            enableScripts: true
        };
    
        // Set the HTML content of the webview
        webviewView.webview.html = this.getWebviewContent(entries);

        // Listen for messages from the webview
        
        webviewView.webview.onDidReceiveMessage(async (message) => {
            const entry = entries.find(e => e.label === message.label);
            if (entry) {
                try {
                    await entry.execute(this.context);
                    vscode.window.showInformationMessage(`${entry.label} executed successfully!`);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to execute ${entry.label}: ${error}`);
                }
            }
        });
    }

    private getWebviewContent(entries: any[]): string {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Superheroes</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #1e1e1e;
                color: white;
            }
            h1 {
                text-align: center;
            }
            .entry {
                padding: 15px;
                margin: 10px;
                background-color: #333;
                border-radius: 5px;
                cursor: pointer;
            }
            .entry:hover {
                background-color: #444;
            }
        </style>
    </head>
    <body>
        <h1>Superheroes</h1>
        ${entries.map(entry => `
            <div class="entry" onclick="handleClick('${entry.label}')">
                <h2>${entry.label}</h2>
                <p>${entry.description}</p>
            </div>
        `).join('')}
        <script>
            const vscode = acquireVsCodeApi();
    
            function handleClick(label) {
                vscode.postMessage({ label });
            }
        </script>
    </body>
    </html>`;
    }
}
