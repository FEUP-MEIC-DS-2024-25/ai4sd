import { Uri, Webview } from "vscode";
import * as path from 'path';

// get a webview URI that points to the out/webview.js
export function getUri(webview: Webview, extensionUri: Uri, pathParts: string[]): Uri {
  const filePath = path.join(extensionUri.fsPath, ...pathParts);
  return webview.asWebviewUri(Uri.file(filePath));
}