import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "@/app/page.module.css";
import UploadRequirementsPopup from "./UploadRequirementsPopup";

export default function NewMessageBlock({ onSendMessage, onReceiveMessage, conversationId, pinnedMessages, setPinnedMessages }) {
    const [message, setMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const handleSend = async () => {
        if (message.trim()) {

            let newMessageBody = message;
            let pinned = [];

            if (pinnedMessages) {
                pinned = pinnedMessages.map(item => item.message);
            }

            const newMessage = {
                "currentConversation": conversationId,
                "newMessage": {
                    "authorName": "You",
                    "body": newMessageBody,
                    "timestamp": new Date().toISOString(),
                    "isDeleted": false,
                    "pinnedMessages": pinned
                }
            };

            // Send the message to the server
            try {
                onSendMessage(newMessage);
                setMessage("");
                // Reset the height of the writable container
                const writableContainer = document.querySelector('[contentEditable]');
                if (writableContainer) {
                    writableContainer.style.height = 'auto';
                }
                const response = await axios.post("https://superhero-03-01-150699885662.europe-west1.run.app/chat", newMessage);
                //const response = await axios.post("http://localhost:8080/chat", newMessage);
                onReceiveMessage(response);

            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="flex flex-col justify-end items-center bg-white max-h-[80%]">
            <div className="min-h-20 w-full flex flex-col justify-center p-3">
                <div className={`p-2 border rounded-xl ${isFocused ? 'border-gray-500' : 'border-gray-300'}`}>
                    <textarea
                        ref={textareaRef}
                        className={`flex-grow p-2 w-full rounded resize-none min-h-12 max-h-20 ${isFocused ? ' bg-gray-100' : 'bg-white'} text-black focus:outline-none`}
                        placeholder="Type your message here..."
                        value={message} // Add this line
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                            setMessage(e.target.value);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && message.trim() !== '') {
                                e.preventDefault();
                                document.getElementById('sendButton').click();
                            }
                        }}
                    />
                    <div className=" flex justify-between mt-2">
                        <button
                            className="w-12 h-12 flex justify-center items-center bg-blue-400 rounded-xl"
                            onClick={() => setIsPopupVisible(true)}
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 17V7a4 4 0 1 1 8 0v10a6 6 0 1 1-12 0V7"
                                />
                            </svg>
                        </button>
                        {isPopupVisible && (
                            <UploadRequirementsPopup onClose={() => setIsPopupVisible(false)} conversationId={conversationId} pinnedMessages={pinnedMessages} setPinnedMessages={setPinnedMessages} />
                        )}
                        <button id="sendButton" className="w-12 h-12 flex justify-center items-center bg-blue-400 rounded-xl"
                            onClick={handleSend}>
                            <svg className="h-8 w-8 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                                <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}