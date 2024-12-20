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
import ChatLoading from "../components/chatLoading";
import { getChats } from "../api/api";


export default function Interactor() {
    // Retrieve the id from the local storage
    const { id } = useParams();
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
            if (id !== 0) {
                const chat = data.find((chat) => chat.id === id);
                setChat(chat);
                setChatLoaded(data.some(chat => chat.id === id));

                const validId = data.some(chat => chat.id === id) ? id : data[0].id;
                localStorage.setItem("req2testId", validId);
            }
            else {
                setChatLoaded(false);
            }
        });
    }, [id]);


    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            {chatLoaded ? (
                chat !== null ? (
                    <Assistant chat={chat}/>
                ) : (
                    <ChatNotFound />
                )
            ) : (
                <ChatLoading />
            )}
        </div>
    )
}
