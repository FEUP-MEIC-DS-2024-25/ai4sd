"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import logoDiagramIt from "../components/logoDiagramIt.png"
import Image from "next/image";

export default function Assistant({ messages: initialMessages, title = "DIAGRAMIT", prompt = "Create a UML class diagram" }) {
    const [messages, setMessages] = useState(initialMessages || []); // Track messages state
    const [newMessage, setNewMessage] = useState(""); // Track new message input
    const chatEndRef = useRef(null);

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
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
                authorName: "You", 
                body: newMessage,
                isDeleted: false
            };

            // Add the new message to the list and reset input field
            setMessages((prevMessages) => [...prevMessages, newMsg]);
            setNewMessage(""); // Clear the input field after submission
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <header className="p-4 bg-white shadow-md flex items-center justify-between">
                {/* Title */}
                <h1 className="text-xl font-bold text-blue-600">{title}</h1>

                {/* Logo */}
                <Image
                    src={logoDiagramIt}
                    alt="Logo"
                    className="h-8 w-14.1 mb-1"
                />
            </header>
            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="mb-4 p-4 bg-gray-200 rounded-lg">
                    <p>{prompt}</p>
                </div>

                <ul className="space-y-4">
                    {messages?.filter(Boolean).map((message, index) => (
                        <li key={index} className="p-4 bg-white rounded-lg shadow-md text-black">
                            <p>{message.body}</p>
                            {message.isDeleted && (
                                <p className="text-red-500">This message has been deleted</p>
                            )}
                            {/* Author Name - Positioned Below and Aligned Right */}
                            <p className="text-xs text-gray-500 text-right">{message.authorName}</p>
                        </li>
                    ))}
                    {/* Scroll Anchor */}
                    <div ref={chatEndRef} />
                </ul>
            </div>

            {/* Footer */}
            <footer className="p-4 bg-white shadow-md">
                <form onSubmit={handleMessageSubmit} className="w-full">
                    <input
                        type="text"
                        placeholder="Type a new message here"
                        value={newMessage} // Bind input field value to newMessage state
                        onChange={handleInputChange} // Update state on input change
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleMessageSubmit(e); // Trigger message submit on Enter
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // Add text-black for black text
                    />
                </form>
            </footer>
        </div>
    );
}
