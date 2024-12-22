const path = require('path');
const fsPromises = require('fs/promises');
const dotenv = require('dotenv');
const { parseInputFiles } = require('./parseInputFiles');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { GoogleGenerativeAIFetchError } = require('@google/generative-ai');

async function accessSecret(projectId, secretId) {
    try {
        console.log("Accessing secret...");
        
        // Initialize the Secret Manager client
        const client = new SecretManagerServiceClient();

        // Build the secret version name dynamically based on projectId and secretId
        //projects/150699885662/secrets/superhero-02-04-secret
        const secretVersionName = `projects/${projectId}/secrets/${secretId}/versions/latest`;

        // Access the secret version
        const [version] = await client.accessSecretVersion({ name: secretVersionName });

        // Convert secret payload to string (UTF-8 encoding)
        const secretPayload = version.payload.data.toString('utf8');
        
        console.log("Successfully accessed secret.");
        return secretPayload;
    } catch (error) {
        console.error(`Error accessing secret: ${error.message}`);

        // Fallback for local development (using environment variable as fallback)
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.log("Using PRIVATE_KEY from environment variables as a fallback.");
            if (!process.env.GOOGLE_APPLICATION_CREDENTIALS.trim()) {
                throw new Error("PRIVATE_KEY is empty or undefined.");
            }
            return process.env.GOOGLE_APPLICATION_CREDENTIALS;
        }

        // If no fallback is available, throw an error
        throw new Error("No valid API key or private key found.");
    }
}

// Fetch the API key (or secret value) using the accessSecret function
async function setupGenerativeAI() {
    const projectId = '150699885662'; // Make sure this is correct for your project
    const secretId = 'superhero-02-04-secret2'; // This should be the secret you want to access -> secret 2 is for gemini

    // Fetch the secret (API key or other sensitive data)
    const secretPayload = await accessSecret(projectId, secretId);
    
    // Assuming GoogleGenerativeAI takes the secretPayload as a constructor argument
    const genAI = new GoogleGenerativeAI(secretPayload); // Modify according to actual API
    return genAI;
}

// Call setupGenerativeAI function
setupGenerativeAI().then(genAI => {
    // Use the genAI instance for further operations
}).catch(err => {
    console.error("Error in setupGenerativeAI:", err);
});


async function processArchitecture(zipFilePath, extractDir, language) {
    try {
        console.log("Starting the architecture analysis process...");
        
        // Initialize the Generative AI client
        const genAI = await setupGenerativeAI();
        console.log("Generative AI client initialized.");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Gemini model selected: gemini-1.5-flash");

        const fileManager = new GoogleAIFileManager(genAI.apiKey);
        console.log("GoogleAIFileManager initialized.");

        const files = await parseInputFiles(zipFilePath, extractDir); // get list of files sent from client
        console.log(`${files.length} files parsed from zip.`);

        let uploadedFiles = [];
        let uploadedFilePaths = [];

        // Upload files to the AI platform
        console.log("Uploading files to the AI platform...");
        for (const file of files) {
            try {
                console.log(`Uploading file: ${file.displayName}`);
                const uploadResult = await fileManager.uploadFile(file.path, {
                    mimeType: file.mimeType,
                    displayName: file.displayName,
                });
                
                console.log(`File uploaded successfully: ${uploadResult.file.uri}`);
                
                uploadedFiles.push({
                    fileData: {
                        fileUri: uploadResult.file.uri,
                        mimeType: uploadResult.file.mimeType,
                    },
                });
                uploadedFilePaths.push(file.orig_path);
            } catch (uploadError) {
                console.error(`Error uploading file ${file.displayName}:`, uploadError);
                throw new Error("File upload failed.");
            }
        }

        // Prepare prompt for the Generative AI model
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

        console.log("Generated prompt for Gemini: ", prompt);

        // Call Gemini model to generate content
        console.log("Requesting analysis from Gemini...");
        const result = await model.generateContent([prompt, ...uploadedFiles]);

        console.log("Received response from Gemini.");
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
            console.log("Cleaning up extracted files...");
            const items = await fsPromises.readdir(extractDir);
            for (const item of items) {
                const itemPath = path.join(extractDir, item);
                await fsPromises.rm(itemPath, { recursive: true, force: true });
            }
            console.log("Cleanup completed.");
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }
    }
}


module.exports = { processArchitecture };
