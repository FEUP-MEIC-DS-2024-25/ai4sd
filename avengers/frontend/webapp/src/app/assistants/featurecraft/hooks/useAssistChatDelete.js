import axios from "axios";

export default async function deleteChat(conversationId, setError) {
    try {
        const response = await axios.delete(`https://superhero-03-01-150699885662.europe-west1.run.app/${conversationId}`);
        return response.data;
    } catch (error) {
        setError(error.response ? error.response.data : "An error occurred");
    }
}