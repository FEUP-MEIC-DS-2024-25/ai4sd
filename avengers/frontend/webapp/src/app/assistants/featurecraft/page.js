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

export default function Interactor() {
    const assistName = "FeatureCraft";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversationId, setConversationId] = useState("673d10aa792f5dc2123f0895"); // TODO: Change backend to accept "new" instead of an ID

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
                        return response.data;
                    }
                    return [{ text: "Nothing to show yet.", link: "" }];
                } else {
                    throw new Error("Unexpected response status");
                }
            })
            .then(data => setAssistHistory(data))
            .catch(error => console.error("Error fetching history:", error));
    }, []);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
            <NewFeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} setAssistHistory={setAssistHistory} />
        </div>
    );
}