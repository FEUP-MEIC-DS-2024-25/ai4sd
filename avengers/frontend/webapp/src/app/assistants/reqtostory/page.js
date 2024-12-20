"use client"
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from "react";  
import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./components/assistant";

import useProjects from "./components/useProjects";

export default function Interactor() {

    const [update, setUpdate] = useState(false);

    const assistName = "ReqToStory";
    const assistType = "req";
    const assistHistory = useProjects(update, setUpdate)
    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
            <Assistant />
        </div>
    )
}
