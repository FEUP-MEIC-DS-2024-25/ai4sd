const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

/*-------------GET API KEY FORM FIRESTORE-------------*/
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestoreDatabase = admin.firestore();

let API_KEY;

const fetchApiKey = async () => {
    try {
        const doc = await firestoreDatabase.collection('superhero-06-04').doc('secrets').get();
        if (!doc.exists) {
            console.error('No secrets found in Firestore!');
            process.exit(1);
        }
        API_KEY = doc.data().key;
        console.log('API Key loaded successfully.');
    } catch (error) {
        console.error('Error fetching API key from Firestore:', error);
        process.exit(1);
    }
};

// Fetch API Key on server startup
fetchApiKey();
/*----------------------------------------------------*/

//app.use(cors());
//app.use(cors({ origin: 'http://localhost:3000/assistants/patternpartner' }));
app.use(
    cors({
      origin: 'http://localhost:3000', // Base origin
      methods: ['GET', 'POST'], // Add other HTTP methods if needed
    })
  );
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
const path = require('path');
const strings_file = require(path.join(__dirname, '..', 'strings', 'strings.json'));


/* ---------------------------------------- MULTER ---------------------------------------- */
// Multer
const multer = require('multer');
const fs = require('fs');
const readline = require('readline');
/* ---------------------------------------------------------------------------------------- */



// Set up the URL to comunicate with Gemini
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

// Maximum character limit for the conversation history
const MAX_HISTORY_LENGTH = 30000;

// For debug purposes only
app.get('/', (req, res) => {
    //res.send('Backend is running');
    res.send(strings_file.debug.backend_running);
});


// Add a message to the conversation history and truncate if necessary
const addToConversationHistory = (message) => {
	conversationHistory.push(message);
	//conversationHistory.push("<br>");

    // Calculate total characters in the conversation
    const totalLength = conversationHistory.reduce((acc, msg) => acc + msg.length, 0);

    // Remove oldest messages if total exceeds the max length
    while (totalLength > MAX_HISTORY_LENGTH) {
        const removedMsg = conversationHistory.shift();
        totalLength -= removedMsg.length;
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
    //DEBUG
    console.log('Batch ready to be added to Conversation History\n');

    if (isFirstCall) {
        // Add the user prompt to the conversation history only on the first call
        addToConversationHistory(prompt);
    }

    //DEBUG
    console.log('Batch sent to Gemini.\n');

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


/* ---------------------------------------- UPLOAD FILES ---------------------------------------- */
// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/', // Directory to temporarily store uploaded files
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [".txt", ".log", ".csv", ".json"]; // Add allowed formats here
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${ext}`), false);
        }
    },
});

// Ensure the uploads directory exists
const ensureUploadsDirExists = () => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
};

// Function to process a batch
const processBatch = async (batch) => {
    try {
        console.log('Processing batch:', batch);

        // Convert batch to a single prompt for Gemini
        const prompt = batch.join('\n');

        //DEGBUG
        console.log('Prompt created and ready to be sent to Gemini.\n');

        // Send to Gemini
        const response = await retryGenerateContent(prompt);
        console.log('Gemini response for batch:', response);
    } catch (error) {
        console.error('Error in processBatch:', error);
        throw error; // Propagate the error to the caller
    }
};

// Function to process log file
const processLogFile = (filePath, processBatch) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const rl = readline.createInterface({ input: stream });

        let currentBatch = [];
        const batchSize = 20000; // Adjust batch size based on Gemini's capabilities

        rl.on('line', async (line) => {
            currentBatch.push(line);

            if (currentBatch.length >= batchSize) {
                try {
                    await processBatch(currentBatch); // Process the batch
                    currentBatch = []; // Reset the batch
                } catch (err) {
                    rl.close(); // Stop reading
                    reject(err);
                }
            }
        });

        rl.on('close', async () => {
            try {
                if (currentBatch.length > 0) {
                    await processBatch(currentBatch); // Process any remaining lines
                }
                console.log('Finished processing the log file.');
                resolve();
            } catch (err) {
                console.error('Error processing final batch:', err);
                reject(err);
            }
        });

        rl.on('error', (err) => {
            console.error('Error reading the log file:', err);
            reject(err);
        });
    });
};

// File upload route
app.post("/upload-log", upload.array("logfiles", 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
  
      const uploadResults = [];
      for (const file of req.files) {
        const { path: tempPath, originalname } = file;
        const targetPath = path.join(__dirname, "..", "uploads", `${Date.now()}-${originalname}`);
  
        // Move the file
        await fs.promises.rename(tempPath, targetPath);
  
        // Process the file (if needed)
        await processLogFile(targetPath, processBatch);
  
        uploadResults.push({ file: originalname, status: "Processed" });
      }
  
      res.status(200).json({
        message: `${req.files.length} file(s) uploaded and processed successfully`,
        details: uploadResults,
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

/* ---------------------------------------------------------------------------------------------- */


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
