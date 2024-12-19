import { GeminiModel } from '../../model/gemini.js';

const model = new GeminiModel();

export default (app) => {
    app.post('/regenerate', async (req, res) => {
        const { code, language, refactoredCode, filters, customInput } = req.body;

        let prompt = `Refactor the following code from a test.${language} file, based on the specified tasks. Ensure that the refactoring adheres to the given requirements, maintains functionality and adheres to standard language conventions, namely: comment conventions, naming conventions, line length conventions and indent style conventions. Provide only the updated code, without additional comments, explanations, or formatting. Do not remove any comments from the code unless prompted otherwise.`;
        
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
        if(filters.includes('highExpensiveOperations')) {
            prompt += `Replace expensive operations for better performance, such as nested loops or repeated API/database calls. If you cant change it highlight it. Provide reasoning on your changes.\n`;
        }
        if (filters.includes('analyseTimeComplexity')) {
            prompt += `Analyse the time complexity of the code, providing Big O notation and a refactored version of it, with a better time complexity and reasoning.\n`;
        }
        if (filters.includes('analyseSpaceComplexity')) {
            prompt += `Analyse the space complexity of the code, providing Big O notation and a refactored version of it, with a better space complexity and reasoning.\n`;
        }
        if (filters.includes('removeComments')) {
            prompt += `Remove all comments that do not contain the keywords TODO or FIXME.\n`;
        }
        if (customInput) {
            prompt += `${customInput}\n`;
        }

        prompt += `\n### Input Code\n\n${code}\n`;

        prompt += `\n### Refactored Code (Previous Attempt)\n\n${refactoredCode}\n`;

        prompt += `\n### New Requirement\n\nGenerate a different refactored version of the code that satisfies the same tasks as listed above.`;

        const aiResponse = await model.process(prompt);

        return res.json({
            "response": aiResponse
        });
    });
}
