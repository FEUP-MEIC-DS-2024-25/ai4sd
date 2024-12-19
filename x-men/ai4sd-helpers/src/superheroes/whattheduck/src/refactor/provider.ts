import * as vscode from 'vscode';

class MyProvider implements vscode.TextDocumentContentProvider {
    private content: string = '';
    private onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
        return this.content;
    }

    updateContent(uri: vscode.Uri, newContent: string) {
        this.content = newContent;
        this.onDidChangeEmitter.fire(uri);
    }
}

export { MyProvider };