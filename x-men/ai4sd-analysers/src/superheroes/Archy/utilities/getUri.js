import { Uri } from "vscode";
// get a webview URI that points to the out/webview.js
export function getUri(webview, extensionUri, pathList) {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}
