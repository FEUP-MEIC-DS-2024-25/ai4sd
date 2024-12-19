"use client";

import {useEffect, useState} from "react";
import {getConversations} from "../api";
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import '@/app/globals.css';
import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "../components/assistant";
import {useParams} from "next/navigation";
import ButtonContainer from "@/app/assistants/story2test/components/Buttons";

export default function Interactor() {
    const {id} = useParams();
    const assistName = "Story2Test";
    const assistType = "verif";
    const [assistHistory, setAssistHistory] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [conversationNotFound, setConversationNotFound] = useState(false);

    const prepareHistory = (conversations) => {
        return conversations.map((conversation) => ({
            text: conversation.name,
            link: `/assistants/story2test/${conversation.id}`,
        }));
    };

    useEffect(() => {
        let conversations = getConversations();
        setAssistHistory(prepareHistory(conversations));

        // Find the conversation based on the ID
        const convo = conversations.find((conv) => conv.id === id);

        if (convo) {
            setConversation(convo);
            setConversationNotFound(false);
        } else {
            setConversation(null);
            setConversationNotFound(true);
        }
    }, [id]);

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker/>
            <div className="flex flex-col space-y-2">
                <AssistantHistory name={assistName} type={assistType} interactions={assistHistory}/>
                <ButtonContainer conversation={conversation}/>
            </div>
            {conversationNotFound ? (
                <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <h1 className="text-9xl tracking-wide font-bold text-red-600">404</h1>
                        <h2 className="text-3xl font-medium text-indigo-200">Conversation Not Found</h2>
                        <p className="text-lg text-gray-400 mt-4">The conversation you&#39;re looking for doesn&#39;t
                            exist.</p>
                        <p className="text-lg text-gray-400 mt-4">You can create a new conversation or go back via the
                            assistant history.</p>
                    </div>
                </div>
            ) : conversation ? (
                <Assistant conversation={conversation}/>
            ) : (
                <div className="w-full h-full rounded-lg shadow-lg flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <h1 className="text-9xl tracking-wide font-bold text-indigo-800">...</h1>
                        <h2 className="text-3xl font-medium text-indigo-200">Loading Chat</h2>
                    </div>
                </div>
            )}
        </div>
    );
}
