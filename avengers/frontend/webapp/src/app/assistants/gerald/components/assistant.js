'use client';
import styles from "@/app/page.module.css";
import "./gerald.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import AssistantChat from "./chat";
import React from "react";

export default function Assistant() {
    return (
        <div className={`${styles.assistantInteraction} assistantInteraction`}>
            <header>
                <a href="">
                    <h2><i className="fas fa-sync-alt"></i> Change to another Project</h2>
                </a>
                <a className="aboutus" href="">
                    <h2>About us</h2>
                </a>
            </header>
            <div className="main">
                <AssistantChat />
            </div>
        </div>
    );
}