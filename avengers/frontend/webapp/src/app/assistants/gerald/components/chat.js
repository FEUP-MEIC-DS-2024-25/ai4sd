import React, { useState, useRef, useEffect } from "react";
import AssistantForm from "./form.js";
import { createProject, getMessages, createChatSession, generateResponse, uploadFile, listChatSessions, getProjectSessions, downloadRepo, getProjectId, repoExists } from "../services/gerald";
import Message from "./message.js"
import LoadingDots from "./loadingDots.js";
import LoadingPopup from "./loadingPopup.js";

export default function AssistantChat({ addChatToHistory, chatHistoryLength }) {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
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

    const processMessageAndFiles = async (message, files, currentSessionId) => {
        if (!currentSessionId) {
            const newSessionId = await createChatSession(projectId);
            setSessionId(newSessionId);
            currentSessionId = newSessionId;

            // Add new chat session to history
            addChatToHistory({
                text: `Chat ${chatHistoryLength + 1}`,
                link: `#${newSessionId}`,
                session_id: newSessionId
            });
        }

        if (files.length > 0) {
            for (const file of files) {
                await uploadFile(currentSessionId, file);
            }
        }

        const response = await generateResponse(currentSessionId, message || "Please process the uploaded files.");
        setMessages(prev => [...prev, { text: response, attachments: [] }]);
    };

    const handleCallback = async (message, files) => {
        if (!projectId) {
            console.error("Project ID not initialized");
            return;
        }

        setIsLoading(true);
        
        try {
            if (message || files.length > 0) {
                setMessages(prev => [...prev, { text: message, attachments: files }]);
            }
            await processMessageAndFiles(message, files, sessionId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const url_session_id = window.location.hash.replace('#', '');
        if (url_session_id) {
            fetchChat(sessionId);
            setIsInitializing(false);
        } else {
            const initializeChat = async () => {
                const downloaded = await repoExists();
                if (!downloaded) {
                    await downloadRepo();
                    let proj_id = await createProject();
                    setProjectId(proj_id.id);
                    console.log(proj_id);
                } else{
                    let proj_id = await getProjectId();
                    setProjectId(proj_id);
                    console.log(proj_id);
                }

            };
            initializeChat().then(() => {
                scrollToBottom();
                setIsInitializing(false);
            });
        }
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div>
            {isInitializing && <LoadingPopup />}
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