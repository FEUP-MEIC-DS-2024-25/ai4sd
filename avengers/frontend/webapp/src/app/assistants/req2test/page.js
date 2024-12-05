/*
"use client"
import { useEffect, useState } from "react";

import styles from "@/app/page.module.css";

import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./components/assistant"
import ChatNotFound from "./components/chatNotFound";
import ChatLoading from "./components/chatLoading";
import { getChats } from "./api/api";


export default function Interactor() {
    // Retrieve the id from the local storage
    const id = localStorage.getItem("req2testId") ? localStorage.getItem("req2testId") : 0;
    const assistName = "Req2Test";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [chat, setChat] = useState(null);
    const [chatLoaded, setChatLoaded] = useState(false);

    const prepareHistory = (chats) => {
        const history = [];
        chats.map((chat) => {
            const chatObj = { text: chat.name, link: `/assistants/req2test/${chat.id}` };
            history.push(chatObj);
        });
        return history;
    }


    useEffect(() => {
        getChats().then((data) => {
            setAssistHistory(prepareHistory(data));

            const chat = data.find((chat) => chat.id === id);
            setChat(chat);
            setChatLoaded(true);
        });
    }, [id]);


    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory} />
            {chatLoaded ? (
                chat !== null ? (
                    <Assistant chat={chat} />
                ) : (
                    <ChatNotFound />
                )
            ) : (
                <ChatLoading />
            )}
        </div>
    )
}
    */

"use client";
import { useEffect, useState } from "react";

import styles from "@/app/page.module.css";

import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./components/assistant";
import ChatNotFound from "./components/chatNotFound";
import ChatLoading from "./components/chatLoading";
import { getChats } from "./api/api";

export default function Interactor() {
    const assistName = "Req2Test";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [chat, setChat] = useState(null);
    const [chatLoaded, setChatLoaded] = useState(false);
    const [id, setId] = useState(0); // Default to 0, updated later

    const prepareHistory = (chats) => {
        const history = [];
        chats.map((chat) => {
            const chatObj = { text: chat.name, link: `/assistants/req2test/${chat.id}` };
            history.push(chatObj);
        });
        return history;
    };

    // Retrieve `id` from localStorage in the browser
    useEffect(() => {
        const storedId = localStorage.getItem("req2testId") || 0; // Use 0 as a fallback
        setId(storedId);
    }, []);

    // Fetch chats after getting the ID
    useEffect(() => {
        if (!id) return; // Wait until `id` is set
        getChats().then((data) => {
            setAssistHistory(prepareHistory(data));
    
            const chat = data.find((chat) => chat.id === id);
            setChat(chat);
            setChatLoaded(true);
        });
    }, [id]);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            {chatLoaded ? (
                chat !== null ? (
                    <Assistant chat={chat} />
                ) : (
                    <ChatNotFound />
                )
            ) : (
                <ChatLoading />
            )}
        </div>
    );
}

