"use client"
import { useParams } from 'next/navigation';
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { useEffect, useState } from "react";

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import FeaturecraftAssistant from "@/app/assistants/featurecraft/components/assistant";
import ConversationNotFound from "@/app/assistants/featurecraft/components/ui/conversationNotFound";
import ErrorNotification from "@/app/assistants/featurecraft/components/ui/errorNotification";
import useAssistHistory from "@/app/assistants/featurecraft//hooks/useAssistHistory";

export default function FeaturecraftConversationPage() {
    const { id } = useParams();
    const assistName = "FeatureCraft";
    const assistType = "req";

    const { assistHistory, setAssistHistory, conversationId, setConversationId, conversationExists, error, setError } = useAssistHistory(id);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
            {conversationExists ? (
                <FeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} setAssistHistory={setAssistHistory} />
            ) : (
                <ConversationNotFound />
            )}
            <ErrorNotification error={error} setError={setError} />
        </div>
    )
}