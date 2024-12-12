// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { execute } from './SARA/SARA';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sara" is now active!');

	let baseExt = vscode.extensions.getExtension("undefined_publisher.ai4sd-analysers");
	if (!baseExt) {
		await vscode.commands.executeCommand("ai4sd-analysers.wakeup");
		baseExt = vscode.extensions.getExtension("undefined_publisher.ai4sd-analysers");
		if (!baseExt) {
			throw new Error("Base AI4SD extension not found.");
		}
	}

	baseExt.exports.register({label: "SARA", description: "Executes SARA superhero", execute: () => execute(context)});
}

// This method is called when your extension is deactivated
export function deactivate() {}
