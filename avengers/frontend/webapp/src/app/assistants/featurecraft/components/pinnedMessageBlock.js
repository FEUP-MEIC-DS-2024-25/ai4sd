import { useState } from "react";
import DeleteButton from "@/app/assistants/featurecraft/components/ui/deleteButton";
import deletePinnedMessage from "@/app/assistants/featurecraft/hooks/useAssistPinDelete";
import exportPinnedMessages from "@/app/assistants/featurecraft/hooks/useAssistPinExport";
import Loading from "@/app/assistants/featurecraft/components/ui/loading";
import ReactMarkdown from "react-markdown";
import useAssistPinSend from "@/app/assistants/featurecraft/hooks/useAssistPinSend";
import axios from "axios";

export default function PinnedMessagesBlock({ pinnedMessages, conversationId, setPinnedMessages, setError }) {
    const [isHidden, setIsHidden] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [deletingMessageId, setDeletingMessageId] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);  // Track the message being edited
    const [editedMessage, setEditedMessage] = useState("");  // Store the new message for editing
    const { handleEditPin  } = useAssistPinSend();

    const toggleView = () => {
        setIsHidden(!isHidden);
    };

    const handleEditClick = (messageId, currentMessage) => {
        setEditingMessageId(messageId);  // Set the message to be edited
        setEditedMessage(currentMessage);  // Set the current message as the default text in the input
    };

    const handleExport = async () => {
        setIsExporting(true);
        await exportPinnedMessages(conversationId, setError);
        setIsExporting(false);
    };

    const handleDelete = async (messageId) => {
        setDeletingMessageId(messageId);
        await deletePinnedMessage(conversationId, messageId, setPinnedMessages, setError);
        setDeletingMessageId(null);
    };

    /* const handleSaveEdit = async () => {
        if (editedMessage.trim()) {
            try {
                console.log(conversationId)
                // Make the API call to update the pinned message
                const response = await axios.put(`http://localhost:8080/chat/pin/${conversationId}`, {
                    pinned_id: editingMessageId,
                    message: editedMessage,
                });
                console.log(conversationId)
                console.log(response)
                if (response.status === 200) {
                    // Update the pinnedMessages state with the new message
                    const updatedMessages = pinnedMessages.map((msg) =>
                        msg.id === editingMessageId ? { ...msg, message: editedMessage } : msg
                    );
                    setPinnedMessages(updatedMessages);
                    setEditingMessageId(null);  // Stop editing
                }
            } catch (error) {
                console.error("Failed to update pinned message", error);
            }
        }
    };
 */
    const handleSaveEdit = async () => {
        if (editedMessage.trim()) {
            try {
                console.log(editingMessageId)
                // Use the correct API call from the custom hook
                const response = await handleEditPin( editingMessageId, editedMessage,conversationId);
                if (response.status === 200) {
                    // Update pinned messages state after successful API call
                    const updatedMessages = pinnedMessages.map((msg) =>
                        msg.id === editingMessageId ? { ...msg, message: editedMessage } : msg
                    );
                    //setPinnedMessages(updatedMessages);
                    setEditingMessageId(null); // Stop editing
                } else {
                    console.error("Failed to update pinned message:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating pinned message:", error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);  // Cancel editing
        setEditedMessage("");  // Reset the message input
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
                    <div className="flex gap-2">
                        {isExporting ? (
                            <Loading />
                        ) : (
                            <button onClick={handleExport} className="text-blue-500">
                                <svg className="h-12 w-12 text-gray-500" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M0 0h24v24H0z" stroke="none" />
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                    <path d="M7 11l5 5l5 -5" />
                                    <path d="M12 4v12" />
                                </svg>
                            </button>
                        )}
                        <button onClick={toggleView} className="text-blue-500">
                            <svg className="h-12 w-12 text-gray-500" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M0 0h24v24H0z" stroke="none" />
                                <rect x="4" y="4" width="16" height="16" rx="2" />
                                <line x1="15" y1="4" x2="15" y2="20" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[63vh] pb-4">
                    <ul className="space-y-2">
                        {pinnedMessages.map((pinnedMessage) => (
                            <li key={pinnedMessage.id} className="p-2 bg-white rounded-md shadow-sm max-w-96">
                                {editingMessageId === pinnedMessage.id ? (
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={editedMessage}
                                            onChange={(e) => setEditedMessage(e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                        <button onClick={handleSaveEdit} className="bg-blue-500 text-white p-2 rounded">
                                            Save
                                        </button>
                                        <button onClick={handleCancelEdit} className="bg-gray-300 p-2 rounded">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{pinnedMessage.message}</p>
                                        <button onClick={() => handleEditClick(pinnedMessage.id, pinnedMessage.message)} className="text-blue-500">
                                            Edit
                                        </button>
                                    </div>
                                )}
                                {deletingMessageId === pinnedMessage.id ? (
                                    <Loading />
                                ) : (
                                    <DeleteButton onClick={() => handleDelete(pinnedMessage.id)} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}