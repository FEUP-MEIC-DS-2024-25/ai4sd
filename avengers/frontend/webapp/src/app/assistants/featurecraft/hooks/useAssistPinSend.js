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
        try {
            //const response = await axios.post(`http://localhost:8080/chat/pin/${conversationId}`, pinnedMessage);
            const response = await axios.post(`https://superhero-03-01-150699885662.europe-west1.run.app/chat/pin/${conversationId}`, pinnedMessage);
            return response;
        } catch (error) {
            //Return the error
            return error;
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
        // Extract all messages from responseData
        const newMessages = responseData.map(item => ({
            message: item.message,
            id: item.id
        }));

        if (pinnedMessages === undefined) {
            setPinnedMessages(newMessages);
            return;
        }
        // Add new messages to the existing messages array
        setPinnedMessages(prevMessages => [...prevMessages, ...newMessages]);
    }

    const updatePinnedMessagesText = async (pinnedMessages, setPinnedMessages, data) => {

    return { handleSendPin, handleEditPin, updatePinnedMessages };
        const newMessages = data.map(item => ({
            message: item
        }));

        if (pinnedMessages === undefined) {
            setPinnedMessages(newMessages);
            return;
        }
        // Add new messages to the existing messages array
        setPinnedMessages(prevMessages => [...prevMessages, ...newMessages]);
    }

    return { handleSendPin, updatePinnedMessages, updatePinnedMessagesText };
}
