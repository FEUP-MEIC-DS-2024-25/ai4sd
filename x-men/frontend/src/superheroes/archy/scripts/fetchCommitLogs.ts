import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function fetchCommitLogsFromWorkspace(workspacePath: string, commitLogsFileName: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    try {
        const { stdout, stderr } = await execPromise(`git log > ${commitLogsFileName}`, { cwd: workspacePath });

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            vscode.window.showErrorMessage(`Git stderr: ${stderr}`);
            return;
        }

        vscode.window.showInformationMessage(`Commit logs have been saved to commits.txt in the workspace.`);
    } catch (error) {
        console.log(`Error: ${(error as Error).message}`);
        vscode.window.showErrorMessage(`Error fetching commit logs: ${(error as Error).message}`);
    }
}