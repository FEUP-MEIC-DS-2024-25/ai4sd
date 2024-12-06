import { config } from "../config.js"
import fs from "fs";
import path from "path";
import axios from "axios";

/**
 * Saves content to a file in the specified directory.
 * @param {Buffer|string} content - The content to write to the file.
 * @param {string} filename - The name of the file to save.
 * @param {string} outputDir - The directory where the file will be saved.
 * @param {boolean} [isBinary=false] - Whether the content is binary.
 */
export function saveFile(content, filename, outputDir, isBinary = false) {
    const filePath = path.join(outputDir, filename);

    if (isBinary) {
        // Write binary content directly
        fs.writeFileSync(filePath, content);
    } else {
        // Write text content
        fs.writeFileSync(filePath, content, 'utf-8');
    }

    console.log(`Saved file: ${filePath}`);
}

/**
 * Ensures the download directory exists, creating it if necessary.
 */
export function ensureDownloadDir() {
    if (!fs.existsSync(config.downloadDir)) {
        fs.mkdirSync(config.downloadDir);
    }
}

/**
 * Downloads a file from the specified URL.
 * @param {string} url - The URL of the file to download.
 * @returns {Promise<{content: Buffer|string, isBinary: boolean}>} - An object containing the file content and whether it is binary.
 */
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

/**
 * Downloads a list of files and optionally saves them to the file system.
 * @param {Array} files - An array of file objects containing the download URL and other metadata.
 * @param {boolean} [save_to_fs=false] - Whether to save the files to the file system.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects with file metadata and content.
 * @returns {string} returns[].name - The name of the downloaded file.
 * @returns {string} returns[].path - The path of the downloaded file.
 * @returns {Buffer|string} returns[].content - The content of the downloaded file (binary or text).
 * @returns {boolean} returns[].isBinary - A flag indicating whether the content is binary.
 */
export async function downloadFiles(files, save_to_fs = false) {
    let result = []
    for (const file of files) {
        try {
            const response = await downloadFile(file.download_url);
            result.push({ name: file.name, path: file.path, content: response.content, isBinary: response.isBinary });
            if (save_to_fs) { ensureDownloadDir(); saveFile(response.content, file.name, config.downloadDir, response.isBinary); }
        } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error.message);
            throw error; // Rethrow to handle at higher level
        }
    }
    return result;
}