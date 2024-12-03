import { config } from "../config.js"
import fs from "fs";
import path from "path";

export function saveFile(content, filename, outputDir) {
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`Saved file: ${filePath}`);
}

export function ensureDownloadDir() {
    if (!fs.existsSync(config.downloadDir)) {
        fs.mkdirSync(config.downloadDir);
    }
}

export async function downloadAndSaveFiles(files) {
    for (const file of files) {
        try {
            const fileStream = await downloadFile(file.download_url);
            saveFile(fileStream, file.name, config.downloadDir);
        } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error.message);
            throw error; // Rethrow to handle at higher level
        }
    }
}