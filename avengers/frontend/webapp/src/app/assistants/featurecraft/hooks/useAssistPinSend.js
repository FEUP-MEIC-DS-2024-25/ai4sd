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
                return response;
            } catch (error) {
                //Return the error
                return error;
            }
        }
    };

    const updatePinnedMessages = async (pinnedMessages, setPinnedMessages, responseData) => {
        const newPinnedMessages = responseData;
        setPinnedMessages(newPinnedMessages);
    }

    return { handleSendPin, updatePinnedMessages };
}
