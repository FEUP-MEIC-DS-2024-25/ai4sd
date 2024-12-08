import { config } from "../config.js"
import fs from "fs";
import path from "path";

export function saveFile(content, filename, outputDir) {
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`Saved file: ${filePath}`);
}

/**
 * Reads the contents of a file at the specified path and returns it as a string.
 * 
 * @param {string} filePath - The path to the file to be read.
 * @returns {Promise<string>} A promise that resolves to the file's contents as a UTF-8 string.
 * @throws {Error} If the file cannot be read, the error is logged and re-thrown for further handling.
 * 
 **/
export async function readFileContents(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

export function ensureDownloadDir() {
    if (!fs.existsSync(config.downloadDir)) {
        fs.mkdirSync(config.downloadDir);
    }
}