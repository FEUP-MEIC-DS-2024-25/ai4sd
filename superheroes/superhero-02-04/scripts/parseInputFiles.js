const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const unzipper = require('unzipper');
const mime = require('mime-types');

const pdfjsLib = require('pdfjs-dist'); // parse pdfs to plain text
const mammoth = require('mammoth'); // parse word docs to plain text
const { htmlToText } = require('html-to-text'); // parse html to text
const pptx2json = require('pptx2json'); // parse powerpoint files
const parseRTF = require('rtf-parser'); // parse rtf files

const supportedMimeTypes = [
    // plain text formats (no parsing needed)
    "text/plain", // Plain text files (.txt)
    "text/markdown", // Markdown files (.md)

    // formats requiring conversion
    "application/pdf", // pdf documents
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // word docs (.docx)
    "text/html", // html files
    // "application/vnd.openxmlformats-officedocument.presentationml.presentation", // powerPoint (.pptx)
    "application/rtf", // rich text (.rtf)
];

const parserDispatchTable = {
    'application/pdf': convertPDFToText,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': convertDocxToText,
    'text/html': convertHTMLToText,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': convertPPTXToText,
    'application/rtf': convertRTFToText
};

const unzip_files_temp_dir = 'unzipped'; // path where to unzip files that came from client
const parsed_files_temp_dir = 'parsed_to_text' // path to temporarily stored files parsed from non plain text formats (pdf, docx, html, etc) to plain text


async function parseInputFiles(zipFilePath, extractDir) {
    try {
        const unzipDirPath = path.join(extractDir, unzip_files_temp_dir);
        const parsedTextDirPath = path.join(extractDir, parsed_files_temp_dir);

        await fsPromises.mkdir(unzipDirPath, { recursive: true });
        await fsPromises.mkdir(parsedTextDirPath, { recursive: true });

        // extract zip file contents to given dir
        await fsPromises.mkdir(unzipDirPath, { recursive: true });
        await new Promise((resolve, reject) => {
            fs.createReadStream(zipFilePath)
                .pipe(unzipper.Extract({ path: unzipDirPath }))
                .on('close', resolve)
                .on('error', reject);
        });

        const fileObjects = await readFilesRecursively(unzipDirPath, parsedTextDirPath); // put all files in array
        return fileObjects

    } catch (error) {
        console.error("Error unzipping data received", error);
        throw new Error("Failed to process received data");
    } finally {
        try {
            await fsPromises.rm(zipFilePath); // delete uploaded zip
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }
    }
}

//process all files in a directory recursively, and return an array of objects with path, mimeType and displayName
async function readFilesRecursively(unzipDirPath, parsedDirPath) {

    const entries = await fsPromises.readdir(unzipDirPath, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {

        let entryPath = path.join(unzipDirPath, entry.name);
        let entryName = entry.name
        let origEntryPath = entryPath

        if (entry.isDirectory()) { // if entry is a directory

            files.push(...await readFilesRecursively(entryPath, parsedDirPath)); // recurse into subdirectories

        } else if (entry.isFile()) { // if entry is a file

            let mimeType = mime.lookup(entryPath) || 'application/octet-stream';

            if (supportedMimeTypes.includes(mimeType)) { // if the file is of a supported type, prepare to send it to LLM

                // if the file is of a type that needs parsing to plain text
                if (mimeType in parserDispatchTable) {
                    const parsedFile = await processFile(entryPath, mimeType, parsedDirPath)
                    origEntryPath = entryPath
                    entryPath = parsedFile.parsedPath
                    entryName = parsedFile.parsedName
                    mimeType = 'text/plain';
                };
            }

            else { // if not supported file type
                console.log(`Skipping unsupported file type: ${mimeType}, in path: ${entryPath}`);
                continue;
            }

            files.push({
                orig_path: origEntryPath, // original path of file, before any specific type parsing
                path: entryPath,
                mimeType: mimeType,
                displayName: entryName
            });
        }
    }
    return files;
}

//Depending on mimeType of file, parse the file to plain text if necessary, and write it in the same path as original file
async function processFile(filePath, mimeType, parsedDirPath) {
    try {
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext); // name of original file
        const dir = path.dirname(filePath); // dir of original file
        const parsedPlainTextFileName = `${baseName}.txt`
        const parsedPlainTextFileDir = path.join(parsedDirPath, ...dir.split(path.sep).slice(2)); // dir to write parsed plain text file
        const txtFilePath = path.join(parsedPlainTextFileDir, parsedPlainTextFileName); // path to write parsed plain text file

        await fsPromises.mkdir(parsedPlainTextFileDir, { recursive: true });

        const plainText = await parserDispatchTable[mimeType](filePath);

        await fsPromises.writeFile(txtFilePath, plainText, 'utf8');

        return {
            'parsedPath': txtFilePath,
            'parsedName': parsedPlainTextFileName
        };

    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

async function convertPDFToText(pdfPath) {
    const data = await pdfjsLib.getDocument(pdfPath).promise;
    let text = '';
    for (let i = 1; i <= data.numPages; i++) {
        const page = await data.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
}

async function convertDocxToText(docxPath) {
    const buffer = await fsPromises.readFile(docxPath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

async function convertHTMLToText(htmlPath) {
    const htmlContent = await fsPromises.readFile(htmlPath, 'utf8');
    return htmlToText(htmlContent, { wordwrap: false });
}

//not currently used
async function convertPPTXToText(filePath) {
    const pptxData = await pptx2json(filePath);

    let text = '';

    pptxData.slides.forEach(slide => {
        // loop through text objects in pptx
        slide.texts.forEach(textObj => {
            text += textObj.text + '\n'; // append text contents to stirng
        });
    });

    return text;
}

async function convertRTFToText(filePath) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        stream.pipe(
            parseRTF((err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const plainText = doc.content
                        .map(paragraph => paragraph.content.map(span => span.value).join(''))
                        .join('\n');
                    resolve(plainText);
                } catch (extractionError) {
                    reject(extractionError);
                }
            })
        );
    });
}

module.exports = { parseInputFiles };