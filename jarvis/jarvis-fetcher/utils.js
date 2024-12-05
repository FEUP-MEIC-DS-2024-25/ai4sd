import { config } from "../config.js"
import fs from "fs";
import path from "path";
import axios from "axios";


export function saveFile(content, filename, outputDir, isBinary = false) {
    const filePath = path.join(outputDir, filename);
    console.log(filePath, isBinary, content)

    if (isBinary) {
        // Write binary content directly
        fs.writeFileSync(filePath, content);
    } else {
        // Write text content
        fs.writeFileSync(filePath, content, 'utf-8');
    }

    console.log(`Saved file: ${filePath}`);
}

export function ensureDownloadDir() {
    if (!fs.existsSync(config.downloadDir)) {
        fs.mkdirSync(config.downloadDir);
    }
}

export async function downloadFile(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer', // Ensure raw binary data
        });

        const contentType = response.headers['content-type'];
        console.log(`Downloaded file with content type: ${contentType}`);

        const isBinary = !contentType.startsWith('text') &&
            !contentType.includes('svg') &&
            !contentType.includes('xml');


        if (isBinary) {
            // Return binary data
            return { content: Buffer.from(response.data), isBinary: true };
        }

        // Return text data
        return { content: Buffer.from(response.data).toString('utf-8'), isBinary: false };
    } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
        throw error;
    }
}

export async function downloadFiles(files, save_to_fs = false) {
    let result = []
    for (const file of files) {
        try {
            const response = await downloadFile(file.download_url);
            result.push({ name: file.name, path: file.path, content: response.content, isBinary: response.isBinary });
            if (save_to_fs) saveFile(response.content, file.name, config.downloadDir, response.isBinary);
        } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error.message);
            throw error; // Rethrow to handle at higher level
        }
    }
    return result;
}