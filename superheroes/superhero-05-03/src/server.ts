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
const port = 5000;

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI("AIzaSyD8kleEGvzyFxtx8WOfhsIZSp7VuC1ypRM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const clientChats = new Map<string,any>();

app.post('/generate', async (req: any, res: any) => {
    const { code, diagramType,clientID} = req.body;
    if (!code || !diagramType || !clientID) {
        return res.status(400).json({ error: "All the 'code' and 'diagramType' and 'clientID' are required." });
    }
    let chat:any = clientChats.get(clientID);
    if(!chat){
        chat = model.startChat();
        clientChats.set(clientID,chat);
    }
    // Read the JSON file
    const promptsPath = path.join(__dirname, 'strings.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
    let prompt = "";
    switch (diagramType) {
        case DiagramTypes.ACTIVITY:
            prompt += prompts.activityDiagramPromptGenerator;
            break;
        case DiagramTypes.SEQUENCE:
            prompt += prompts.sequenceDiagramPromptGenerator;
            break;
        default:
            return res.status(400).json({ error: "Invalid 'diagramType' provided." });
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
    const { action,clientID } = req.body;

    if (!action || !clientID) {
        return res.status(400).json({ error: "'action' and 'clientID' are required!" });
    }
    let chat:any = clientChats.get(clientID);
    if(!chat){
        return res.status(400).json({ error: "No chat found for the clientID. Maybe it wasn't initialized when generating the diagram for the first time." });
    }

    // Read the JSON file
    const promptsPath = path.join(__dirname, 'strings.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
    let prompt = "";
   
    prompt += prompts.ChatDiagramPrompt;

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