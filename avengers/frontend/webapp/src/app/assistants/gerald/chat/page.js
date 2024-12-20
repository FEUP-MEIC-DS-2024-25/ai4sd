"use client"
import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';

import AssistantPicker from "@/app/components/assistantPicker";
import AssistantHistory from "@/app/components/assistantHistory";
import Assistant from "../components/assistant";
import { useState, useEffect, useCallback } from 'react';
import { listChatSessions, getProjectId } from '../services/gerald';

export default function Interactor() {
    const [chatHistory, setChatHistory] = useState([]);
    const [projectId, setProjectId] = useState(null);
    const assistName = "Gerald";
    const assistType = "refact";

    const fetchChatHistory = useCallback(async () => {
        const chatList = await listChatSessions(projectId);
        const chats = [];

        for (const chat of chatList) {
            chats.push({
                text: `Chat ${chats.length + 1}`,
                link: `#${chat.session_id}`,
                session_id: chat.session_id
            });
        }

        setChatHistory(chats);
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchChatHistory();
        }
    }, [projectId, fetchChatHistory]);

    useEffect(() => {
        initializeProjectId();
    }, []);

    const initializeProjectId = async () => {
        let proj_id = await getProjectId();
        setProjectId(proj_id);
    };

    const addChatToHistory = (newChat) => {
        setChatHistory(prev => [...prev, newChat]);
    };

    const getProjectNameFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const owner = urlParams.get('username');
        const repo = urlParams.get('repo');
        return `${owner}/${repo}`;
    };

    const projectName = getProjectNameFromUrl();

    return (
        <div className={styles.interactorLayout}>
            <AssistantPicker />
            <AssistantHistory 
                name={assistName} 
                type={assistType} 
                interactions={chatHistory}
            />
            <Assistant 
                addChatToHistory={addChatToHistory} 
                chatHistoryLength={chatHistory.length} 
                projectName={projectName} 
            />
        </div>
    )
}