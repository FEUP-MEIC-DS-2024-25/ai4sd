// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { json } from 'stream/consumers';
import * as vscode from 'vscode';
import { refactor } from './refactor/refactor';
import { TreeItem } from 'vscode';
import { MyWebviewViewProvider } from './components/myWebviewViewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "whattheduck" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('whattheduck.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from WhatTheDuck!');
	});

	context.subscriptions.push(disposable);

	// Register the renameAllVariables command
	const refactorCommand = vscode.commands.registerCommand('whattheduck.refactor', refactor);
	context.subscriptions.push(refactorCommand);

	// Register the webview provider
    const webviewProvider = new MyWebviewViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(MyWebviewViewProvider.viewType, webviewProvider)
    );	

}

// This method is called when your extension is deactivated
export function deactivate() {}
