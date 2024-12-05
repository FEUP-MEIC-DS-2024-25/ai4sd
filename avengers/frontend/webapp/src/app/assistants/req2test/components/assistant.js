import styles from "@/app/page.module.css";
import { Chatbot } from './Chat';
import { useState } from "react";


export default function Assistant({ chat }) {
    const [selectedChat, setSelectedChat] = useState(chat);

    return (
        <div className={styles.assistantInteraction}>
            <Chatbot chat={selectedChat} setChat={setSelectedChat} />
        </div>
    )
}