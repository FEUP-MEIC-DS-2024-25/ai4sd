import { fetchCommitLogsFromWorkspace } from './fetchCommitLogs';
import * as vscode from 'vscode';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs-extra';
import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime-types';
// list of common directories/files to exclude in sent files
const EXCLUDE_LIST = ['node_modules', '.git', 'dist', 'build', 'logs', 'coverage', 'temp', 'out'];
const supportedMimeTypes = [
    "text/plain", // Plain text files (.txt)
    "text/markdown", // Markdown files (.md)
    "application/pdf", // pdf documents
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // word docs (.docx)
    "text/html", // html files
    "application/rtf", // rich text (.rtf)
];
export async function processArchitecture(includeCommits, includeDocumentation, language) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace is open. Please open a workspace first.");
        throw new Error("No workspace is open. Please open a workspace first.");
    }
    const workspacePath = workspaceFolder.uri.fsPath;
    const inputWorkspacePath = path.join(workspacePath);
    const commitLogsFileWorkspacePath = path.join(workspacePath, 'commits_log', 'commits.txt');
    const outputZipFilePath = path.join(workspacePath, 'workspace.zip');
    try {
        console.log("include commits", includeCommits, "include documentation", includeDocumentation);
        // generate logs file in docs folder
        if (includeCommits) {
            await fetchCommitLogsFromWorkspace(commitLogsFileWorkspacePath);
        }
        //create zip of project files
        await zipDirectory(inputWorkspacePath, outputZipFilePath, includeDocumentation, commitLogsFileWorkspacePath);
        //send zip to backend
        const response = await sendZipToBackend(outputZipFilePath, language);
        return response;
    }
    catch (error) {
        console.error("Error while generating markdown content:", error);
        throw new Error("Failed to generate architecture analysis");
    }
    finally {
        try {
            // delete temporary file created (commits.txt)
            if (includeCommits) {
                await fs.unlink(commitLogsFileWorkspacePath);
                await fs.rmdir(path.dirname(commitLogsFileWorkspacePath));
            }
        }
        catch (error) {
            console.error("Error during cleanup: ", error);
        }
    }
}
/**
 * zip files and subfolders in directory and output to path
 */
async function zipDirectory(sourceDir, outPath, includeDocumentation, commitsFilePath) {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    return new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        if (!includeDocumentation) { // if not to include other documentation in zip
            if (fs.existsSync(commitsFilePath)) {
                archive.file(commitsFilePath, { name: path.basename(commitsFilePath) }); // only include commits file
            }
            else {
                console.error(`Commits file not found: ${commitsFilePath}`);
            }
        }
        else {
            // include all documentation
            filterFilesToZip(sourceDir, archive);
        }
        archive.finalize();
    });
}
// add files to zip, excluding files from EXCLUDE_LIST, recursively 
function filterFilesToZip(directory, archive, baseDir = '') {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
        const fullPath = path.join(directory, file);
        const relativePath = path.join(baseDir, file);
        if (EXCLUDE_LIST.some(exclude => fullPath.includes(exclude))) {
            console.log(`Skipping ${fullPath} (excluded by EXCLUDE_LIST)`);
            return;
        }
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            // recurse into subdirectories
            filterFilesToZip(fullPath, archive, relativePath);
        }
        else {
            const mimeType = mime.lookup(fullPath) || "";
            // add file to zip archive if MIME type is supported
            if (supportedMimeTypes.includes(mimeType)) {
                archive.file(fullPath, { name: relativePath });
            }
            else {
                // console.log(`Skipping ${fullPath} (unsupported MIME type: ${mimeType})`);
            }
        }
    });
}
//send zip in filepath to backend
async function sendZipToBackend(zipFilePath, language) {
    const formData = new FormData();
    formData.append('language', language);
    formData.append('workspaceZip', fs.createReadStream(zipFilePath));
    try {
        const response = await axios.post('http://localhost:8080/query', formData, {
            headers: formData.getHeaders(),
        });
        return response.data.output;
    }
    catch (error) {
        console.error("Error sending zipped directory to backend", error);
        throw new Error("Error communicating with backend");
    }
    finally {
        try {
            // remove created temp zip after sending
            await fs.unlink(zipFilePath);
        }
        catch (error) {
            console.error("Error during cleanup: ", error);
        }
    }
}
