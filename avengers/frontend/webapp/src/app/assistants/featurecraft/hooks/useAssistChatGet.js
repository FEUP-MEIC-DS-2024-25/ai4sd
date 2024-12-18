import { useEffect } from "react";
import axios from "axios";

export default function useAssistChatGet(
    conversationId,
    setConversationId,
    setAssistHistory,
    members,
    setMembers,
    description,
    setDescription,
    messages,
    setMessages,
    pinnedMessages,
    setPinnedMessages,
    totalMessages,
    setTotalMessages,
    setError
) {
    useEffect(() => {
        
        async function fetchData() {
            try {
                const response = await axios.get(`https://superhero-03-01-150699885662.europe-west1.run.app/chat/${conversationId}`);
                return response.data;
            } catch (error) {
                setError("Error connecting to the backend.\n" + error);
            }
        }

        async function loadChatData() {
            const chatData = await fetchData();
            if (chatData) {
                setMembers(chatData.members);
                setDescription(chatData.description);
                setMessages(chatData.messages);
                setPinnedMessages(chatData.pinnedMessages);
                setTotalMessages(chatData.totalMessages);
            }
        }

        loadChatData();
    }, []);
}