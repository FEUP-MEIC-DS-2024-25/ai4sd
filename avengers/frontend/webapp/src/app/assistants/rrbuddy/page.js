"use client"
import { useState } from "react";
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "./components/rrbuddyHistory";
import Assistant from "./components/assistant";

export default function Interactor() {
    const [historyData, setHistoryData] = useState([]);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory name={"RRBuddy"} type={"req"} interactions={historyData} />
            <Assistant setHistoryData={setHistoryData}/>
        </div>
    );
}