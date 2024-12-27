"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "../Assistant"; 

import axios from 'axios';

//CSS
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';

export default function Interactor(){
    const { id } = useParams(); //Chat ID
    const assistName = "Req2Speech";
    const assistType = "req"; // change according to the assistant type (req, arch, refact, verif
    const [assistHistory, setAssistHistory] = useState([]);

    useEffect(() => {
        async function fetchChats() {
            const chats = await getChats();
            const history = [];
            
            chats.map((chat) => {
                history.push({text: `Chat ${chat}`, link: `/assistants/req2speech/${chat}`});
            });
            
            setAssistHistory(history);
        }
        fetchChats();
    }, []);
    
    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            <Assistant chatID={id}/>
        </div>
    )

    async function getChats(){
        const backendUrl = "https://superhero-03-03-150699885662.europe-west1.run.app/req2speech/chat";
        const response = await axios.get(backendUrl);
        return response.data;
    }
}
