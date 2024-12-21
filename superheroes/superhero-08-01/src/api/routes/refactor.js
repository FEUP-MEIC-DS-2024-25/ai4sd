import { GeminiModel } from '../../model/gemini.js';

const model = new GeminiModel();

export default (app) => {
    app.post('/refactor', async (req, res) => {
        const { code, language, filters, customInput } = req.body;
        
        let prompt = `In the following code from a test.${language} file, perform the following tasks. Ensure that the refactoring preserves functionality and adheres to standard language conventions, namely: comment conventions, naming conventions, line length conventions and indent style conventions. Provide only the updated code, without any additional comments, formatting, or explanations, unless prompted otherwise. Do not remove any comments from the code unless prompted otherwise.\n`;

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
        if (filters.includes('highExpensiveOperations')) {
            prompt += `Identify and replace high-expense operations, such as nested loops, repeated API/database calls, or inefficient algorithms, with more optimized solutions. If any operation cannot be improved, highlight it and explain why. Provide a detailed explanation of the reasoning behind your changes and how they improve performance.\n`;
        }
        if (filters.includes('analyseTimeComplexity')) {
            prompt += `Analyse the time complexity of the code, providing Big O notation and a refactored version of it, with a better time complexity and reasoning.\n`;
        }
        if (filters.includes('analyseSpaceComplexity')) {
            prompt += `Analyse the space complexity of the code, providing Big O notation and a refactored version of it, with a better space complexity and reasoning.\n`;
        }
      
        if (filters.includes('analyseSecurityVulnerabilities')) {
            prompt += `Analyse the code for security vulnerabilities, and remove any comments present and do not add any comment, just code.\n`;
        }
      
        if (filters.includes('removeComments')) {
            prompt += `Remove all comments that do not contain the keywords TODO or FIXME.\n`;
        }

        if (customInput) {
            prompt += `${customInput}\n`;
        }

        prompt += `Here is the code:\n${code}`;
        const aiResponse = await model.process(prompt);

        return res.json({
            "response": aiResponse
        });
    });
}
