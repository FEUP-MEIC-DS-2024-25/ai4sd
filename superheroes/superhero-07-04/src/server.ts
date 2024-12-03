import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseCppCode } from './parsers/parser';
import { fullFileComments ,CodeComment} from './parsers/parser_legacy';
const app = express();
const port = 3000; // Replace with the port you want to use

app.use(bodyParser.json());

app.post('/generate-comments', async (req, res) => {
    const { languageId, text, apiKey, language } = req.body;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.1,
            },
        });
        const type = 'detailed';
        const prompt = `Create a ${type} documentation for each function, in the ${language} language for the programing language ${languageId}.
            ${text}
            Comment = {'className': string, 'functionName': string, 'documentation': string}
            Return: Array<Comment>`;
        const result = await model.generateContent(prompt);

        const responseText = result.response.text().split('\n').slice(1).join('\n');
        const comments: CodeComment[] = fullFileComments(text,responseText);
        res.json({ comments: JSON.stringify(comments, null, 2) });
    } catch (error) {
        console.error('Error generating comments:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
});

app.post('/generate-comments-splited', async (req, res) => {
    const { languageId, text, apiKey, language } = req.body;
    console.log('Generating comments for split functions');
    const functions = parseCppCode(text);
    console.log('Parsed functions:', functions);
    const comments: CodeComment[] = [];

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.1,
            },
        });
        for (const [key, value] of functions) {
            const prompt = `Create a detailed Text only documentation for each function in ${languageId}. Without the function signature and no example code.
                ${value.body}`;
            const result = await model.generateContent(prompt);
            //process the output


                        // Split the string into an array of lines
            const linesArray: string[] = result.response.text().split('\n');

            // Remove the first and last lines
            if (linesArray.length > 1) {
                linesArray.shift(); // Remove the first element
                linesArray.pop();
                linesArray.pop();   // Remove the last element
            }

            // Join the remaining lines back into a single string
            const resultString: string = linesArray.join('\n');
            console.log('Result:', resultString);
            comments.push({ line: key -1, comment:  resultString });
        }

        res.json({ comments: JSON.stringify(comments, null, 2) });
    } catch (error) {
        console.error('Error generating comments:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});