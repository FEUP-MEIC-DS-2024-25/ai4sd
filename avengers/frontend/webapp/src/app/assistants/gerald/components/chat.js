import React, { useState, useRef, useEffect } from "react";
import AssistantForm from "./form.js";
import { createProject, getMessages, createChatSession, generateResponse, uploadFile } from "../services/gerald";
import Message from "./message.js"
import LoadingDots from "./loadingDots.js";

export default function AssistantChat(props) {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCallback = async (message, files) => {
        props.callback();
        setIsLoading(true);
        
        if (message) {
            setMessages(prev => [...prev, { text: message, attachments: files }]);
        }
    
        try {
            if (files.length > 0) {
                for (const file of files) {
                    await uploadFile(sessionId, file);
                }
            }
    
            if (message || files.length > 0) {
                const response = await generateResponse(sessionId, message || "Please process the uploaded files.");
                setMessages(prev => [...prev, { text: response, attachments: [] }]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeChat = async () => {
            if (!sessionId) {
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
                            <Message index={index} key={index} attachments={message.attachments}>{message.text}</Message>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            ) : <></>}
            {isLoading && <LoadingDots />}
            <AssistantForm callback={handleCallback} isLoading={isLoading} />
        </div>
    );
};