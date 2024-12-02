import * as vscode from "vscode";
import * as http from "http";
import * as fs from "fs";
import { json } from "stream/consumers";

export function getRootWorkspaceFolderPath(): string | null {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return null;
  }

  return workspaceFolders[0].uri.fsPath;
}

export function showError(prefix: string, error: unknown): void {
  if (error instanceof Error) {
    vscode.window.showErrorMessage(`${prefix} Error: ${error.message}`);
  } else {
    vscode.window.showErrorMessage(`${prefix} Error: ${String(error)}`);
  }
}

export function writeToFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    showError("Writing to File", error);
  }
}

export async function fetchJsonData(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";

        if (res.statusCode !== 200) {
            reject(new Error(`Request to SARA API failed with status ${res.statusCode}: ${res.statusMessage}}`));
            res.resume(); // Consume the response data to free up memory
            return;
          }

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            showError("Parsing Data", error);
          }
        });
      })
      .on("error", (err) => {
        reject(new Error(`Error fetching from the URL: ${err.message}`));
      });
  });
}
