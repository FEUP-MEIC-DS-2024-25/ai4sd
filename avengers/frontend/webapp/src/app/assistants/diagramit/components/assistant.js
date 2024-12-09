"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import Header from "./header";
import UserMessage from "./userMessage";
import MessageInput from "./messageInput";

export default function Assistant({ messages: initialMessages, title = "DIAGRAMIT", prompt = "Create a UML class diagram" }) {
    const [messages, setMessages] = useState(initialMessages || []); // Track messages state
    const [newMessage, setNewMessage] = useState(""); // Track new message input
    const chatEndRef = useRef(null);

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth",  block: 'end' });
        }
    }, [messages]);

    // Handle input change
    const handleInputChange = (e) => {
        setNewMessage(e.target.value); // Update the newMessage state as you type
    };

    // Handle message submit (when pressing Enter or clicking button)
    const handleMessageSubmit = (e) => {
        e.preventDefault(); 
        if (newMessage.trim()) {
            const newMsg = {
                userMsg: true, // Set to true for user messages
                body: newMessage,
                isDeleted: false
            };

            // Add the new message to the list and reset input field
            setMessages((prevMessages) => [...prevMessages, newMsg]);
            setNewMessage(""); // Clear the input field after submission
        }
    };

    return (
        <div className="flex flex-col h-full items-center" style={{background: "#f8f8ff", fontFamily: "Montserrat"}}>
            <Header title={title} />
            {/* Chat Area */}
            <div className="flex-grow pb-4 overflow-y-auto" style={{maxWidth: "1250px"}}>
                {/*<p className="italic text-center mb-4" style={{color: "#02040F"}}>{prompt}</p>*/}

                {/* Messages */}
                <ul className="space-y-4 flex flex-col">
                    {messages?.filter(Boolean).map((message, index) => (
                        message.userMsg ? <UserMessage message={message} index={index} />
                        : <p key={index}>Assistant</p>
                    ))}
                    {/* Scroll Anchor */}
                    <div ref={chatEndRef} />
                </ul>
            </div>

            <MessageInput handleMessageSubmit={handleMessageSubmit} handleInputChange={handleInputChange} newMessage={newMessage} />
        </div>
    );
}
