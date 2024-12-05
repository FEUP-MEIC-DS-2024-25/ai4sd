import * as vscode from "vscode";

export async function execute()
{
    const editor = vscode.window.activeTextEditor;
    if (!editor)
    {
        vscode.window.showErrorMessage('No file is open');
        return;
    }

    var input;
    const selection = editor.selection;
    if (selection && !selection.isEmpty)
    {
        const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
        input = editor.document.getText(selectionRange);
    }
    else
    {
        input = editor.document.getText()
    }

    warden(input);
}

async function warden(input: string)
{
    const content = { "content": input };

    fetch("http://localhost:8000",
    {
        method: "post",
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        
        //make sure to serialize your JSON body
        body: JSON.stringify(content),

        signal: AbortSignal.timeout(5000)
    })
    .then((response) =>
    { 
        const panel = vscode.window.createWebviewPanel
        (
            'warden_ai', // Identifies the type of the webview. Used internally
            'Warden AI', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );

        panel.webview.html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Warden AI</title></head><body><div>' + response + "</div></body></html>";
    })
    .catch((e) =>
    {
        vscode.window.showErrorMessage("An error has occured");
        console.log(e);
    });
}