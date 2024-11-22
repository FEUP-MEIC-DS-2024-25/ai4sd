"use client"
import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import Image from "next/image";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import FeaturecraftAssistant from "@/app/featurecraft/components/assistant";


export default function Interactor() {
    const assistName = "FeatureCraft";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversationId, setConversationId] = useState("673d10aa792f5dc2123f0895");

    useEffect(() => {
        axios.get("http://localhost:8000/history")
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    if (response.data && response.data.length > 0) {
                        // Organize the data
                        response.data.forEach((item) => {
                            item.text = item.description;
                            item.link = `/featurecraft/${item._id}`;
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
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            <FeaturecraftAssistant conversationId={conversationId} setConversationId={setConversationId} />
        </div>
    )
}
