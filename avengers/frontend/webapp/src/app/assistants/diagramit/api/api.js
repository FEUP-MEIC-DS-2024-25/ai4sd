import axios from "axios";

const BASE_URL = "";

export const sendMessage = async (message, conversationId) => {
    try {
        let dto = {
            command: message,
        };
        if (conversationId) 
            dto.conversationId = conversationId;

        const response = await axios.post(`${BASE_URL}/command`, dto);
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}