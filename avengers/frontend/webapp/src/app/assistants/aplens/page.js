"use client"
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import Assistant from "./components/assistant";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; 

export default function Interactor() {
    const name = "APlens";

    const [activeView, setActiveView] = useState("Forms");
    const [clientId, setClientId] = useState(null);

    const retrievedData = useRef([{retrievedData: {name: "Stub", id: 10000, timestamp: "teste", pattern: "MVC", percentage: "95", explanation: "Very nice, good programming here", improvements: [{Improve1: "This"}, {Improve2: "Then"}, {Improve3: "That"}], strenghts: [{Stregth1: "This"}, {Stregth2: "Then"}, {Stregth3: "That"}]}}]);

    useEffect(() => {
        const existingId = localStorage.getItem('clientId');
        if (existingId) {
            console.log("ALREADY EXISTS AN ID: " , existingId)
            setClientId(existingId);
        } else {
            const newId = uuidv4(); 
            localStorage.setItem('clientId', newId);
            setClientId(newId);
            console.log("WE HAVE CREATE AN ID FOR THE CLIENT: ", newId)
        }
    }, []);


    const saveData = async (jsonResponse) => {
        if (!user) return;
        let doc_uuid = uuidv4();

        const docRef = doc(db, "users", user.uid, "documentsCollection", doc_uuid);
        await setDoc(docRef, {
            retrievedData: jsonResponse,
        });
        await loadUserData(user.uid)
    };
    
    
    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <Assistant name={name} saveData={saveData} activeView={activeView} setActiveView={setActiveView} retrievedData={retrievedData} clientId={clientId} />
        </div>
    );
}