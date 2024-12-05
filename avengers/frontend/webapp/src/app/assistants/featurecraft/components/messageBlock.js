import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "@/app/page.module.css";

export default function MessageBlock({ messages, totalMessages, description }) {
    const [selectedText, setSelectedText] = useState('');
    const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleMouseUp = () => {
        const selectedText = window.getSelection().toString();
        if (selectedText.trim()) {
            setSelectedText(selectedText);
            const { top, bottom, right } = window.getSelection().getRangeAt(0).getBoundingClientRect();
            const middle = (top + bottom) / 2;
            setSelectionPosition({ top: middle + window.scrollY, left: right + window.scrollX });
        } else {
            setSelectedText('');
        }
    };

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <div className="p-4 shadow-sm flex-grow h-full">
            <h2 className="text-xl font-bold mb-2">Your Conversation</h2>
            <p className="text-sm text-gray-60 mb-4">{description}</p>
            <div className="overflow-y-auto max-h-[63vh]">
                <ul className="space-y-2">
                    {messages.filter(Boolean).map((message, index) => (
                        <li key={index} className="p-2 bg-white rounded-md shadow-sm">
                            <p className="font-semibold p-2">{message.authorName}</p>
                            <div className="message-selectable hover:bg-gray-50 p-2 rounded-md" onMouseUp={handleMouseUp}>
                                <ReactMarkdown>{message.body}</ReactMarkdown>
                            </div>
                            <p className="text-xs text-gray-500 p-2">{new Date(message.timestamp).toLocaleString()}</p>
                            {message.isDeleted && <p className="text-red-500">This message has been deleted</p>}
                        </li>
                    ))}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
            {selectedText && (
                <div
                    className="absolute p-2 rounded-md"
                    style={{
                        top: selectionPosition.top,
                        left: selectionPosition.left,
                    }}
                >
                    <button
                        className="bg-blue-400 shadow-md text-white py-2 px-3 rounded-md"
                        onClick={handleButtonClick}
                    >
                        Pin
                    </button>
                </div>
            )}
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1">
                    <div className="bg-white p-4 rounded-md shadow-md w-[50vw] h-[50vh]">
                        <button
                            className="mt-4 bg-blue-500 text-white py-1 px-2 rounded-md"
                            onClick={handleClosePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}