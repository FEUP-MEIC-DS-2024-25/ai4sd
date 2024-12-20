"use client";
import styles from "@/app/page.module.css";
import "./gerald.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AssistantChat from "./chat";
import React from "react";
import { createChatSession } from "../services/gerald";

export default function Assistant({ addChatToHistory, chatHistoryLength, projectName }) {
    const handleNewChat = async () => {
        // Clear the URL hash to trigger new chat initialization
        window.location.hash = '';
        // Force page reload to reset chat state
        window.location.reload();
    };

    return (
        <div className={`${styles.assistantInteraction} assistantInteraction`}>
            <header>
                <div className="project-name">
                    <h2>{projectName}</h2>
                </div>
                <div className="button-row">
                    <a href="./">
                        <h2>
                            <i className="fas fa-sync-alt"></i> Change to another
                            Project
                        </h2>
                    </a>
                    <a href="#" onClick={handleNewChat}>
                        <h2>
                            <i className="fas fa-plus"></i> New Chat
                        </h2>
                    </a>
                    <a className="aboutus" href="">
                        <h2>About us</h2>
                    </a>
                </div>
            </header>
            <div className="main">
                <AssistantChat addChatToHistory={addChatToHistory} chatHistoryLength={chatHistoryLength} />
            </div>
        </div>
    );
}