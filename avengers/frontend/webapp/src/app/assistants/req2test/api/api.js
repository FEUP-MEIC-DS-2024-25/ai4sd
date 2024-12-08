import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const getChats = async () => {
    const response = await axios.get(`${BASE_URL}/get_chats`);

    console.log(response.data);

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