import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';

export async function fetchCommitLogsFromWorkspace(commitLogsFileWorkspacePath: string) {

    const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath
    const commitLogsFileName = path.basename(commitLogsFileWorkspacePath);
    const git : SimpleGit = simpleGit(workspacePath);  // git variable acts as interface to the git repository, instead of running shell commands

    try {
        // fetch git log as a string
        const logSummary = await git.log();

        // just keep the messages from each log to minimize the file size
        const formattedLogs = logSummary.all.map((commit) => `${commit.message}`).join("\n");

        await fs.mkdir(path.dirname(commitLogsFileWorkspacePath), { recursive: true });
        await fs.writeFile(commitLogsFileWorkspacePath, formattedLogs, 'utf-8');
        // console.log(`Commit logs saved to ${commitLogsFileWorkspacePath}`);
        // vscode.window.showInformationMessage(`Commit logs have been saved to commits.txt in the workspace.`);

    } catch (error) {
        console.error(`Error fetching commit logs: ${(error as Error).message}`);
        vscode.window.showErrorMessage(`Error fetching commit logs: ${(error as Error).message}`);
    }
}