// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LeftSidebarPanel } from "./panels/leftSidebarPanel";

export async function execute(context: vscode.ExtensionContext) {
	
	// Perform Archy's superhero logic here
    console.log("Executing Archy superhero...");


	// register sidebar view provider
	const leftSidebarWebviewProvider = new LeftSidebarPanel(context?.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('archy.leftSidebarPanel', leftSidebarWebviewProvider)
	 );

	// show sidebar when command called
	await vscode.commands.executeCommand('workbench.view.extension.archy');

}

// This method is called when your extension is deactivated
export function deactivate() {}
