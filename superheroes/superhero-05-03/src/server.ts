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

const genAI = new GoogleGenerativeAI("AIzaSyD8kleEGvzyFxtx8WOfhsIZSp7VuC1ypRM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

app.post('/generate', async (req: any, res: any) => {
    const { code, diagramType } = req.body;
    if (!code || !diagramType) {
        return res.status(400).json({ error: "Both 'code' and 'diagramType' are required." });
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
        const output = await model.generateContent(prompt);
        res.json({ text: output.response.text() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/chat', async (req: any, res: any) => {
    const { action, diagramType } = req.body;

    if (!action || !diagramType) {
        return res.status(400).json({ error: "Both 'code' and 'diagramType' are required." });
    }
    // Read the JSON file
    const promptsPath = path.join(__dirname, 'strings.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
    let prompt = "";
    switch (diagramType) {
        case DiagramTypes.ACTIVITY:
            //prompt += "Here goes some code. Explain what the code does by providing a PlantUML activity diagram. Do not provide any explanation or markup. Output only the PlantUML code. Here's an example of a diagram: @startuml\nstart\nrepeat\  :Test something;\n    if (Something went wrong?) then (no)\n      #palegreen:OK;\n      break\n    endif\n    ->NOK;\n    :Alert \"Error with long text\";\nrepeat while (Something went wrong with long text?) is (yes) not (no)\n->//merged step//;\n:Alert \"Success\";\nstop\n@enduml. The code is as follows:\n";
            prompt += prompts.activityDiagramPrompt;
            break;
        case DiagramTypes.SEQUENCE:
            prompt += prompts.sequenceDiagramPrompt;
            break;
        default:
            return res.status(400).json({ error: "Invalid 'diagramType' provided." });
    }
    prompt += "\n but ";
    prompt += action;
    try {
        const output = await model.generateContent(prompt);
        res.json({ text: output.response.text() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});