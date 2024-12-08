// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as dotenv from "dotenv";

import * as localRepo from "./local-repo";
import * as remoteRepo from "./remote-repo";
import { getTemplate } from "../../utils/vscode";
import { getModels } from "./groq";

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
      const llm = message.llm;
      message.location === "local" ? await localRepo.analyzeLocal(llm) : await remoteRepo.analyzeRemote(llm);
      panel.dispose();
      return;
    },
    undefined,
    context.subscriptions
  );
  
  const models = await getModels();
  const html = getTemplate("menu.html", panel.webview, __dirname);
  panel.webview.html = html.replace('<div id="substitute-with-options"></div>', models);
}

// This method is called when your extension is deactivated
export function deactivate() { }
