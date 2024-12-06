const promptService = require('../services/geminiService');
const { GoogleAICacheManager } = require('@google/generative-ai/server');

// Initialize a cache manager instance
const cacheManager = new GoogleAICacheManager();

// Create a simple in-memory cache to store context
let contextCache = {
    requirements_engineering: "You are an AI assisting in Requirements Engineering for Software Development." +
                              "You're job is to help the user generate a list of key points for a project."
};

exports.sendPrompt = async (req, res) => {
    try {
        const prompt = req.body.text;
        console.log('Prompt:', prompt);

        if (!prompt) { 
            throw new Error('Please provide a prompt.');
        }

        // Retrieve existing context or initialize it
        let existingContext = contextCache['requirements_engineering'];

        // Construct a full prompt with context
        const prePrompt = existingContext + " Provide a list of key points for the following project" +
        "or expand on the rest of the conversation if that's what's asked: ";
        const requirementsPrompt = prePrompt + prompt;

        // Send the prompt to Gemini
        const result = await promptService.sendPrompt(requirementsPrompt);

        // Update the context with the current prompt and response
        contextCache['requirements_engineering'] += ` Prompt: ${prompt} Response: ${result}`;

        res.json(result); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
