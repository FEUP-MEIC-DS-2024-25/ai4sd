import styles from "@/app/page.module.css";
import { Chatbot } from './Chat';
import {useState} from "react";

export default function Assistant({ conversation }) {
    const [selectedConversation, setSelectedConversation] = useState(conversation);

    return (
        <div className={styles.assistantInteractionDark}>
            <Chatbot conversation={selectedConversation} setConversation={setSelectedConversation} />
        </div>
    )
}