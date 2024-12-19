"use client";

import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./components/assistant";
import Sidebar from "./components/Sidebar";

//BASE_URL = 'https://superhero-06-02-150699885662.europe-west1.run.app/';



export default function Interactor() {
    //preparing mock data
    const assistName = "Diagram Detective";
    const assistType = "arch"; // change according to the assistant type (req, arch, refact, verif)
    
    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <Sidebar />
            <Assistant />
        </div>
    )
}


// function prepareMockHistory() {
//     const history = [];
//     for (let i = 1; i <= 20; i++) {
//         const chat = { text: `Chat ${i}`, link: "#" };
//         history.push(chat);
//     }
//     return history;
// }