import * as vscode from 'vscode';
import { getWebviewContent } from './frontend/webviewContent';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('access-ai.openChatbot', () => {
        openChatbotPanel(context);
    });

    context.subscriptions.push(disposable);
    console.log('Your chatbot extension "access-ai" is now active!');
}

export function deactivate() {}

function openChatbotPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'chatbot',
        'Access-ai',
        vscode.ViewColumn.Two,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent(context, panel.webview);

    // Temporary storage for the current session
    const sessionHistory: { sender: string; text: string }[] = [];

    panel.webview.onDidReceiveMessage(async message => {
        switch (message.type) {
            case 'userMessage': {
                const userMessage = { sender: 'user', text: message.text };
                sessionHistory.push(userMessage); // Add to session history

                // Pass session history to the bot
                const botResponse = await getGeminiResponse(sessionHistory);
                const botMessage = { sender: 'bot', text: botResponse };
                sessionHistory.push(botMessage); // Add bot response to session history

                // Send the bot's response back to the webview
                panel.webview.postMessage({ type: 'botMessage', text: botResponse });
                break;
            }
        }
    }, undefined, context.subscriptions);
}

async function getGeminiResponse(sessionHistory: { sender: string; text: string }[]): Promise<string> {
    try {
        // Format the session history as a single string
        const conversationContext = sessionHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

        const response = await fetch('http://127.0.0.1:5000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ textInput: conversationContext })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json() as { response?: string };
        return data.response || "Error: No response from Gemini";
    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        return "Error connecting to Gemini API or invalid response format.";
    }
}
