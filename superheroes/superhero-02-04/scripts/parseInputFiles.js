const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const unzipper = require('unzipper');

async function parseInputFiles(zipFilePath, extractDir) {
    try {

       // extract zip file contents to given dir
       await fsPromises.mkdir(extractDir, { recursive: true });
       await new Promise((resolve, reject) => {
           fs.createReadStream(zipFilePath)
               .pipe(unzipper.Extract({ path: extractDir }))
               .on('close', resolve)
               .on('error', reject);
       });

       // read commits file
       const commitsPath = path.join(extractDir, 'commits.txt');
       const commitsText = await fsPromises.readFile(commitsPath, 'utf-8');

       // Read other docs files (if they exist) and concatenate content
       const docsContent = [];
       const files = await fsPromises.readdir(extractDir);
       for (const file of files) {
           if (file !== 'commits.txt') {
               const filePath = path.join(extractDir, file);
               
               const fileContent = await fsPromises.readFile(filePath, 'utf-8');
               docsContent.push({ 
                path: filePath,
                content: fileContent 
               });
           }
       }

       const result = {
            commits: { text: commitsText },
            docs: docsContent
        }

        return result

    } catch (error) {
        console.error("Error while generating markdown content:", error);
        throw new Error("Failed to generate architecture analysis");

    } finally { // cleanup: delete uploaded zip files and "unzipped/" directory
        try {
          await fsPromises.rm(zipFilePath); // delete uploaded zip
          await fsPromises.rm(extractDir, { recursive: true, force: true }); // delete "unzipped/" dir and files
    
        } catch (cleanupError) {
          console.error("Error during cleanup:", cleanupError);
        }
    }
}

module.exports = { parseInputFiles };