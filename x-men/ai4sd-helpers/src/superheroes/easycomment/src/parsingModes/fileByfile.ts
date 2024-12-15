import * as vscode from 'vscode';

export interface CodeComment {
    line: number;
    comment: string;
}
export async function updateComments(textEditor: vscode.TextEditor, comments: CodeComment[]) {
    const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
            margin: '0 0 0 1em',
            textDecoration: 'none',
            color: new vscode.ThemeColor('editorLineNumber.foreground')
        },
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen
    });

    // Clear existing decorations
    textEditor.setDecorations(decorationType, []);

    const decorations: vscode.DecorationOptions[] = [];

    comments.forEach(comment => {
        const lineNumber = comment.line;

        if (lineNumber === -1) {
            console.warn(`Method ${comment.comment.split('\n')[0]} not found in the document.`);
            return;
        }

        const line = textEditor.document.lineAt(lineNumber);
        const range = new vscode.Range(
            new vscode.Position(lineNumber, line.text.length),
            new vscode.Position(lineNumber, line.text.length)
        );

        const decoration: vscode.DecorationOptions = {
            range,
            renderOptions: {
                after: {
                    contentText: ` #${comment.comment}`,
                }
            }
        };

        decorations.push(decoration);
    });

    textEditor.setDecorations(decorationType, decorations);

    const userResponse = await vscode.window.showInformationMessage(
        'Do you want to accept the generated comments?',
        'Accept',
        'Reject'
    );

    if (userResponse === 'Accept') {
        // Write comments to the file
        const edit = new vscode.WorkspaceEdit();
        comments.forEach(comment => {
            const lineNumber = comment.line;
            if (lineNumber !== -1) {
                const line = textEditor.document.lineAt(lineNumber);
                const position = new vscode.Position(lineNumber - 1, line.text.length);
                const indentation = (line.text.match(/^\s*/) ?? [''])[0];
                const indentedComment = comment.comment.split('\n').map(line => `${indentation}${line}`).join('\n');
                edit.insert(textEditor.document.uri, position, '\n' + indentedComment);
            }
        });
        await vscode.workspace.applyEdit(edit);
        await textEditor.document.save();
        vscode.window.showInformationMessage('Comments have been added to the file.');
    } else {
        vscode.window.showInformationMessage('Comments were rejected.');
    }

    textEditor.setDecorations(decorationType, []);
}