import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "@/app/page.module.css";
import useAssistPinSend from "@/app/assistants/featurecraft/hooks/useAssistPinSend";
import DeleteButton from "@/app/assistants/featurecraft/components/ui/deleteButton";

export default function MessageBlock({ messages, totalMessages, description, conversationId, pinnedMessages, setPinnedMessages }) {

    const [selectedText, setSelectedText] = useState('');
    const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [error, setError] = useState("");
    const [showFullDescription, setShowFullDescription] = useState(false);

    const { handleSendPin, updatePinnedMessages } = useAssistPinSend();

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

    const handlePinMessage = async () => {
        const response = await handleSendPin([selectedText], conversationId);
        if (response.status === 200) {
            updatePinnedMessages(pinnedMessages, setPinnedMessages, response.data);
            setIsPopupVisible(false);
            setSelectedText('');
        } else {
            setError(response);
            console.error(response); // TODO - handle
        }

    };

    const truncateDescription = (text, wordLimit) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    const displayedDescription = showFullDescription ? description : truncateDescription(description, 20);


    return (
        <div className="p-4 shadow-sm flex-grow h-full">
            <div className="flex items-center">
                <div className="ml-2 mr-2">
                    <DeleteButton onClick={() => console.log('delete')} color="text-gray-500" size="h-8 w-8" />
                </div>
                <div className="">
                    <h2 className="text-xl font-bold">Your Conversation</h2>
                </div>
                
            </div>
            <div className="text-sm text-gray-600 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="inline">{displayedDescription}</p>
                    {description.split(' ').length > 20 && (
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="inline-flex text-blue-500 hover:text-blue-700 text-sm"
                        >
                            {showFullDescription ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </div>
            </div>
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
                        Pin Message
                    </button>
                </div>
            )}
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1">
                    <div className="bg-white p-4 rounded-md shadow-md w-[50vw] h-[50vh] flex flex-col">
                        <textarea
                            className="flex-grow p-2 border rounded-md"
                            value={selectedText}
                            onChange={(e) => setSelectedText(e.target.value)}
                        />
                        <div className="mt-4 flex justify-center space-x-2">
                            <button
                                className="bg-[#212529] text-white py-1 px-2 rounded-md w-32"
                                onClick={handleClosePopup}
                            >
                                Close
                            </button>
                            <button
                                className="bg-[#6C757D] text-white py-1 px-2 rounded-md w-32"
                                onClick={handlePinMessage}
                            >
                                Pin Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}