import axios from "axios";

export default function useAssistPinSend() {
    const handleSendPin = async (pinnedMessage, conversationId) => {
        if (pinnedMessage.trim()) {
            try {
                const newPinnedMessage = {
                    message: pinnedMessage
                };
                const response = await axios.post(`http://localhost:8080/chat/pin/${conversationId}`, newPinnedMessage);
                return response;
            } catch (error) {
                return error;
            }
        }
    };

    const handleEditPin = async (pinnedId, newMessage, conversationId) => {
        try {
            const editPinnedMessage = {
                pinned_id: pinnedId,
                message: newMessage
            }
            const response = await axios.put(`http://localhost:8080/chat/pin/${conversationId}`, editPinnedMessage);
            return response;
        } catch (error) {
            console.error("Error updating pinned message:", error);
        }
    };

    const updatePinnedMessages = async (pinnedMessages, setPinnedMessages, responseData) => {
        const updatedMessage = {
            message: responseData.message
        };
        setPinnedMessages(prevMessages => prevMessages.map(msg => msg.id === responseData.id ? updatedMessage : msg));
    };

    return { handleSendPin, handleEditPin, updatePinnedMessages };
}
