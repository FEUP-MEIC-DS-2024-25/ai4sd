"use client";
import styles from "@/app/page.module.css";
import "./gerald.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AssistantChat from "./chat";
import React, {  useEffect, useState } from "react";

export default function Assistant() {
    const [hasMsg, setHasMsg] = useState(false);

    const checkMsg = () => {
        setHasMsg(true);
    };

    return (
        <div className={`${styles.assistantInteraction} assistantInteraction`}>
            <header>
                <a href="project">
                    <h2>
                        <i className="fas fa-sync-alt"></i> Change to another
                        Project
                    </h2>
                </a>
                <a className="aboutus" href="">
                    <h2>About us</h2>
                </a>
            </header>
            <div className="main">
                {!hasMsg ? (
                    <div className="info">
                        <h1 className="">gerald.</h1>
                        <p className="">not your average assistant</p>
                    </div>
                ) : (
                        <></>
                    )}
                    <AssistantChat callback={checkMsg}></AssistantChat>
                </div>
            </div>
    );
}
