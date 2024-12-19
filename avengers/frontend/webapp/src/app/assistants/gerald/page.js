"use client"
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./components/assistant";
import { useState, useEffect } from 'react';
import { listChatSessions } from './services/gerald';


export default function Interactor() {
    const [chatHistory, setChatHistory] = useState([]);
    const assistName = "Gerald";
    const assistType = "Gerald";

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const chatList = await listChatSessions(132); // Assuming 132 is your project ID
            const formattedChats = chatList.map((chat, index) => ({
                text: `Chat ${index + 1}`,
                link: `#${chat.session_id}`,
                session_id: chat.session_id
            }));
            setChatHistory(formattedChats);
        } catch (error) {
            console.error("Error fetching chat history:", error);
            setChatHistory([]);
        }
    };

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory 
                name={assistName} 
                type={assistType} 
                interactions={chatHistory}
            />
            <Assistant />
        </div>
    )
}