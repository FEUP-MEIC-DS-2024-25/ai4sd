import styles from "@/app/page.module.css";
import NewMessageBlock from "@/app/assistants/featurecraft/components/newMessageBlock";
import MessageBlock from "@/app/assistants/featurecraft/components/messageBlock";
import useAssistChatSend from "@/app/assistants/featurecraft/hooks/useAssistChatSend";
import useAssistChatReceive from "@/app/assistants/featurecraft/hooks/useAssistChatReceive";
import useAssistChatGet from "@/app/assistants/featurecraft/hooks/useAssistChatGet";
import ErrorNotification from "@/app/assistants/featurecraft/components/ui/errorNotification";
import PinnedMessagesBlock from "@/app/assistants/featurecraft/components/pinnedMessageBlock";

import { useState } from "react";

export default function ExistingFeaturecraftAssistant({ conversationId, setConversationId, setAssistHistory }) {
    const [messages, setMessages] = useState([]);
    const [totalMessages, setTotalMessages] = useState(0);
    const [description, setDescription] = useState("Welcome to the Featurecraft Assistant!");
    const [members, setMembers] = useState(["You", "Gemini"]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [error, setError] = useState("");

    const { handleSendMessage } = useAssistChatSend(
        messages,
        setMessages
    );

    const { handleReceiveMessage } = useAssistChatReceive(
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
        error,
        setError
    );

    useAssistChatGet(
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
    );
    
    return (
        <div className={`${styles.assistantInteraction} w-full h-full`}>
            <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                <div className="flex flex-row w-full h-full">
                    <div className="h-full flex-grow">
                        <MessageBlock messages={messages} totalMessages={totalMessages} description={description} conversationId={conversationId} pinnedMessages={pinnedMessages} setPinnedMessages={setPinnedMessages} />
                    </div>
                    <div className="h-full flex-shrink-0">
                        <PinnedMessagesBlock pinnedMessages={pinnedMessages} conversationId={conversationId} setPinnedMessages={setPinnedMessages} setError={setError} />
                    </div>
                </div>
                <NewMessageBlock onSendMessage={handleSendMessage} onReceiveMessage={handleReceiveMessage} conversationId={conversationId} />
            </div>
            <ErrorNotification error={error} setError={setError} />
        </div>
    );
}