import axios from "axios";

export default function useAssistChatSend(messages, setMessages) {
    const handleSendMessage = async (sentMessage) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            sentMessage.newMessage
        ]);
    };

    return {
        handleSendMessage
    };
}