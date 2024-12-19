import axios from "axios";

export default async function exportPinnedMessages(conversationId, setError) {
    try {
        const response = await axios.get(`http://localhost:8080/chat/pin/${conversationId}/export`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `pinned_messages_${conversationId}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        setError("Failed to export pinned messages.");
    }
}