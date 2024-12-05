// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sara-example" is now active!');
	const string = "wowowo";

	const disposable = vscode.commands.registerCommand('sara-example.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from sara-example!');
	});

	context.subscriptions.push(disposable);

	const baseExt = vscode.extensions.getExtension('undefined_publisher.ai4sd')?.exports;
	if (!baseExt) {
		throw new Error("Base AI4SD extension not found.");
	}

	baseExt.register({label: "SARA", description: "SARA", execute: function () {vscode.window.showInformationMessage(`i was executed ${string}`);}});
}

// This method is called when your extension is deactivated
export function deactivate() {}
