import * as vscode from "vscode";
import { getNonce, getUri } from "./utilities";
import parse from "parse-git-config";
import path from "path";

export class IssuesListProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private extensionUri: vscode.Uri;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this.extensionUri = _extensionUri;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    // Configure the webview options
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "out"),
        vscode.Uri.joinPath(this._extensionUri, "webview-ui", "build"),
      ],
    };

    // Set the HTML content for the webview
    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    // Listen for messages from the webview
    this.setWebviewMessageListener(webviewView.webview);
  }

  private getWebviewContent(webview: vscode.Webview): string {
    const stylesUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    const scriptUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);

    const nonce = getNonce();

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" href="${stylesUri}">
          <title>Issues Sidebar</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  private setWebviewMessageListener(webview: vscode.Webview): void {
    webview.onDidReceiveMessage((message) => {
      console.log("received message", message);
      switch (message.command) {
        case "issues": {
          const fetchIssues = async () => {
            if (vscode.workspace.workspaceFolders) {
              const config = parse.sync({
                cwd: vscode.workspace.workspaceFolders[0].uri.fsPath,
                path: ".git/config",
              });
              const regex = /github\.com[:\/]([^\/:]+)\/([^\/:]+?)(\.git)?$/;
              const match = config['remote "origin"']["url"].match(regex);
              let owner = null;
              let repo = null;
              if (match) {
                owner = match[1];
                repo = match[2];
                console.log(owner);
                console.log(repo);
              }
              const apiUrl = `https://superhero-05-05-150699885662.europe-west1.run.app/issues?owner=${owner}&repo=${repo}`;
              try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch issues: ${response.statusText}`
                  );
                }
                const issues = await response.json();
                webview.postMessage([issues, owner, repo]);
              } catch (error) {
                //vscode.window.showErrorMessage("error");
              }
            }
          };
          fetchIssues();
          break;
        }
        case "chatInit": {
          const askSam = async () => {
            const owner = message.data.owner;
            const repo = message.data.repo;
            const number = message.data.issue;
            const apiUrl = `https://superhero-05-05-150699885662.europe-west1.run.app/chat?owner=${owner}&repo=${repo}&issue=${number}`;
            console.log(apiUrl);
            try {
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch issues: ${response.statusText}`
                );
              }
              webview.postMessage(await response.json());
            } catch (error) {
              vscode.window.showErrorMessage("error");
            }
          };
          askSam();
          break;
        }
        case "chat": {
          const askSam = async () => {
            const id = message.data.id;
            const prompt = message.data.message;
            const apiUrl = `https://superhero-05-05-150699885662.europe-west1.run.app/chat/${id}`;
            console.log(apiUrl);
            try {
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: prompt,
                }),
              });
              const text = await response.json();
              console.log(text);
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch issues: ${response.statusText}`
                );
              }
              webview.postMessage(text);
            } catch (error) {
              vscode.window.showErrorMessage("error");
            }
          };
          askSam();
          break;
        }
      }
    });
  }
}
