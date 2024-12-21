import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const enum DiagramTypes {
    SEQUENCE = "Sequence Diagram",
    ACTIVITY = "Activity Diagram"
}


const app = express();
const port = 8080;

app.use(bodyParser.json());
// Read the JSON file
const jsonPath = path.join(__dirname, 'strings.json');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));


const genAI = new GoogleGenerativeAI("AIzaSyBvZAs-HpqX-u-QJq5S9b0HVpCU8ayWwIE");
const model = genAI.getGenerativeModel({ model: json.model });
const clientChats = new Map<string, [number, any]>();

app.post('/generate', async (req: any, res: any) => {
    const { code, diagramType, clientID } = req.body;
    if (!code || !diagramType || !clientID) {
        return res.status(400).json({ error: json.errorMessages.missingCodeOrDiagramType });
    }
    let clientEntry = clientChats.get(clientID);
    let chat = clientEntry ? clientEntry[1] : null;
    let timeElapsed = Date.now();
    if (!chat) {
        chat = model.startChat();
    }
    clientChats.set(clientID, [timeElapsed, chat]);
    console.log(clientChats);
    let prompt = "";
    switch (diagramType) {
        case DiagramTypes.ACTIVITY:
            prompt += json.activityDiagramPromptGenerator;
            break;
        case DiagramTypes.SEQUENCE:
            prompt += json.sequenceDiagramPromptGenerator;
            break;
        default:
            return res.status(400).json({ error: json.errorMessages.invalidDiagramType });
    }

    prompt += code;

    try {
        const output = await chat.sendMessage(prompt);
        res.json({ text: output.response.text() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/chat', async (req: any, res: any) => {
    const { action, clientID } = req.body;
    let clientEntry = clientChats.get(clientID);
    let chat = clientEntry ? clientEntry[1] : null;
    let timeElapsed = Date.now();

    if (!action || !clientID) {
        return res.status(400).json({ error: json.errorMessages.missingActionOrClientID });
    }
    if (!chat) {
        return res.status(400).json({ error: json.errorMessages.missingChatObject });
    }

    clientChats.set(clientID, [timeElapsed, chat]);

    console.log(clientChats);

    let prompt = "";

    prompt += json.ChatDiagramPrompt;

    prompt += "\n but ";
    prompt += action;
    try {
        const output = await chat.sendMessage(prompt);
        res.json({ text: output.response.text() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Periodic cleaning of the clientChats map
const minuteRange = 30; // If time elapsed since last request for each client is more than this value, the chat object is deleted
const checkInterval = 30; // interval in minutes for checking
function periodicCleaning() {
    clientChats.forEach((value, key) => {
        if (Date.now() - value[0] > minuteRange * 60 * 1000) {
            clientChats.delete(key);
        }
    });
    console.log(clientChats);
}
setInterval(periodicCleaning, checkInterval * 60 * 1000);
