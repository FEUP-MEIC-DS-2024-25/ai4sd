import axios from "axios";

export default function useAssistPinSend() {

    const handleSendPin = async (pinnedMessage, conversationId) => {
        try {
            const response = await axios.post(`http://localhost:8080/chat/pin/${conversationId}`, pinnedMessage);
            return response;
        } catch (error) {
            //Return the error
            return error;
        }
    };

    const updatePinnedMessages = async (pinnedMessages, setPinnedMessages, responseData) => {
        // Extract all messages from responseData
        const newMessages = responseData.map(item => ({
            message: item.message
        }));

        // Add new messages to the existing messages array
        setPinnedMessages(prevMessages => [...prevMessages, ...newMessages]);
    }

    return { handleSendPin, updatePinnedMessages };
}
