import React, { useState, useRef, useEffect } from "react";
import AssistantForm from "./form.js";
import { createProject, getMessages, createChatSession, generateResponse, uploadFile, listChatSessions, getProjectSessions } from "../services/gerald";
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

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const newSessionId = hash.replace('#', '');
                setSessionId(newSessionId);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check initial hash

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const fetchChat = async (chatSessionId) => {
        if (!chatSessionId) return;
        setMessages([]); // Clear previous messages
        const fetchedMessages = await getMessages(chatSessionId);
        setMessages(fetchedMessages.map(msg => ({
            text: msg.content,
            attachments: []
        })));
    };

    const handleCallback = async (message, files) => {
        setIsLoading(true);
        
        try {
            if (!sessionId) {
                const newSessionId = await createChatSession(132);
                setSessionId(newSessionId);
                window.location.hash = newSessionId;
            }

            if (message) {
                setMessages(prev => [...prev, { text: message, attachments: files }]);
            }
    
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
        if (sessionId) {
            fetchChat(sessionId);
        } else {
            const initializeChat = async () => {
                const chatList = await listChatSessions(132);
                if (chatList.length > 0) {
                    setSessionId(chatList[0].session_id);
                }
            };
            initializeChat();
        }
        scrollToBottom();
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            ) : (
                <div className="info">
                    <h1 className="">gerald.</h1>
                    <p className="">not your average assistant</p>
                </div>
            )}
            {isLoading && <LoadingDots />}
            <AssistantForm callback={handleCallback} isLoading={isLoading} />
        </div>
    );
};