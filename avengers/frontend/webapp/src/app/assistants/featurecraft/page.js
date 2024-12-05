"use client"
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import { NewFeaturecraftAssistant } from "@/app/assistants/featurecraft/components/assistant";
import ErrorNotification from "@/app/assistants/featurecraft/components/ui/errorNotification";
import useAssistHistory from "@/app/assistants/featurecraft//hooks/useAssistHistory";

export default function Interactor() {
    const assistName = "FeatureCraft";
    const assistType = "req";
    const { assistHistory, setAssistHistory, conversationId, setConversationId, conversationExists, error, setError } = useAssistHistory("673d10aa792f5dc2123f0895");
    // TODO: Change backend to accept "new" instead of an ID

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
            <NewFeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} setAssistHistory={setAssistHistory} />
            <ErrorNotification error={error} setError={setError}/>
        </div>
    );
}