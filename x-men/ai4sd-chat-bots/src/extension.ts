// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export interface AI4SDMenuOption extends vscode.QuickPickItem {
	execute: Function
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ai4sd-chat-bots" is now active!');

	const options: AI4SDMenuOption[] = [
	  ];

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('ai4sd-chat-bots.call', async () => {
		// The code you place here will be executed every time your command is executed
	  
		  // Show dropdown and await user's choice
		  const selectedOption = await vscode.window.showQuickPick(options, {
			placeHolder: "Select a superhero",
			canPickMany: false
		  });
	  
		  // Import and execute different superheros based on selection
		  if (selectedOption) {
			selectedOption.execute(context);
		  } else {
			vscode.window.showInformationMessage("No option selected");
		  }
	});

	const wakeUp = vscode.commands.registerCommand('ai4sd-chat-bots.wakeup', () => {});

	const api = {
		register(newOption: AI4SDMenuOption) {
			options.push(newOption);
		}
	};

	context.subscriptions.push(disposable);
	context.subscriptions.push(wakeUp);
	vscode.commands.executeCommand('ai4sd-chat-bots.wakeup');
	return api;
}

// This method is called when your extension is deactivated
export function deactivate() {}
