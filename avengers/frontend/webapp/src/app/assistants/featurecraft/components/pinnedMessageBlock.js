import { useState } from "react";
import DeleteButton from "@/app/assistants/featurecraft/components/ui/deleteButton";
import deletePinnedMessage from "@/app/assistants/featurecraft/hooks/useAssistPinDelete";

export default function PinnedMessagesBlock({ pinnedMessages, conversationId, setPinnedMessages, setError }) {
    const [isHidden, setIsHidden] = useState(true);

    const toggleView = () => {
        setIsHidden(!isHidden);
    };

    if (isHidden) {
        return (
            <div className="w-fit h-full">
                <div className="p-4 shadow-sm h-full flex justify-end items-start">
                    <button onClick={toggleView} className="text-blue-500">
                        <svg className="h-12 w-12 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <line x1="15" y1="4" x2="15" y2="20" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    if (!pinnedMessages || pinnedMessages.length === 0) {
        return (
            <div className="w-fit h-full">
                <div className="p-4 shadow-sm h-full">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold w-80">Pinned Messages</h2>
                        <button onClick={toggleView} className="text-blue-500">
                            <svg className="h-12 w-12 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <rect x="4" y="4" width="16" height="16" rx="2" />
                                <line x1="15" y1="4" x2="15" y2="20" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-500">No pinned messages available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-fit h-full">
            <div className="p-4 shadow-sm h-full">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold w-80">Pinned Messages</h2>
                    <button onClick={toggleView} className="text-blue-500">
                        <svg className="h-12 w-12 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <line x1="15" y1="4" x2="15" y2="20" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[63vh] pb-4">
                    <ul className="space-y-2">
                        {pinnedMessages.map((pinnedMessage, index) => (
                            <li key={index} className="p-2 bg-white rounded-md shadow-sm max-w-96">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{pinnedMessage.message}</p>
                                    <DeleteButton onClick={() => deletePinnedMessage(conversationId, pinnedMessage.id, setPinnedMessages, setError)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
