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