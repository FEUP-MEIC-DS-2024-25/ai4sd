import axios from "axios";

export default async function deleteChat(conversationId, setError) {
    try {
        const response = await axios.delete(`https://superhero-03-01-150699885662.europe-west1.run.app/chat/${conversationId}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to delete chat");
        }
    } catch (error) {
        setError(error.response?.data?.detail || "An error occurred");
    }
}