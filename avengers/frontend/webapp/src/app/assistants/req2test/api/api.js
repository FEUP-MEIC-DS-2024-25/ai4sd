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

            if (prompt.data.response === null || prompt.data.response === undefined) {
                continue;
            }
            console.log("Prompt response data:", prompt.data.response);
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
    try {
        if (response.status === 200) {
            console.log("Prompt created successfully");
            return response.data;
        }
        else {
            console.error("Error creating prompt:", response.data.error);
            throw new Error("Error creating prompt");
        }
    }
    catch (error) {
        console.error("Error creating prompt:", error);
        throw error;
    }
};

export const updatePrompt = async (promptId, aiResponseId) => {
    const response = await axios.put(`${BASE_URL}/update_prompt`, {
        prompt_id: promptId,
        response_id: aiResponseId
    });
    try {
        if (response.status === 200) {
            console.log("Prompt updated successfully");
        }
        else {
            console.error("Error updating prompt:", response.data.error);
            throw new Error("Error updating prompt");
        }
    }
    catch (error) {
        console.error("Error updating prompt:", error);
        throw error;
    }
}

export const createResponse = async (promptId, aiResponse) => {
    const response = await axios.post(`${BASE_URL}/create_response`, {
        prompt_id: promptId,
        ai_response: aiResponse
    });
    try {
        if (response.status === 200) {
            console.log("Response created successfully");
            console.log(response.data);
            return response.data;
        }
        else {
            console.error("Error creating response:", response.data.error);
            throw new Error("Error creating response");
        }
    }
    catch (error) {
        console.error("Error creating response:", error);
        throw error;
    }
};

export const updateChat = async (chatId, promptId, responseId) => {
    const response = await axios.post(`${BASE_URL}/update_chat`, {
        chat_id: chatId,
        prompt_id: promptId,
        response_id: responseId
    });
    try {
        if (response.status === 200) {
            console.log("Chat updated successfully");
        }
        else {
            console.error("Error updating chat:", response.data.error);
            throw new Error("Error updating chat");
        }
    }
    catch (error) {
        console.error("Error updating chat:", error);
        throw error;
    }
}


export const convertRequirementToText = async (text) => {
    try {
        const response = await axios.post(`${BASE_URL}/convert`, {
            requirement: text
        });        
        return response.data;
    } catch (error) {
        console.error('Error converting requirement to text:', error);
        throw error;
    }
};