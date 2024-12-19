import React, { useState, useRef, useEffect } from "react";
import AssistantForm from "./form.js";
import { createProject, getMessages, createChatSession, generateResponse } from "../services/gerald";
import Message from "./message.js"

export default function AssistantChat(props) {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCallback = async (newMessage) => {
        props.callback();
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const response = await generateResponse(sessionId, newMessage);
        setMessages((prevMessages) => [...prevMessages, response]);
    };

    useEffect(() => {
        const initializeChat = async () => {
            if (!sessionId) {
                // Call createProject function
                const results = await createProject('tomasM30', 'testRepo');
                const chat = await createChatSession(results.id);
                setSessionId(chat);
            }
        };
        initializeChat();
        scrollToBottom();
    }, [messages, sessionId]);

    return (
        <div>
            {messages.length > 0 ? (
                <div className="scrollable">
                    <div>
                        {messages.map((message, index) => (
                            <Message index={index} key={index}>{message}</Message>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            ) : <></>}
            <AssistantForm callback={handleCallback} />
        </div>
    );
};