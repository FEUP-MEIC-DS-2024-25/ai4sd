import { useState } from "react";
import axios from "axios";
import styles from "@/app/page.module.css";

export default function NewMessageBlock({onSendMessage, onReceiveMessage, conversationId}) {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (message.trim()) {
            // Create the correct message object
            const newMessage = { 
                "currentConversation": conversationId,
                "newMessage":{
                    "authorName": "You",
                    "body": message,
                    "timestamp": new Date().toISOString(),
                    "isDeleted": false
                }
            }
            // Send the message to the server
            try {
                onSendMessage(newMessage);
                setMessage("");
                
                // Reset the height of the textarea
                const textarea = document.querySelector('textarea');
                if (textarea) {
                    textarea.style.height = 'auto';
                }
                
                const response = await axios.post("http://localhost:8000/chat", newMessage);
                onReceiveMessage(response);
                
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="flex flex-col justify-end items-center">
            <div className="min-h-20 w-full flex justify-center p-3 relative">
                <div className="w-full flex">
                    <textarea
                        className="flex-grow p-2 border border-gray-300 rounded resize-none overflow-hidden min-h-24 max-h-24 pr-10 mr-2"
                        placeholder="Type your message here..."
                        rows="1"
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="w-16 flex justify-center items-center border bg-[#6C757D] rounded" onClick={handleSend}>
                        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13V1m0 0L1 5m4-4 4 4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}