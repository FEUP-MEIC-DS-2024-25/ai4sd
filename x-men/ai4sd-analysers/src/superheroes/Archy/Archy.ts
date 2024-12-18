// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LeftSidebarPanel } from "./panels/leftSidebarPanel";

export async function execute(context: vscode.ExtensionContext) {

	// register sidebar view provider
	const leftSidebarWebviewProvider = new LeftSidebarPanel(context?.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('leftSidebarPanel', leftSidebarWebviewProvider)
	 );

  }

// This method is called when your extension is deactivated
export function deactivate() {}
