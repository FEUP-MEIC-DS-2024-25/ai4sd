import { fetchCommitLogsFromWorkspace } from './fetchCommitLogs';
import * as vscode from 'vscode';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs-extra';
import axios from 'axios';
import FormData from 'form-data';

// list of common directories/files to exclude in sent files
const EXCLUDE_LIST = ['node_modules', '.git', 'dist', 'build'];

export async function processArchitecture( mode: string ): Promise<string> {
    
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace is open. Please open a workspace first.");
        throw new Error("No workspace is open. Please open a workspace first.");
    }

    if (mode === "both"){}
    else if (mode === "commits"){}
    else if (mode === "documentation"){}
    const workspacePath = workspaceFolder.uri.fsPath;
    const inputWorkspacePath = path.join(workspacePath, 'docs'); // temporarily only includes docs
    const docsWorkspacePath = path.join(workspacePath, 'docs');
    const commitLogsFileName = 'commits.txt';
    const outputZipFilePath = path.join(workspacePath, 'workspace.zip');

    try {

        // generate logs file in docs folder
        await fetchCommitLogsFromWorkspace(docsWorkspacePath, commitLogsFileName);

        //create zip of project files (with commit logs included)
        await zipDirectory(inputWorkspacePath, outputZipFilePath);

        //send zip to backend
        const response = await sendZipToBackend(outputZipFilePath);

        return response;

    } catch (error) {
        console.error("Error while generating markdown content:", error);
        throw new Error("Failed to generate architecture analysis");

    } finally {
        try {
            // delete temporary file created (commits.txt)
            await fs.unlink(path.join(docsWorkspacePath, commitLogsFileName)); 
        }
        catch (error) {
            console.error("Error during cleanup: ", error)
        }
    }
}

/**
 * zip files and subfolders in directory and output to path
 */
async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);

        archive.pipe(output);

        filterFilesToZip(sourceDir, archive);

        archive.finalize();
    });
}

// add files to zip, excluding files from EXCLUDE_LIST, recursively 
function filterFilesToZip(directory: string, archive: archiver.Archiver, baseDir: string = '') {
    const files = fs.readdirSync(directory);

    files.forEach((file: string) => {
        const fullPath = path.join(directory, file);
        const relativePath = path.join(baseDir, file);

        if (EXCLUDE_LIST.some(exclude => fullPath.includes(exclude))) {
            console.log(`Skipping ${fullPath} (excluded by .gitignore or EXCLUDE_LIST)`);
            return;
        }

        const stat = fs.lstatSync(fullPath);
        
        if (stat.isDirectory()) {
            // recurse into subdirectories
            filterFilesToZip(fullPath, archive, relativePath);
        } else {
            // add file to zip archive
            archive.file(fullPath, { name: relativePath });
        }
    });
}

//send zip in filepath to backend
async function sendZipToBackend(zipFilePath: string): Promise<string> {

    const formData = new FormData();
    formData.append('workspaceZip', fs.createReadStream(zipFilePath) as any);

    const response = await axios.post('http://localhost:7777/query', formData, {
        headers: formData.getHeaders(),
    });

    // remove created zip after sending
    await fs.unlink(zipFilePath);

    return response.data.output;
}
