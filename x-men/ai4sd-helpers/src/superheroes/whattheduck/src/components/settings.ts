import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class mySettings {
    private readonly extensionUri: vscode.Uri;
    private languages = ['flutter', 'java', 'python', 'c++'];
    private languageExtensions = {
        'flutter': 'dart',
        'java': 'java',
        'python': 'py',
        'c++': 'cpp'
    };

    // Variable to hold the current language settings
    private languageSettings: { [key: string]: boolean } = {};

    // Variable to hold the reference to the webview panel
    private settingsPanel: vscode.WebviewPanel | undefined;

    constructor(private readonly context: vscode.ExtensionContext) {
        this.extensionUri = context.extensionUri;
        this.loadSettings();
    }

    // Initialize language settings with default values
    private initializeLanguageSettings() {
        this.languages.forEach((language) => {
            this.languageSettings[language] = true;
        });
    }

    public getLanguageSettings() {
        const updatedSettings: { [key: string]: boolean } = {};
        for (const language of this.languages) {
            const extension = this.languageExtensions[language as keyof typeof this.languageExtensions];
            if (extension) {
                updatedSettings[extension] = this.languageSettings[language] ?? false;
            }
        }
        return updatedSettings;
    }

    // Function to save the settings
    private saveSettings() {
        const settingsDir = path.join(this.context.globalStorageUri.fsPath, 'settings');

        // Ensure the directory exists
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }

        const settingsPath = path.join(settingsDir, 'settings.json');

        // Save the settings as JSON
        fs.writeFileSync(settingsPath, JSON.stringify(this.languageSettings, null, 4), 'utf8');
    }

    // Function to load the settings
    private loadSettings() {
        const settingsPath = path.join(this.context.globalStorageUri.fsPath, 'settings', 'settings.json');
        if (fs.existsSync(settingsPath)) {
            try {
                const fileContent = fs.readFileSync(settingsPath, 'utf8');
                const parsedSettings = JSON.parse(fileContent);

                if (typeof parsedSettings === 'object' && parsedSettings !== null) {
                    this.languageSettings = parsedSettings;
                } else {
                    throw new Error('Invalid settings format.');
                }
            } catch (error) {
                vscode.window.showErrorMessage('Failed to load settings. Reverting to defaults.');
                this.initializeLanguageSettings();
            }
        } else {
            this.initializeLanguageSettings();
        }
    }

    // Function to create the settings webview
    public createSettingsWebview() {
        if (this.settingsPanel) {
            if (!this.settingsPanel.visible) {
                this.settingsPanel.reveal(vscode.ViewColumn.Beside);
            }
        } else {
            this.settingsPanel = vscode.window.createWebviewPanel(
                'settings',
                'Settings',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(__dirname, '../resources'))
                    ]
                }
            );

            // Set the logo
            this.settingsPanel.iconPath = vscode.Uri.file(path.join(__dirname, '../../resources/whattheduck.jpg'));

            // Set the HTML content for the settings panel
            this.settingsPanel.webview.html = this.getSettingsContent();

            // Set up a listener for messages from the webview
            this.settingsPanel.webview.onDidReceiveMessage(
                message => {
                    if (message.command === 'toggleLanguage') {
                        const { language, value } = message;
                        if (language in this.languageSettings!) {
                            this.languageSettings![language] = value;
                            this.saveSettings();
                        }
                    }
                },
                undefined
            );

            // If the panel is closed, undefine the reference
            this.settingsPanel.onDidDispose(() => {
                this.settingsPanel = undefined;
            });
        }
    }

    // Function to get the content of the settings page and replace the placeholders
    private getSettingsContent(): string {
        const htmlPath = vscode.Uri.file(path.join(__dirname, '../../src/components/WebViews/settings.html'));
        let htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');

        const checkboxesHtml = Object.keys(this.languageSettings!)
            .map((language) => {
                const checked = this.languageSettings![language] ? 'checked' : '';
                return `
                <div class="toggle-container">
                    <span class="toggle-label">Enable ${language}:</span>
                    <input type="checkbox" id="${language}Toggle" ${checked}>
                </div>
            `;
            })
            .join('\n');

        htmlContent = htmlContent.replace('{{checkboxes}}', checkboxesHtml);

        return htmlContent;
    }
} 

// Database manager instance shared across the extension
export let settings: mySettings | undefined = undefined;

// Initialize the database manager
export async function setup(context: vscode.ExtensionContext): Promise<void> {
    settings = new mySettings(context);
}

// database getter
export function getSettings(): mySettings {
  if (!settings) {
    throw new Error('Settings not initialized');
  }
  return settings;
}