import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const sendMessage = async (message, conversationId) => {
    try {
        let dto = {
            command: message,
        };
        if (conversationId) 
            dto.conversationId = conversationId;

        const response = await axios.post(`${BASE_URL}/command`, dto);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}