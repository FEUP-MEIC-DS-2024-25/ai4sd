import { GeminiModel } from '../../model/gemini.js';

const model = new GeminiModel();

export default (app) => {
    app.post('/refactor', async (req, res) => {
        const { code, filters } = req.body;
        let prompt = `In the following code, perform the following tasks. Ensure that the refactoring preserves functionality and adheres to standard naming conventions. Provide only the updated code, without any additional comments, explanations, or formatting.\n`;

        if (filters.includes('renameVariables')) {
            prompt += `Rename all variables to reflect their values.\n`;
        }
        if (filters.includes('inlineTemps')) {
            prompt += `Inline all temporary variables.\n`;
        }
        if (filters.includes('extractVariables')) {
            prompt += `Extract complex and/or repeated expressions into variables.\n`;
        }
        if (filters.includes('extractMethods')) {
            prompt += `Extract complex and/or repeated code into methods.\n`;
        }
        if (filters.includes('renameMethods')) {
            prompt += `Rename all methods to reflect their functionality.\n`;
        }
        if (filters.includes('inlineMethods')) {
            prompt += `Inline methods that shouldn't be separate from their callers.\n`;
        }
        if (filters.includes('replaceTempWithQuery')) {
            prompt += `Replace temporary variables with queries.\n`;
        }
        if (filters.includes('removeAssignmentsToParameters')) {
            prompt += `Remove assignments to parameters. Instead, create a new variable and assign it the value of the parameter.\n`;
        }
        if (filters.includes('removeParameters')) {
            prompt += `Remove method parameters. Instead, create a new variable and assign it the value of the parameter.\n`;
        }
        if (filters.includes('replaceMagicNumbers')) {
            prompt += `Replace magic numbers with symbolic constants. Declare a constant variable and assign it the magic number.\n`;
        }
        if (filters.includes('consolidateDuplicateConditionals')) {
            prompt += `Consolidate duplicate conditional fragments. Combine the conditions into a single conditional.\n`;
        }
        if (filters.includes('replaceNestedConditionals')) {
            prompt += `Replace nested conditionals with guard clauses. Convert the nested conditional into a guard clause.\n`;
        }

        prompt += `Here is the code:\n${code}`;

        const aiResponse = await model.process(prompt);

        return res.json({
            "response": aiResponse
        });
    });
}
