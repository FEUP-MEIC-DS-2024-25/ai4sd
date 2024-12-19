const path = require('path');
const fsPromises = require('fs/promises');
const dotenv = require('dotenv');
const { parseInputFiles } = require('./parseInputFiles');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { GoogleGenerativeAIFetchError } = require('@google/generative-ai');

// Function to access the secret
async function accessSecret(projectId, secretId) {
    try {
        console.log("Accessing secret...");
        const client = new SecretManagerServiceClient();
        
        const secretVersionName = `projects/150699885662/secrets/superhero-02-04-secret2/versions/1`;        
        const [version] = await client.accessSecretVersion({ name: secretVersionName });
        console.log(version.payload.data.toString('utf8'));
        const secretPayload = version.payload.data.toString('utf8');
        console.log("Successfully accessed secret.");
        return secretPayload;
    } catch (error) {
        console.error(`Error accessing secret: ${error.message}`);
        // Fallback for local development
        if (process.env.PRIVATE_KEY) {
            console.log("Using PRIVATE_KEY from environment variables as a fallback.");
            if (!process.env.PRIVATE_KEY.trim()) {
                throw new Error("PRIVATE_KEY is empty or undefined.");
            }
            return process.env.PRIVATE_KEY;
        }
        throw new Error("No valid API key found.");
    }
}

// Fetch the API key using the accessSecret function
async function setupGenerativeAI() {
    const projectId = 'hero-alliance-feup-ds-24-25';
    const secretId = 'superhero-02-04';
    const apiKey = await accessSecret(projectId, secretId);
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
}

async function processArchitecture(zipFilePath, extractDir, language) {
    try {
        // Initialize the Generative AI client
        const genAI = await setupGenerativeAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const fileManager = new GoogleAIFileManager(genAI.apiKey);

        const files = await parseInputFiles(zipFilePath, extractDir); // get list of files sent from client

        let uploadedFiles = [];
        let uploadedFilePaths = [];
        
        // Upload files to the AI platform
        for (const file of files) {
            const uploadResult = await fileManager.uploadFile(file.path, {
                mimeType: file.mimeType,
                displayName: file.displayName,
            });
            uploadedFiles.push({
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            });
            uploadedFilePaths.push(file.orig_path);
        }

        const prompt = [
            "I am analyzing a software system and need to infer its architectural design pattern. I provide you some files related to documentation and/or commit logs of the system, which should help the analysis:",
            ...uploadedFiles.map(
                (file, index) =>
                    `${index + 1}. <<${uploadedFilePaths[index]}>> (${file.fileData.mimeType}): ${file.fileData.fileUri}`
            ),
            "Please analyze these files collectively and provide me a detailed analysis, including the following sections:",
            "1. **Pattern Key Characteristics**: Describe the main characteristics of the inferred design pattern.",
            "2. **Key Indicators**: Highlight any specific signs or coding structures that suggest this design pattern.",
            "3. **Supporting Evidence**: Provide specific proof from the provided documentation and commit logs, including highlighted direct quotes and references to relevant sections in the text files, next to the name of the referenced file name (provided above). If the referenced file is commits.txt, don't directly include its name in the answer.",
            "4. **Advantages and Disadvantages**: Discuss potential advantages and disadvantages of using this pattern in the given context.",
            `Give me the result in a markdown format and in ${language}.`,
        ].join("\n");

        const result = await model.generateContent([prompt, ...uploadedFiles]);
        return result.response.text();

    } catch (error) {
        if (error instanceof GoogleGenerativeAIFetchError) {
            console.error(`Google Generative AI Fetch Error: ${error.message}`);
            console.error(`Status: ${error.status}`);
            console.error(`Details: ${error.errorDetails || 'No additional details provided'}`);
        } else {
            console.error("Error while generating markdown content:", error);
        }
        throw new Error("Failed to generate architecture analysis");
    } finally {
        try {
            const items = await fsPromises.readdir(extractDir);
            for (const item of items) {
                const itemPath = path.join(extractDir, item);
                await fsPromises.rm(itemPath, { recursive: true, force: true });
            }
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }
    }
}

module.exports = { processArchitecture };
