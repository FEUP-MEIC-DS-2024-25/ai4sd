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
import { getChats } from "../api/api";


export default function Interactor() {
    // Retrieve the id from the local storage
    const { id } = useParams();
    const assistName = "Req2Test";
    const assistType = "req";
    const [assistHistory, setAssistHistory] = useState([]);
    const [chats, setChats] = useState(null);
    const [chat, setChat] = useState(null);
    const [chatExists, setChatExists] = useState(true);


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
            console.log("Data from getChats:",data);
            setChats(data);
            setAssistHistory(prepareHistory(data));
            if (id !== 0) {
                const chat = data.find((chat) => chat.id === id);
                console.log("ChatFilter:",chat);
                setChat(chat);
            }
            else {
                setChat(data[0]);
            }
        });
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