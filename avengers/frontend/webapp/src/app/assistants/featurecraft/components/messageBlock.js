import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styles from "@/app/page.module.css";

export default function MessageBlock({ messages, totalMessages, description }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="p-4 shadow-sm flex-grow h-full">
            <h2 className="text-xl font-bold mb-2">Your Conversation</h2>
            <p className="text-sm text-gray-60 mb-4">{description}</p>
            <div className="overflow-y-auto max-h-[63vh]">
                <ul className="space-y-2">
                    {messages.filter(Boolean).map((message, index) => (
                        <li key={index} className="p-2 bg-white rounded-md shadow-sm">
                            <p className="font-semibold">{message.authorName}</p>
                            <ReactMarkdown>{message.body}</ReactMarkdown>
                            <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                            {message.isDeleted && <p className="text-red-500">This message has been deleted</p>}
                        </li>
                    ))}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
        </div>
    );
}