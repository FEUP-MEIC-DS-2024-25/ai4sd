"use client"
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

import styles from "@/app/page.module.css";

import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "../components/assistant"
import ChatNotFound from "../components/chatNotFound";


export default function Interactor() {
    const { id } = useParams();
    const assistName = "Req2Test";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState(prepareMockHistory);
    const [chat, setChat] = useState(null);
    const [chatExists, setChatExists] = useState(true);

    const mockChats = [
        { id: 1, name: "Chat 1", 
            messages: [
                { content: "Welcome! I am here to help you convert your requirements into Gherkin tests. How can I assist you today?", sender: "bot" },
                { content: "I need help with a requirement", sender: "user" },
                { content: "Sure! Please paste your requirement here", sender: "bot" },
            ] 
        },
        { id: 2, name: "Chat 2", 
            messages: [
                { content: "Welcome! I am here to help you convert your requirements into Gherkin tests. How can I assist you today?", sender: "bot" },
                { content: "I need help with a requirement", sender: "user" },
                { content: "Sure! Please paste your requirement here", sender: "bot" },
            ] 
        },
        { id: 3, name: "Chat 3", 
            messages: [
                { content: "Welcome! I am here to help you convert your requirements into Gherkin tests. How can I assist you today?", sender: "bot" },
                { content: "I need help with a requirement", sender: "user" },
                { content: "Sure! Please paste your requirement here", sender: "bot" },
            ] 
        }
    ]


    useEffect(() => {
        if (id > 3) {
            setChatExists(false);
        } 
        else if (id >= 1) {
            setChat(mockChats[id - 1]);
            setChatExists(true);
        }

        // Save id to local storage
        localStorage.setItem("req2testId", id);
    }, [id]);


    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            {chatExists && chat !== null ? (
                <Assistant chat={chat}/>
            ) : (
                <ChatNotFound />
            )}
        </div>
    )
}

function prepareMockHistory() {
    const history = [];
    for (let i = 1; i <= 20; i++) {
        const chat = { text: `Chat ${i}`, link: `/assistants/req2test/${i}` };
        history.push(chat);
    }
    return history;
}
