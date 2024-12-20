"use client"

import { useState, useEffect } from "react";   

import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./Assistant";

export default function Interactor() {

    //preparing mock data
    const assistName = "Req2Speech";
    const assistType = "req"; // change according to the assistant type (req, arch, refact, verif)
    const [assistHistory, setAssistHistory] = useState([]);

    useEffect(() => {
        async function fetchChats() {

            const chats = await getChats();

            console.log(chats); 
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
            <Assistant/>
        </div>
    )
}

async function getChats(){
    const backendUrl = "http://localhost:8080/req2speech/chat";

    const response = await axios.get(backendUrl);

    return response.data;
}