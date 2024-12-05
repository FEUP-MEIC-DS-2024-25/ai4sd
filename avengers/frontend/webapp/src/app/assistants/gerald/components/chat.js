import React, { useState, useRef, useEffect } from "react";
import AssistantForm from "./form.js";
import { sendMsg } from "../services/gerald";
import Message from "./message.js"

export default function AssistantChat(props) {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCallback = (newMessage) => {
        props.callback()
        setMessages((prevMessages) => [...prevMessages, newMessage]); 
        
        sendMsg(newMessage).then((response)=>{ setMessages((prevMessages) => [...prevMessages, response]);})
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div>
            {messages.length>0 ?(<div className="scrollable">
                <div >
                    {messages.map((message, index) => (
                        <Message index={index} key ={index}>{message}</Message>
                    ))}
                </div>
                <div ref={messagesEndRef} /> 
            </div>
            ):<></>}
            <AssistantForm callback={handleCallback} />
        </div>
    );
};
