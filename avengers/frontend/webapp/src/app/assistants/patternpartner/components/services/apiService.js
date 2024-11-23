/** 
 * 
 * 
 * OLD PROTOTYPE SETUP
 * 
 * 
 * 
 * 
*/

export const generateContent = async (prompt) => {
    try {
        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch');
        }

        const data = await response.json();
        return data.generatedText;
    } catch (error) {
        console.error('Error in generateContent:', error);
        throw error;
    }
};
