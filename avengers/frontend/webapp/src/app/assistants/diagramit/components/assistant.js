"use client"; 

import { useEffect, useRef, useState } from "react";
import Header from "./header";
import UserMessage from "./userMessage";
import MessageInput from "./messageInput";
import { sendMessage } from "../api/api";
import AiMessage from "./aiMessage";

export default function Assistant({ messages: initialMessages, title = "DIAGRAMIT", prompt = "Create a UML class diagram" }) {
    const [messages, setMessages] = useState(initialMessages || []); // Track messages state
    const [newMessage, setNewMessage] = useState(""); // Track new message input
    const [conversationId, setConversationId] = useState(null); // Track conversation ID
    const chatEndRef = useRef(null);

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    // Handle input change
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    // Handle message submit (when pressing Enter or clicking button)
    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const newMsg = {
                userMsg: true,
                body: newMessage,
                isDeleted: false,
            };
            setMessages((prevMessages) => [...prevMessages, newMsg]);

            /*sendMessage(newMessage, conversationId).then((response) => {
                handleAiResponse(response);
            }).catch((error) => {
                console.error(error);
            });*/

            //Mock ai response
            let response = {
                conversationId: "123",
                imageUrl: "https://cdn.prod.website-files.com/6308b9e1771b56be92fe7491/641873c631076ea3b4f46f1f_uml-class-diagram.png"
            };
            handleAiResponse(response);
            
            setNewMessage(""); // Clear input field
        }
    };

    const handleAiResponse = (response) => {
        // Update conversation ID if null
        if (!conversationId) {
            setConversationId(response.conversationId);
        }
        // Update messages with AI response
        let aiResponse = {
            userMsg: false,
            body: response.imageUrl,
            isDeleted: false,
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
    };

    return (
        <div
            className="flex flex-col h-full items-center"
            style={{ background: "#f8f8ff", fontFamily: "Montserrat" }}
        >
            <Header title={title} />
            {/* Chat Area */}
            <div className="flex-grow pb-4 overflow-y-auto w-full">
                {/* Messages */}
                <ul className="space-y-4 flex flex-col items-end w-full pr-4">
                    {messages?.filter(Boolean).map((message, index) =>
                        message.userMsg ? (
                            <UserMessage key={index} message={message} />
                        ) : (
                            <AiMessage key={index} message={message} />
                        )
                    )}
                </ul>
                <div ref={chatEndRef} />
            </div>

            <MessageInput
                handleMessageSubmit={handleMessageSubmit}
                handleInputChange={handleInputChange}
                newMessage={newMessage}
            />
        </div>
    );
}
