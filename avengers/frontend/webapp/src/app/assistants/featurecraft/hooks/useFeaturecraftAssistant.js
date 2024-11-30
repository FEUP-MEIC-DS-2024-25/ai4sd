import { useState, useEffect } from "react";
import axios from "axios";

export default function useFeaturecraftAssistant(conversationId, setConversationId, setAssistHistory, shouldFetchData = true) {
    const [members, setMembers] = useState(["You", "Gemini"]);
    const [description, setDescription] = useState("Welcome to the Featurecraft Assistant!");
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [totalMessages, setTotalMessages] = useState(0);

    useEffect(() => {
        if (!shouldFetchData) return;

        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8000/chat/${conversationId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching chat:", error);
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
    }, [conversationId, shouldFetchData]);

    const handleSendMessage = (sentMessage) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            sentMessage.newMessage
        ]);
    };

    const handleReceiveMessage = (response) => {
        console.log(response.data);

        if (response.status === 200) {
            setMessages((prevMessages) => [
                ...prevMessages,
                response.data
            ]);
        } else if (response.status === 201) {
            setConversationId(response.data._id);
            setMembers(response.data.members);
            setDescription(response.data.description);
            const assistantResponse = response.data.messages[response.data.messages.length - 1];
            setMessages((prevMessages) => [
                ...prevMessages,
                assistantResponse
            ]);
            setPinnedMessages(response.data.pinnedMessages);
            setTotalMessages(response.data.totalMessages);

            // Add new conversation to assistHistory at the start
            setAssistHistory((prevHistory) => [
                {
                    text: response.data.description,
                    link: `/assistants/featurecraft/${response.data._id}`
                },
                ...prevHistory
            ]);
        } else {
            console.error(response);
        }
    };

    return {
        members,
        description,
        messages,
        pinnedMessages,
        totalMessages,
        handleSendMessage,
        handleReceiveMessage
    };
}