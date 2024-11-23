/** 
 * 
 * 
 * OLD PROTOTYPE SETUP
 * 
 * 
 * 
 * 
*/

import React, { useState } from 'react';
//import { generateContent } from '../services/apiService';

const App = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleGenerate = async () => {
        try {
            const result = "EXAMPLE"; /*await generateContent(prompt);*/
            console.log('Backend response:', result); // Log the full backend response
            setResponse(result);
        } catch (error) {
            console.error('Error generating content:', error);
    
            // Display the error message received from the backend
            setResponse(error.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div>
        <h1>Gemini Content Generator</h1>
        <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
        />
        <button onClick={handleGenerate}>Generate</button>
        <div>
            <h2>Response:</h2>
            <div dangerouslySetInnerHTML={{ __html: response }}></div>
        </div>
        </div>
    );
};

export default App;
