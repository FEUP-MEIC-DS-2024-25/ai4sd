import * as vscode from "vscode";
import { IssuesListProvider } from "./issuesList";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
        "samView",
        new IssuesListProvider(context.extensionUri)
    )
  );
}

export function deactivate() {}