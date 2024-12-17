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
    const assistName = "Req2Test";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [chatId, setChatId] = useState(0);
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
        // Retrieve the id from the local storage
        const id = localStorage.getItem("req2testId");
        if (id) {
            setChatId(id);
        }
    }, [chatId]);


    useEffect(() => {
        getChats().then((data) => {
            setAssistHistory(prepareHistory(data));

            if (chatId === 0) {
                setChatId(data[0].id);
            }
            const chatObj = data.find((chat) => chat.id === chatId);
                
            setChat(chatObj);
            

            if (!chat) // If the chat is not found, set the chat to the first chat
                setChat(data[0]);

            setChatLoaded(true);
        });
    }, [chatId]);


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
