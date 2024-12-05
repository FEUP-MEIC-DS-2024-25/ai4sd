import styles from "@/app/page.module.css";
import NewMessageBlock from "@/app/assistants/featurecraft/components/newMessageBlock";
import MessageBlock from "@/app/assistants/featurecraft/components/messageBlock";
import useFeaturecraftAssistant from "@/app/assistants/featurecraft/hooks/useFeaturecraftAssistant";
import ErrorNotification from "@/app/assistants/featurecraft/components/ui/errorNotification";
import { useState } from "react";

export default function FeaturecraftAssistant({ conversationId, setConversationId, setAssistHistory }) {
    const [error, setError] = useState("");
    const {
        members,
        description,
        messages,
        pinnedMessages,
        totalMessages,
        handleSendMessage,
        handleReceiveMessage
    } = useFeaturecraftAssistant(conversationId, setConversationId, setAssistHistory, true, error, setError);
    

    return (
        <div className={`${styles.assistantInteraction} w-full h-full`}>
            <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                <MessageBlock messages={messages} totalMessages={totalMessages} description={description} />
                <NewMessageBlock onSendMessage={handleSendMessage} onReceiveMessage={handleReceiveMessage} conversationId={conversationId} />
            </div>
            <ErrorNotification error={error} setError={setError} />
        </div>
    );
}

export function NewFeaturecraftAssistant({ conversationId, setConversationId, setAssistHistory }) {
    const [error, setError] = useState("");
    const {
        members,
        description,
        messages,
        pinnedMessages,
        totalMessages,
        handleSendMessage,
        handleReceiveMessage
    } = useFeaturecraftAssistant(conversationId, setConversationId, setAssistHistory, false, error, setError);

    return (
        <div className={`${styles.assistantInteraction} w-full h-full`}>
            <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                <MessageBlock messages={messages} totalMessages={totalMessages} description={description} />
                <NewMessageBlock onSendMessage={handleSendMessage} onReceiveMessage={handleReceiveMessage} conversationId={conversationId} />
            </div>
            <ErrorNotification error={error} setError={setError} />
        </div>
    );
}