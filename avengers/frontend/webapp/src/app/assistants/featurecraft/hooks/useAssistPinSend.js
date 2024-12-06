import axios from "axios";

export default function useAssistPinSend() {

    const handleSendPin = async (pinnedMessage, conversationId) => {
        if (pinnedMessage.trim()) {
            try {
                const newPinnedMessage = {
                    message: pinnedMessage
                };
                console.log("Id: " + conversationId);
                const response = await axios.post(`http://localhost:8080/chat/pin/${conversationId}`, newPinnedMessage);
                console.log(response);
                return response;
            } catch (error) {
                //Return the error
                return error;
            }
        }
    };

    const updatePinnedMessages = async (pinnedMessages, setPinnedMessages, responseData) => {
        // Extract message from response data
        const newMessage = {
            message: responseData.message
        };

        // Add new message to existing messages array
        setPinnedMessages(prevMessages => [...prevMessages, newMessage]);
    }

    return { handleSendPin, updatePinnedMessages };
}
