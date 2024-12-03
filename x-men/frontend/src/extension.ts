// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ai4sd" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('ai4sd.ai4sd', async () => {
		// The code you place here will be executed every time your command is executed
		
		const options: vscode.QuickPickItem[] = [
			{ label: "SARA", description: "Executes SARA superhero" },
			{ label: "Template", description: "Executes Template superhero" },
		  ];
	  
		  // Show dropdown and await user's choice
		  const selectedOption = await vscode.window.showQuickPick(options, {
			placeHolder: "Select a superhero",
			canPickMany: false
		  });
	  
		  // Import and execute different superheros based on selection
		  if (selectedOption) {
			switch (selectedOption.label) {
			  case "SARA":
				// Import and execute SARA
				(await import('./superheroes/SARA/SARA.js')).execute(context);
				break;
			  case "Template":
				// Import and execute Template
				(await import('./superheroes/Template.js')).execute();
				break;
			  default:
				vscode.window.showWarningMessage("Unknown option selected");
			}
		  } else {
			vscode.window.showInformationMessage("No option selected");
		  }
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
