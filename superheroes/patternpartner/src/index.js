/** 
 * 
 * 
 * OLD PROTOTYPE SETUP
 * 
 * 
 * 
 * 
*/

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Use the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

// Store the conversation history
let conversationHistory = [];







/**
 * EVERY STRING SHOULD NOT BE SPECIFIED HERE.
 * ALL STRINGS SHOULD BE EXTERNALIZED INTO FILES.
 * YOU CAN CREATE A FOLDER NAMED "strings" OR SIMILAR.
 * THERE SHOULD BE A FILE READER INITIALIZED BEFORE ALL ELSE IN THE APP.
 * EACH DIFFERENT FILE WILL NEED TO HAVE A FILE READER (or file reader config) ASSOCIATED WITH IT.
 * 
 * ALL CURRENT STRINGS SHOULD BE REPLACED WITH THE INFORMATION FROM THIS FILE READER
 */

// Get "strings.json" file
const strings_path = require('path');
const strings_file = require(strings_path.join(__dirname, '..', 'strings', 'strings.json'));




// Set up the URL to comunicate with Gemini
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

// Maximum character limit for the conversation history
const MAX_HISTORY_LENGTH = 3000;

// For debug purposes only
app.get('/', (req, res) => {
    //res.send('Backend is running');
    res.send(strings_file.debug.backend_running);
});


// Add a message to the conversation history and truncate if necessary
const addToConversationHistory = (message) => {
	conversationHistory.push(message);
	conversationHistory.push("<br>");

    // Calculate total characters in the conversation
    const totalLength = conversationHistory.reduce((acc, msg) => acc + msg.length, 0);

    // Remove oldest messages if total exceeds the max length
    while (totalLength > MAX_HISTORY_LENGTH) {
        conversationHistory.shift();
    }
};


// Send the initial context to the conversation history

const initializeConversation = () => {
    const initialContextMessage =
        //"This is your initial context: you are going to help a team that is in the field of software engineering. All following prompts have to take this into account.";
        strings_file.initialContext;

    if (!initialContextMessage) {
        //console.error('Initial context message is missing or undefined.');
        console.error(strings_file.error_messages.initial_context_missing);
        process.exit(1); // Exit if the required string is missing
    }

    addToConversationHistory(initialContextMessage);
};


// Initialize the conversation on server start
initializeConversation();


/**
 * Source of the idea applied into code: https://aistudio.google.com/app/apikey
 * Retry logic with exponential delay backoff
 * 
curl \
-H "Content-Type: application/json" \
-d "{\"contents\":[{\"parts\":[{\"text\":\"Explain how AI works\"}]}]}" \
-X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY"
 * 
 *
 */
const retryGenerateContent = async (prompt, retries = 3, delay = 2000, isFirstCall = true) => {
    if (isFirstCall) {
        // Add the user prompt to the conversation history only on the first call
        addToConversationHistory(prompt);
    }

    // Prepare the body with the entire conversation history
    const body = {
        contents: conversationHistory.map((message, index) => {
            if (index === 0) {
                // First message (initial context) is always from the "user"
                return {
                    //role: "user",
                    role: strings_file.roles.user,
                    parts: [{ text: message }],
                };
            }
            // Alternate roles after the initial message
            return {
                //role: index % 2 === 1 ? "user" : "model", // User's prompts are odd-indexed; model's responses are even-indexed
                role: index % 2 === 1 ? strings_file.roles.user : strings_file.roles.model,
                parts: [{ text: message }],
            };
        }),
    };

	// Log the body for debugging
	//console.log('Sending request body to Gemini API:', JSON.stringify(body, null, 2));
    console.log(strings_file.debug.send_request, JSON.stringify(body, null, 2));


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            //throw new Error(errorData.error?.message || 'Unknown error');
            throw new Error(errorData.error?.message || strings_file.error_messages.unknown_error);
        }

        const data = await response.json();
        const generatedText =
            //data.candidates[0]?.content?.parts[0]?.text || 'No content generated';
            data.candidates[0]?.content?.parts[0]?.text || strings_file.error_messages.no_content_generated;

        // Add Gemini's response to the conversation history
        addToConversationHistory(generatedText);

        return conversationHistory;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... Attempts left: ${retries}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
			// Pass `false` to prevent re-adding the prompt
            return retryGenerateContent(prompt, retries - 1, delay * 2, false);
        }
        throw error;
    }
};


app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        //return res.status(400).json({ error: 'Prompt is required' });
        return res.status(400).json({ error: strings_file.error_messages.missing_prompt });
    }

    try {
		/*
        const generatedText = await retryGenerateContent(prompt);
        // Send the entire conversation history for verification

        res.json({ generatedText });
		*/
		const generatedText = await retryGenerateContent(prompt);

        // Properly join the conversation history without commas
        const formattedText = generatedText.join(''); // No commas, just concatenate all elements

        // Send the formatted text back
        res.json({ generatedText: formattedText });
    } catch (error) {
        //console.error('Error generating content:', error);
        console.error(strings_file.error_messages.error_generating_content, error);

        const errorMessage =
            error?.status === 503
                //? 'The AI model is currently unavailable due to high demand. Please try again in a few minutes.'
                ? strings_file.error_messages.service_unavailable
                : error.message || 'An unknown error occurred while generating content.';

        res.status(error?.status || 500).json({
            error: errorMessage,
        });
    }
});


app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
