import axios from "axios";

export default async function deleteChat(conversationId, setError) {
    try {
        const response = await axios.delete(`http://localhost:8080/chat/${conversationId}`);
        return response.data;
    } catch (error) {
        setError(error.response ? error.response.data : "An error occurred");
    }
}