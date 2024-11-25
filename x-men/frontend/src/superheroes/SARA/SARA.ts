// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as dotenv from "dotenv";

import * as localRepo from "./local-repo";
import * as remoteRepo from "./remote-repo";
import { getTemplate } from "../../utils/vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function execute(context: vscode.ExtensionContext) {
  dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });
  const panel = vscode.window.createWebviewPanel(
    "saraMenu",
    "SARA menu",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(path.join(__dirname, "../../../"), 'public'))]
    }
  );

  panel.webview.onDidReceiveMessage(
    async message => {
      switch(message.command) {
        case 'location':
          message.text === "Local" ? await localRepo.analyzeLocal() : await remoteRepo.analyzeRemote();
          panel.dispose();
          return;
        }
      },
      undefined,
      context.subscriptions
    );
  
  // const extensionUri = vscode.Uri.file(path.join(__dirname, "../../../"));
  panel.webview.html = getTemplate("menu", panel.webview, __dirname);
}

// This method is called when your extension is deactivated
export function deactivate() { }
