import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class MyWebviewViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'whattheduck.webview';
    private readonly extensionUri: vscode.Uri;

    constructor(private readonly context: vscode.ExtensionContext) {
        this.extensionUri = context.extensionUri;
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true
        };

        // Set the HTML content of the webview
        webviewView.webview.html = this.getWebviewContent(webviewView.webview);


        // Initially load the config when the webview is created
        this.loadConfig(webviewView.webview, 'default');

        // Trigger the loadConfig function only when the webview becomes visible again
        webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible) {
                this.loadConfig(webviewView.webview, 'default');  // No need to reload the content every time, only when visible
            }
        });

        // Listen for messages from the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'refactor':
                    // Call renameAllVariables and pass the filters from the webview
                    vscode.commands.executeCommand('whattheduck.refactor', message.filters);
                    break;
                case 'save':
                    const configName = await vscode.window.showInputBox({
                        prompt: 'Enter a name for this configuration',
                        placeHolder: 'Configuration name',
                        validateInput: (value) => value.trim() ? null : 'Configuration name cannot be empty',
                    });
                    if(configName){
                        this.saveConfig(configName, message.filters);
                    } else {
                        vscode.window.showWarningMessage('Configuration save cancelled. No name provided.');
                    }
                    break;       
                case 'promptLoad':
                    const configPath = path.join(this.context.globalStorageUri.fsPath, 'configs.json');
                    if (fs.existsSync(configPath)) {
                        const allConfigs = JSON.parse(fs.readFileSync(configPath, 'utf8'));

                        // Let the user pick a configuration
                        const selectedConfig = await vscode.window.showQuickPick(
                            Object.keys(allConfigs), // Get the keys (config names) to show in the picker
                            { placeHolder: 'Select a configuration to load' }
                        );

                        if (selectedConfig) {
                            // Send the selected config to the webview
                            this.loadConfig(webviewView.webview, selectedConfig);
                            vscode.window.showInformationMessage(`Loaded configuration "${selectedConfig}".`);
                        } else {
                            vscode.window.showWarningMessage('No configuration selected.');
                        }
                    } else {
                        vscode.window.showWarningMessage('No configuration file found. Save a configuration first!');
                    }
                    break;

               
            }
        });
    }

    private saveConfig(configName: string, filters: string[]) {
        const configPath = path.join(this.context.globalStorageUri.fsPath, 'configs.json');
        let configs: Record<string, string[]> = {};
    
        // If the file exists, read existing configurations
        if (fs.existsSync(configPath)) {
            const fileContents = fs.readFileSync(configPath, 'utf8');
            configs = JSON.parse(fileContents);
        }
    
        // Save or update the named configuration
        configs[configName] = filters;
    
        // Write the updated configurations back to the file
        fs.writeFileSync(configPath, JSON.stringify(configs, null, 4), 'utf8');
    
        vscode.window.showInformationMessage(`Configuration "${configName}" saved successfully!`);
    }

    private loadConfig(webview: vscode.Webview, configName: string) {
        const configPath = path.join(this.context.globalStorageUri.fsPath, 'configs.json');
        if (fs.existsSync(configPath)) {
            const fileContents = fs.readFileSync(configPath, 'utf8');
            const configs: Record<string, string[]> = JSON.parse(fileContents);
    
            // Check if the named configuration exists
            if (configs[configName]) {
                const filters = configs[configName];
                webview.postMessage({ command: 'load', filters });
            } else if(configName === 'default') {
                webview.postMessage({ command: 'load', filters: [] });
            } else {
                vscode.window.showErrorMessage(`Configuration "${configName}" not found.`);
            }
        }
    }

    private getWebviewContent(webview: vscode.Webview): string {
        const webviewFolder = path.join(this.extensionUri.fsPath, '/src/components/webview');

        const htmlPath = path.join(webviewFolder, 'webview.html');

        let html = fs.readFileSync(htmlPath, 'utf-8');

        const cssUri = webview.asWebviewUri(vscode.Uri.file(path.join(webviewFolder, 'webview.css')));
        const jsUri = webview.asWebviewUri(vscode.Uri.file(path.join(webviewFolder, 'webview.js')));

        html = html.replace('{{cssUri}}', cssUri.toString());
        html = html.replace('{{jsUri}}', jsUri.toString());

        return html;
    }
}