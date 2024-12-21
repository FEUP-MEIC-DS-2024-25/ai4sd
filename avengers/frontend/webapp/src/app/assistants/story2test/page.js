"use client";

import {useEffect, useState} from "react";
import {getConversations} from "./api";
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';
import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "./components/assistant";
import ButtonContainer from "@/app/assistants/story2test/components/Buttons";

export default function Interactor() {
    const assistName = "Story2Test";
    const assistType = "verif";
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversationId, setConversationId] = useState("1");
    const [conversation, setConversation] = useState(null);
    const [conversationLoaded, setConversationLoaded] = useState(false);

    const prepareHistory = (conversations) => {
        return conversations.map((conversation) => ({
            text: conversation.name, link: `/assistants/story2test/${conversation.id}`
        }));
    };

    useEffect(() => {
        const id = localStorage.getItem("story2test_conversation_id");
        if (id) {
            setConversationId(id);
        }
    }, [conversationId]);

    useEffect(() => {
        let conversations = getConversations();
        setAssistHistory(prepareHistory(conversations));
        const conversation = conversations.find((conversation) => conversation.id === conversationId);
        setConversation(conversation);
        setConversationLoaded(true);
    }, [conversationId]);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker/>
            <div className="flex flex-col space-y-2">
                <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
                <ButtonContainer conversation={conversation}/>
            </div>
            {conversation !== null ? (
                <Assistant conversation={conversation}/>
            ) : (
                <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <h1 className="text-9xl tracking-wide font-bold text-indigo-200">...</h1>
                        <h2 className="text-3xl font-medium text-indigo-200">Loading Chat</h2>
                    </div>
                </div>
            )}
        </div>
    );
}
