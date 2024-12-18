import axios from 'axios';

const BASE_URL = 'https://superhero-01-03-150699885662.europe-west1.run.app';

export const getChats = async () => {
    const response = await axios.get(`${BASE_URL}/get_chats`);

    console.log(response.data);
    if (response.data.error !== undefined) {
        console.warn("No chats found; returning default chat");
        // Return default chat
        return [{
            id: 1,
            name: "Default Chat",
            messages: [
                {
                    content: "Hello! I am Req2Test. How can I help you?",
                    sender: "bot"
                }
            ]
        }];
    }

    const chats = []

    for(let i = 0; i < response.data.length; i++) {
        const messages = []
        let prompts = response.data[i].prompts;

        for(let j = 0; j < prompts.length; j++) {

            let promptId = prompts[j].id;
            let prompt = await axios.get(`${BASE_URL}/get_prompt/${promptId}`);

            console.log("Prompt data:", prompt.data);

            const promptMessage = {
                content: prompt.data.user_input,
                sender: "user"
            }

            messages.push(promptMessage);

            let aiResponseId = prompt.data.response.id
            let aiResponse = await axios.get(`${BASE_URL}/get_response/${aiResponseId}`);
            
            console.log("Ai response data:", aiResponse.data);

            const aiResponseMessage = {
                content: aiResponse.data.ai_response,
                sender: "bot"
            }

            messages.push(aiResponseMessage);
        }
        
        const chat = {
            id: response.data[i].id,
            name: response.data[i].name,
            messages: messages
        }  
        
        chats.push(chat)
    }

    return chats;
};

export const createPrompt = async (chatId, userInput) => {
    const response = await axios.post(`${BASE_URL}/create_prompt`, {
        chat_id: chatId,
        user_input: userInput
    });
    return response.data;
};

export const createResponse = async (promptId, aiResponse) => {
    const response = await axios.post(`${BASE_URL}/create_response`, {
        prompt_id: promptId,
        ai_response: aiResponse
    });
    return response.data;
};

export const convertRequirementToText = async (text) => {
    try {
        const response = await axios.post(`${BASE_URL}/convert`, {
            requirement: text
        });        
        return response.data.gherkin;
    } catch (error) {
        console.error('Error converting requirement to text:', error);
        throw error;
    }
};