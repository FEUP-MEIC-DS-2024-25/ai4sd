"use client"
import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import Image from "next/image";

import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import FeaturecraftAssistant from "@/app/featurecraft/components/assistant";


export default function Interactor() {
    const assistName = "FeatureCraft";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/history")
            .then(response => {
                if (response.status === 204) {
                    return [{ text: "Nothing to show yet.", link: "" }];
                } else if (response.status === 200) {
                    return [{ text: "Nothing to show yet.", link: "" }];
                    // TODO : Handle response
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
            <FeaturecraftAssistant />
        </div>
    )
}
