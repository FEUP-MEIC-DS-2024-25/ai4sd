import * as fs from 'fs';
import archiver from "archiver";
import path from 'path';
import * as vscode from "vscode";

import * as repoUtils from "../../utils/repo";
import * as utils from "../../utils/utils";
import { getTemplate } from '../../utils/vscode';

export async function analyzeLocal(): Promise<void> {
    const markdownFilePath = path.join(
        __dirname,
        "local_architectural_patterns.md"
    );
    const workspacePath = repoUtils.getRootWorkspaceFolderPath();
    if (workspacePath) {
        zip_local_files(workspacePath);
    }

    const panel = vscode.window.createWebviewPanel('progress','Analyzing Local Repository',vscode.ViewColumn.Two,{});
    const html = getTemplate("progressId", panel.webview, __dirname);
    panel.webview.html = html.replace("Analyzing Repository...", "Analyzing Local Repository...");

    try {
        const jsonData = await sendFile();
        const markdownContent = utils.parseApiMdResponse(jsonData);
        repoUtils.writeToFile(markdownFilePath, markdownContent);
        panel.dispose();
        utils.openMarkdownFile(markdownFilePath);
    } catch (error) {
        utils.showError("Command Execution", error);
    }
}

function zip_local_files(workspacePath: string): void {
    const output = fs.createWriteStream(path.join("/tmp", "sara_local_files.zip"));
    const archive = archiver("zip");

    output.on("close", () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on("error", (error) => {
        throw error;
    });

    archive.pipe(output);

    archive.directory(workspacePath, false);

    archive.finalize();
}

async function sendFile(): Promise<any> {
    if (!fs.existsSync(path.join('/tmp', 'sara_local_files.zip'))) {
        return null;
    }
  
    const zip_file = new Blob([fs.readFileSync(path.join('/tmp', 'sara_local_files.zip'))]);
    const form = new FormData();
  
    form.append('file', zip_file);
  
    return fetch("http://localhost:5432/local", {
        method: "POST",
        body: form
    })
    .then((response) => {
        return response.json();
    });
}
