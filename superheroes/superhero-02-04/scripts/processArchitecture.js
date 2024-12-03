const path = require('path');
const fsPromises = require('fs/promises');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { GoogleGenerativeAIFetchError } = require('@google/generative-ai');

const privateKey = process.env.GEMINI_API_KEY;

if (!privateKey) {
    console.error("GEMINI key is missing.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(privateKey);
const fileManager = new GoogleAIFileManager(privateKey);


async function processArchitecture(inputData) {
    
    const tempFileFolderPath = "./temp/"
    const combinedFilePath = path.join(tempFileFolderPath, 'combined.txt');

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const commitsContent = inputData.commits.text

        let docsContent = ""
        inputData.docs.forEach((element) => {
            docsContent += element.content
        });

        const combinedContent = `${docsContent}\n\n${commitsContent}`;

        // save the combined content to a temporary file
        await fsPromises.mkdir(tempFileFolderPath, { recursive: true }); // make dir if it doesnt exist

        await fsPromises.writeFile(combinedFilePath, combinedContent, 'utf-8');

        const uploadResult = await fileManager.uploadFile(
            combinedFilePath, {
              mimeType: "text/plain",
              displayName: "Documentation and Commits",
            }   
        );
        console.log(
            `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
        );

        const result = await model.generateContent(
            [
                "I'm a software architecture specialist working on an application. I would like to infer the most probable software design pattern used in the following codebase based on its documentation and commit logs contained in the following text files. Please provide a detailed analysis, including the following sections: \
                1. **Pattern Key Characteristics**: Describe the main characteristics of the inferred design pattern.\
                2. **Key Indicators**: Highlight any specific signs or coding structures that suggest this design pattern.\
                3. **Supporting Evidence**: Provide specific proof from the provided documentation and commit logs, including highlighted direct quotes and references to relevant sections in the text files.\
                4. **Advantages and Disadvantages**: Discuss potential advantages and disadvantages of using this pattern in the given context.",
                {
                    fileData: {
                        fileUri: uploadResult.file.uri,
                        mimeType: uploadResult.file.mimeType,
                    }
                }
            ]);
        
        return result.response.text();  

    } catch (error) {
        if (error instanceof GoogleGenerativeAIFetchError) {
            // Specific error handling for GoogleGenerativeAIFetchError
            console.error(`Google Generative AI Fetch Error: ${error.message}`);
            console.error(`Status: ${error.status}`);
            console.error(`Details: ${error.errorDetails || 'No additional details provided'}`);
        } else {
            console.error("Error while generating markdown content:", error);
        }
        throw new Error("Failed to generate architecture analysis");

    } finally {
        try {
            await fsPromises.rm(combinedFilePath) // delete temp combined.txt file
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }
    }
}

module.exports = { processArchitecture };