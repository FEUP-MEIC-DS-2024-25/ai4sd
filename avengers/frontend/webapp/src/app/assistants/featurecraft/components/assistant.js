import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/app/page.module.css";
import NewMessageBlock from "@/app/assistants/featurecraft/components/newMessageBlock";
import MessageBlock from "@/app/assistants/featurecraft/components/messageBlock";

export default function FeaturecraftAssistant({ conversationId, setConversationId }) {
    const [members, setMembers] = useState(["You", "Gemini"]);
    const [description, setDescription] = useState("Welcome to the Featurecraft Assistant!");
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [totalMessages, setTotalMessages] = useState(0);

    useEffect(() => {
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
    }, [conversationId]);

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
        } else {
            console.error(response);
        }
    };

    return (
        <div className={`${styles.assistantInteraction} w-full h-full`}>
            <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                <MessageBlock messages={messages} totalMessages={totalMessages} description={description} />
                <NewMessageBlock onSendMessage={handleSendMessage} onReceiveMessage={handleReceiveMessage} conversationId={conversationId} />
            </div>
        </div>
    )
}