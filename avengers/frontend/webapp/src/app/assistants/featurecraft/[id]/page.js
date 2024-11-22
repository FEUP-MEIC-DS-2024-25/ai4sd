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

export default function FeaturecraftConversationPage() {
    const { id } = useParams();
    const assistName = "FeatureCraft";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversationId, setConversationId] = useState(id);
    const [conversationExists, setConversationExists] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/history")
            .then(response => {
                if (response.status === 200) {
                    if (response.data && response.data.length > 0) {
                        // Organize the data
                        response.data.forEach((item) => {
                            item.text = item.description;
                            item.link = `/assistants/featurecraft/${item._id}`;
                        });
                        // Check if the conversation ID exists
                        const conversation = response.data.find(item => item._id === id);
                        if (!conversation) {
                            setConversationExists(false);
                        } else {
                            setConversationExists(true);
                        }
                        return response.data;
                    }
                    return [{ text: "Nothing to show yet.", link: "" }];
                } else {
                    throw new Error("Unexpected response status");
                }
            })
            .then(data => setAssistHistory(data))
            .catch(error => console.error("Error fetching history:", error));
    }, [id]);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
            {conversationExists ? (
                <FeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} setAssistHistory={setAssistHistory} />
            ) : (
                <ConversationNotFound />
            )}
        </div>
    )
}