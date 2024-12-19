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
    var list = {
        "name": "Name2",
        "content": input
      }

    fetch("https://superhero-05-01-150699885662.europe-west1.run.app/online",
    {
        method: "post",
        headers:
        {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        
        //make sure to serialize your JSON body
        body: JSON.stringify({files: [list]}),

        // signal: AbortSignal.timeout(5000)
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

        response.json().then((cont: any) => {
            if (cont.length == 0) return;

            panel.webview.html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Warden AI</title></head><body>';

            for (var c in cont.data)
            {
                const title = cont.data[c].title;
                const description = cont.data[c].description;
                const lines = cont.data[c].lines;
                const fix = cont.data[c].fix;

                var lines_str = ""
                for (var l in lines)
                {
                    lines_str += lines[l].toString();
                }

                panel.webview.html +=   "<div>"
                                            + "Title: " + title + "<br>"
                                            + "Description: " + description + "<br>"
                                            + "Lines: " + lines_str + "<br>"
                                            + "Fix: " + fix + "<br>" +
                                        "</div><br>"
            }

            panel.webview.html += "</body></html>";
        });
    })
    .catch((e) =>
    {
        vscode.window.showErrorMessage("An error has occured");
        console.log(e);
    });
}