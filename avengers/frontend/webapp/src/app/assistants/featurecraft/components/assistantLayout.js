import styles from "@/app/page.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

import '@/app/globals.css';
import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import ExistingFeaturecraftAssistant from "@/app/assistants/featurecraft/components/assistantExisting";
import NewFeaturecraftAssistant from "@/app/assistants/featurecraft/components/assistantNew";
import ConversationNotFound from "@/app/assistants/featurecraft/components/ui/conversationNotFound";
import ErrorNotification from "@/app/assistants/featurecraft/components/ui/errorNotification";
import useAssistHistory from "@/app/assistants/featurecraft/hooks/useAssistHistory";
import Loading from "@/app/assistants/featurecraft/components/ui/loading";


export default function FeaturecraftLayout({
    assistName,
    assistType,
    initialConversationId,
    isNewConversation
}) {
    const { assistHistory, setAssistHistory, conversationId, setConversationId, conversationExists, error, setError, loading: historyLoading } = useAssistHistory(initialConversationId);

    if (historyLoading) {
        return <Loading />;
    }

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
            {conversationExists ? (
                <ExistingFeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} setAssistHistory={setAssistHistory} />
            ) : (
                isNewConversation ? (
                    <NewFeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} setAssistHistory={setAssistHistory} />
                ) : (
                    <ConversationNotFound />
                )
            )}
            <ErrorNotification error={error} setError={setError} />
        </div>
    );
}