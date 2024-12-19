import axios from "axios";

export default function useAssistPinSend() {

    const handleEditPin = async (pinnedId, newMessage, conversationId) => {
        try {
            const editPinnedMessage = {
                pinned_id: pinnedId,
                message: newMessage
            }
            //const response = await axios.put(`http://localhost:8080/chat/pin/${conversationId}`, editPinnedMessage);
            const response = await axios.put(`https://superhero-03-01-150699885662.europe-west1.run.app/chat/pin/${conversationId}`, editPinnedMessage);
            return response;
        } catch (error) {
            console.error("Error updating pinned message:", error);
        }
    };


    const handleSendPin = async (pinnedMessage, conversationId) => {
        try {
            //const response = await axios.post(`http://localhost:8080/chat/pin/${conversationId}`, pinnedMessage);
            const response = await axios.post(`https://superhero-03-01-150699885662.europe-west1.run.app/chat/pin/${conversationId}`, pinnedMessage);
            return response;
        } catch (error) {
            //Return the error
            return error;
        }
    };
    

    //const handleEditPin = async (pinnedId, newMessage, conversationId) => {
    //    try {
    //        const editPinnedMessage = {
    //            pinned_id: pinnedId,
    //            message: newMessage
    //        }
    //        const response = await axios.put(`http://localhost:8080/chat/pin/${conversationId}`, editPinnedMessage);
    //        return response;
    //    } catch (error) {
    //        console.error("Error updating pinned message:", error);
    //    }
    //};


    const updatePinnedMessages = async (pinnedMessages, setPinnedMessages, responseData) => {
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

    return { handleSendPin, handleEditPin, updatePinnedMessagesText, updatePinnedMessages };
    
}
