import * as vscode from 'vscode';
import * as path from 'path';

export function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
    // Resolve the path to the style.css file
    const cssPath = vscode.Uri.file(
        path.join(context.extensionPath, 'src/frontend', 'style.css')
    );
    const cssUri = webview.asWebviewUri(cssPath); // Convert to webview URI for CSS

    // Resolve the path to the script.js file
    const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, 'src/frontend', 'script.js')
    );
    const scriptUri = webview.asWebviewUri(scriptPath); // Convert to webview URI for JS

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Chatbot</title>
            <link href="${cssUri}" rel="stylesheet"> <!-- Load the CSS -->
        </head>
        <body>
            <div class="chat-container">
                <div class="messages" id="messages"></div>
                <div class="input-container">
                    <input id="userInput" type="text" placeholder="Type a message..." onkeydown="handleKeyPress(event)" />
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> <!-- External JS Library -->
            <script src="${scriptUri}"></script> <!-- Load the external script -->
        </body>
        </html>
    `;
}
