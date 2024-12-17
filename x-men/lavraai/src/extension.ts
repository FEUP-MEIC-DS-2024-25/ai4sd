// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import DiagramContext from './DiagramContext';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const enum DiagramTypes {
	SEQUENCE = "Sequence Diagram",
	ACTIVITY = "Activity Diagram"
}

// Read the JSON file from the src directory
const parentDir = path.dirname(path.dirname(__filename));
const srcDir = path.join(parentDir, 'src');
const jsonPath = path.join(srcDir, 'strings.json');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let activeDiagram: string | null = null;
	let dContext: DiagramContext | null = null;
	let diagramType: string | undefined = undefined;

	// Generate or retrieve the client ID
	let clientId = context.globalState.get<string>('clientId');
	if (!clientId) {
		clientId = uuidv4();
		context.globalState.update('clientId', clientId);
	}
	console.log(`Client ID: ${clientId}`);

	vscode.workspace.onDidCloseTextDocument((doc) => {
		vscode.window.showInformationMessage(json.informationMessages.documentClosed);
		if (doc.uri.toString() === dContext?.doc?.uri?.toString()) {
			dContext = null;
		}
	});

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(json.successfullyActivated);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const refreshDisposable = vscode.commands.registerCommand('lavraai.refresh', async () => {
		if (!dContext) {
			vscode.window.showErrorMessage(json.errorMessages.noDiagramOpen);
			return;
		}

		dContext.refreshDiagram(diagramType);
	});

	const disposable = vscode.commands.registerCommand('lavraai.pumlTest', async () => {
		if (dContext) {
			vscode.window.showErrorMessage(json.errorMessages.diagramAlreadyOpen);
			return;
		}

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage(json.errorMessages.notDetectingActiveWindow);
			return;
		}

		const selection = editor.selection;
		let highlighted;
		if (selection && !selection.isEmpty) {
			const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			highlighted = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showErrorMessage(json.errorMessages.emptyTextSelection);
			return;
		}

		diagramType = await vscode.window.showQuickPick([DiagramTypes.ACTIVITY, DiagramTypes.SEQUENCE], {
			placeHolder: json.diagramPlaceholder,
			title: json.diagramTitle,
		});
		if (!diagramType) {
			vscode.window.showErrorMessage(json.errorMessages.invalidDiagramType);
			return;
		}

		vscode.window.showInformationMessage(highlighted);
		vscode.window.showInformationMessage(diagramType);

		try {
			const response = await axios.post(json.generateUrl, {
				code: highlighted,
				diagramType: diagramType,
				clientID: clientId
			});
			const output = response.data.text;
			vscode.workspace.openTextDocument({
				content: output,
				language: json.codeLanguage
			}).then(doc => {
				dContext = new DiagramContext(doc, output, clientId);
				console.log(output);
				vscode.window.showInformationMessage(doc.uri.toString());
				vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside).then(editor => {
					vscode.commands.executeCommand(json.vscodeCommand);
				});
			});
		}
		catch (error: any) {
			vscode.window.showErrorMessage(error.message);
			return;
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(refreshDisposable);

	//CHAT section 
	const handler: vscode.ChatRequestHandler = async (
		request: vscode.ChatRequest,
		context: vscode.ChatContext,
		stream: vscode.ChatResponseStream,
		token: vscode.CancellationToken
	) => {
		// initialize the messages array with the prompt
		const messages: any = [];
		// add in the user's message
		messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
		// send the request
		if (!dContext) {
			vscode.window.showErrorMessage(json.errorMessages.noDiagramOpen);
		}
		else {
			dContext.action = request.prompt;
		}
		console.log(dContext?.src + "chat");
		await dContext!.chatAndRefresh();
		// stream the response
		stream.markdown(json.successfullUpdate);

		return;
	};

	// create participant
	const lavra = vscode.chat.createChatParticipant('lavra-ai', handler);

	// add icon to participant
	lavra.iconPath = vscode.Uri.joinPath(context.extensionUri, 'cat.jpeg');

	context.subscriptions.push(lavra);

	let baseExt = vscode.extensions.getExtension("undefined_publisher.ai4sd-chat-bots");
	if (!baseExt) {
		await vscode.commands.executeCommand("ai4sd-chat-bots.wakeup");
		baseExt = vscode.extensions.getExtension("undefined_publisher.ai4sd-chat-bots");
		if (!baseExt) {
			throw new Error("Base AI4SD extension not found.");
		}
	}

	baseExt.exports.register({label: "LavraAI", description: "Executes LavraAI superhero", execute: () => vscode.commands.executeCommand("lavraai.pumlTest")});
}

// This method is called when your extension is deactivated
export function deactivate() { }
