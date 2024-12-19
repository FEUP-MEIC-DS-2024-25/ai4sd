"use client";
import styles from "@/app/page.module.css";
import "./gerald.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AssistantChat from "./chat";
import React, { useEffect, useState } from "react";

export default function Assistant() {
    const [hasMsg, setHasMsg] = useState(false);
    const [code, setCode] = useState("");

    const checkUserToken = () => {
        const userToken = localStorage.getItem("userToken");
        const userTokenTime = localStorage.getItem("userTokenTime");
        if (userToken) {
            if (new Date().getTime() - userTokenTime < 3600000) {
                return userToken;
            } else {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userTokenTime");
                refreshUserToken();
            }
        }
        return null;
    };

    const refreshUserToken = () => {
        window.location.href = "http://localhost:8000/auth/github-login";
    };

    const getUserToken = () => {
        // get code from url
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        setCode(code);

        // save code to local storage
        if (code) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userTokenTime");
            localStorage.setItem("userToken", code);
            localStorage.setItem("userTokenTime", new Date().getTime());
        }
        return code;
    };

    const checkMsg = () => {
        setHasMsg(true);
    };

    useEffect(() => {
        getUserToken();
        const token = checkUserToken();
        if (!token) {
            refreshUserToken();
        }
    }, []);

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
