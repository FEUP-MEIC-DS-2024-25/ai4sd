import * as vscode from 'vscode';
import axios from 'axios';
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

export default class DiagramContext {
    private doc_: vscode.TextDocument;
    private src_: string;
    private action_: string;
    private clientID_: string;
    constructor(doc: vscode.TextDocument, src: string, clientID: string = "") {
        this.doc_ = doc;
        this.src_ = src;
        this.action_ = "";
        this.clientID_ = clientID;
    }
    public get clientID() {
        return this.clientID_;
    }
    public set clientID(clientID: string) {
        this.clientID_ = clientID;
    }
    public get src() {
        return this.src_;
    }
    public get doc() {
        return this.doc_;
    }
    public set doc(doc: vscode.TextDocument) {
        this.doc_ = doc;
    }
    public set src(src: string) {
        this.src_ = src;
    }
    public get action() {
        return this.action_;
    }
    public set action(action: string) {
        this.action_ = action;
    }
    public async chatAndRefresh() {
        console.log(this.action);
        try {
            const response = await axios.post(json.chatUrl, {
                action: this.src_ + "\n" + this.action,
                clientID: this.clientID_
            });
            const output = response.data.text;
            this.src_ = output;
            const replaceCallback = (editBuilder: vscode.TextEditorEdit) => {
                editBuilder.replace(new vscode.Range(this.doc_.lineAt(0).range.start, this.doc_.lineAt(this.doc_.lineCount - 1).range.end), output);
            };
            const editor = vscode.window.visibleTextEditors.find(
                (editor) => editor.document === this.doc_
            );
            if (editor) {
                editor?.edit(replaceCallback.bind(this));
            }
            else {
                vscode.window.showTextDocument(this.doc_).then(editor => {
                    editor.edit(replaceCallback.bind(this));
                });
            }
        }
        catch (error: any) {
            vscode.window.showErrorMessage(error.message);
            return;
        }

    }
    public async refreshDiagram(diagramType: string | undefined) {
        console.log(diagramType);
        if (!diagramType) {
            vscode.window.showErrorMessage(json.errorMessages.invalidDiagramType);
            return;
        }
        try {

            const response = await axios.post(json.generateUrl, {
                code: this.src_,
                diagramType: (DiagramTypes.ACTIVITY === diagramType) ? DiagramTypes.ACTIVITY : DiagramTypes.SEQUENCE,
                clientID: this.clientID_
            });
            const output = response.data.text;
            this.src_ = output;
            const replaceCallback = (editBuilder: vscode.TextEditorEdit) => {
                editBuilder.replace(new vscode.Range(this.doc_.lineAt(0).range.start, this.doc_.lineAt(this.doc_.lineCount - 1).range.end), output);
            };
            const editor = vscode.window.visibleTextEditors.find(
                (editor) => editor.document === this.doc_
            );
            if (editor) {
                editor?.edit(replaceCallback.bind(this));
            }
            else {
                vscode.window.showTextDocument(this.doc_).then(editor => {
                    editor.edit(replaceCallback.bind(this));
                });
            }
        }
        catch (error: any) {
            vscode.window.showErrorMessage(error.message);
            return;
        }
    }
}