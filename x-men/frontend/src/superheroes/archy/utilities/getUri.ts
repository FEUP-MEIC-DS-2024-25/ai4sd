import { Uri, Webview } from "vscode";

// get a webview URI that points to the out/webview.js
export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}