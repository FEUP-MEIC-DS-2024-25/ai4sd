import * as fs from 'fs';
import archiver from "archiver";
import path from 'path';
import * as vscode from "vscode";

import * as repoUtils from "../../utils/repo";
import * as utils from "../../utils/utils";
import { getTemplate } from '../../utils/vscode';
import { sendRequest, buildApiUrl } from './utils/request';
import { API_LOCAL_ENDPOINT } from './utils/constants';

export async function analyzeLocal(llm: string): Promise<void> {
    const markdownFilePath = path.join(
        __dirname,
        "local_architectural_patterns.md"
    );
    const workspacePath = repoUtils.getRootWorkspaceFolderPath();
    if (workspacePath) {
        zip_local_files(workspacePath);
    }

    const panel = vscode.window.createWebviewPanel('progress','Analyzing Local Repository',vscode.ViewColumn.Two,{});
    const html = getTemplate("progressId.html", panel.webview, __dirname);
    panel.webview.html = html.replace("Analyzing Repository...", "Analyzing Local Repository...");

    const apiUrl = buildApiUrl(API_LOCAL_ENDPOINT);
    const params = {
        "file": new Blob([fs.readFileSync(path.join('/tmp', 'sara_local_files.zip'))]),
        "llm": llm,
    };

    try {
        const jsonData = await sendRequest(apiUrl, "POST", params);
        const markdownContent = utils.parseApiMdResponse(jsonData);
        repoUtils.writeToFile(markdownFilePath, markdownContent);
        utils.openMarkdownFile(markdownFilePath, true);
    } catch (error) {
        utils.showError("Command Execution", error);
    }
    finally {
        panel.dispose();
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
