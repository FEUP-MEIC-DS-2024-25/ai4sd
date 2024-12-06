// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as dotenv from "dotenv";

import * as localRepo from "./local-repo";
import * as remoteRepo from "./remote-repo";
import { getTemplate } from "./utils/vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "sara-example" is now active!');
	vscode.window.showInformationMessage('Congratulations, your extension "sara-example" is now active!');
	dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

	const string = "wowowo";

	const disposable = vscode.commands.registerCommand('sara-example.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from sara-example!');
		vscode.window.showInformationMessage('chega');
		executeSara(context);
	});
	
	const baseExt = vscode.extensions.getExtension('undefined_publisher.ai4sd')?.exports;
	if (!baseExt) {
		throw new Error("Base AI4SD extension not found.");
	}

	baseExt.register({label: "SARA", description: "SARA", execute: () => executeSara(context)});
	
	context.subscriptions.push(disposable);
}

function executeSara(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		"saraMenu",
		"SARA menu",
		vscode.ViewColumn.Two,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(path.join(__dirname, "../"), 'public'))]
		}
	);

	panel.webview.onDidReceiveMessage(
		async message => {
			switch(message.command) {
			case 'location':
				message.text === "Local" ? await localRepo.analyzeLocal() : await remoteRepo.analyzeRemote();
				panel.dispose();
				return;
			}
			},
		undefined,
		context.subscriptions
	);
	
	// const extensionUri = vscode.Uri.file(path.join(__dirname, "../"));
	panel.webview.html = getTemplate("menu", panel.webview, __dirname);
}

// This method is called when your extension is deactivated
export function deactivate() {}
