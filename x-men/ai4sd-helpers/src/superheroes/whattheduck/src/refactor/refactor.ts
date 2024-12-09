import * as vscode from 'vscode';
import { MyProvider } from './provider';

export async function refactor(filters: string[]) {
    if (filters.length === 0) {
        vscode.window.showErrorMessage('No filters selected.');
        return;
    }

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const document = editor.document;
    const code = document.getText();

    const progressMsgs = [
        'Floating through a bath of refactorings... hold tight!',
        "Loading... waddling as fast as we can!",
        "Bubbling up your results... almost there!",
        "Patience is floating! Just a few more bubbles...",
    ]
    const progressMsg = progressMsgs[Math.floor(Math.random() * progressMsgs.length)];

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: progressMsg,
            cancellable: false
        },
        async () => {
            let newText: string | null = null;
            try {
                newText = await fetchRefactorResponse(code, filters);
            } catch (error) {
                vscode.window.showErrorMessage('An error occurred while fetching response.');
                return;
            }
            
            if (!newText) {
                vscode.window.showErrorMessage('No response from backend.');
                return;
            }

            const provider = new MyProvider();
            vscode.workspace.registerTextDocumentContentProvider('refactor', provider);

            const language = editor.document.uri.path.split('.').pop();
            const uri = vscode.Uri.parse(`refactor://authority/refactor.${language}`);
            provider.updateContent(uri, newText);

            await showDiff(editor.document.uri, uri);
            await showQuickPick(editor, newText);
        }
    );
}

async function fetchRefactorResponse(code: string, filters: string[]): Promise<string | null> {
    const response = await fetch('http://superhero-08-01-150699885662.europe-west1.run.app/refactor', {
        method: 'POST',
        body: JSON.stringify({ code: code, filters: filters }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Backend returned error: ${response.statusText}`);
    }

    const result: any = await response.json();
    if (!result.response) {
        return null;
    }

    let newText = result.response;
    newText = newText.split("```")[1];
    newText = newText.split("\n").slice(1).join("\n");
    return newText;
}

async function showDiff(originalUri: vscode.Uri, refactorUri: vscode.Uri) {
    await vscode.commands.executeCommand(
        'vscode.diff',
        originalUri,
        refactorUri,
        'Refactor Preview'
    );
}

async function showQuickPick(editor: vscode.TextEditor, newText: string) {
    const quickPick = vscode.window.showQuickPick(['Accept', 'Reject'], {
        placeHolder: 'Do you want to accept the changes?',
    });

    quickPick.then(async (value) => {
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        if (value === 'Accept') {
            const document = await vscode.workspace.openTextDocument(editor.document.uri);
            const edit = await vscode.window.showTextDocument(document, { preview: false });

            await edit.edit((editBuilder) => {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                editBuilder.replace(fullRange, newText);
            });
        }
    });
}