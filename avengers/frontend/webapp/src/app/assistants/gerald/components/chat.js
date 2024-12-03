import React, { useState, useRef, useEffect } from "react";
import AssistantForm from "./form.js";
import { sendMsg } from "../services/gerald";
import Message from "./message.js"

export default function AssistantChat(props) {
    const [messages, setMessages] = useState([]); // State to store the list of messages
    const messagesEndRef = useRef(null); // Ref for the end of the messages
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCallback = (newMessage) => {
        props.callback()
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to the list
        
        sendMsg(newMessage).then((response)=>{ setMessages((prevMessages) => [...prevMessages, response]);})
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div>
            <div className="scrollable">
                <div >
                    {messages.map((message, index) => (
                        <Message index={index} key ={index}>{message}</Message> // Render each message as a <p>
                    ))}
                </div>
                <div ref={messagesEndRef} /> 
            </div>
            <AssistantForm callback={handleCallback} />
        </div>
    );
};
