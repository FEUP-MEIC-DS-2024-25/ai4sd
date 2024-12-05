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

    const output = upload(input);
}

async function upload(input: string)
{
    const content = { "content": input };

    fetch("http://localhost:8000/online", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        
        //make sure to serialize your JSON body
        body: content
        })
        .then( (response) => { 
            //do something awesome that makes the world a better place
        }
    );
}