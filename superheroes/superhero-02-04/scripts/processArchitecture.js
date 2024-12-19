const path = require('path');
const fsPromises = require('fs/promises');
const dotenv = require('dotenv');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager'); // Google Cloud Secret Manager SDK
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { GoogleGenerativeAIFetchError } = require('@google/generative-ai');

// Function to access the secret
async function accessSecret(projectId, secretId) {
    try {
        const client = new SecretManagerServiceClient();
        const secretVersionName = `projects/150699885662/secrets/superhero-02-04-secret2/versions/1`;
        const [version] = await client.accessSecretVersion({ name: secretVersionName });
        const secretPayload = version.payload.data.toString('utf8');
        console.log("Successfully accessed secret.");
        console.log("Secret payload:", secretPayload);
        return secretPayload;
    } catch (error) {
        console.error(`Error accessing secret: ${error.message}`);
        // Fallback for local development, trying to read credentials from environment variables
        if (process.env.PRIVATE_KEY) {
            console.log("Using PRIVATE_KEY from environment variables as a fallback.");
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

// Process architecture-related content
async function processArchitecture(inputData) {
    const tempFileFolderPath = "./temp/";
    const combinedFilePath = path.join(tempFileFolderPath, 'combined.txt');

    try {
        // Initialize the Generative AI client
        const genAI = await setupGenerativeAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const commitsContent = inputData.commits.text;

        let docsContent = "";
        inputData.docs.forEach((element) => {
            docsContent += element.content;
        });

        const combinedContent = `${docsContent}\n\n${commitsContent}`;

        // Save the combined content to a temporary file
        await fsPromises.mkdir(tempFileFolderPath, { recursive: true }); // Make dir if it doesn't exist
        await fsPromises.writeFile(combinedFilePath, combinedContent, 'utf-8');

        const uploadResult = await new GoogleAIFileManager(genAI.apiKey).uploadFile(
            combinedFilePath, {
                mimeType: "text/plain",
                displayName: "Documentation and Commits",
            }
        );
        console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

        const result = await model.generateContent([
            "I'm a software architecture specialist working on an application. I would like to infer the most probable software design pattern used in the following codebase based on its documentation and commit logs contained in the following text files. Please provide a detailed analysis, including the following sections: \
            1. **Pattern Key Characteristics**: Describe the main characteristics of the inferred design pattern.\
            2. **Key Indicators**: Highlight any specific signs or coding structures that suggest this design pattern.\
            3. **Supporting Evidence**: Provide specific proof from the provided documentation and commit logs, including highlighted direct quotes and references to relevant sections in the text files.\
            4. **Advantages and Disadvantages**: Discuss potential advantages and disadvantages of using this pattern in the given context.",
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            }
        ]);

        console.log("Generated architecture analysis:", result);

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
            await fsPromises.rm(combinedFilePath); // Delete temp combined.txt file
        } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
        }
    }
}

module.exports = { processArchitecture };
