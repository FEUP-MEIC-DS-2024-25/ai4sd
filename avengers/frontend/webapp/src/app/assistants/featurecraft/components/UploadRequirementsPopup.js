import React, { useState } from "react";
import { getConversationData } from "./messageBlock";
import useAssistPinSend from "@/app/assistants/featurecraft/hooks/useAssistPinSend";
import messageBlock from "@/app/assistants/featurecraft/components/messageBlock";

export default function UploadRequirementsPopup({ onClose, conversationId, pinnedMessages, setPinnedMessages }) {
    const [fileContent, setFileContent] = useState([]);
    const [newRequirement, setNewRequirement] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [error, setError] = useState("");
    const { handleSendPin, updatePinnedMessages } = useAssistPinSend();


    const handlePinMessage = async (array) => {
        const response = await handleSendPin(array, conversationId);
        if (response.status === 200) {
            updatePinnedMessages(pinnedMessages, setPinnedMessages, response.data);
        } else {
            setError(response);
            console.error(response); // TODO - handle
        }

    };


    // Handles file upload and processing
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Assume the file contains newline-separated strings
                const lines = e.target.result
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean);
                setFileContent(lines);
            };
            reader.readAsText(file);
        }
    };

    // Handles adding a new requirement
    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            setFileContent([...fileContent, newRequirement.trim()]);
            setNewRequirement("");
        }
    };

    // Handles clearing all requirements
    const handleClearRequirements = () => {
        setFileContent([]);
    };

    // Handles starting to edit a specific requirement
    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingValue(fileContent[index]);
    };

    // Handles saving the edited requirement
    const saveEditedRequirement = (index) => {
        const updatedContent = [...fileContent];
        updatedContent[index] = editingValue;
        setFileContent(updatedContent);
        setEditingIndex(null);
        setEditingValue("");
    };

    // Handles deleting a specific requirement
    const handleDeleteRequirement = (index) => {
        const updatedContent = fileContent.filter((_, i) => i !== index);
        setFileContent(updatedContent);
    };

    // Handles finishing and logging all requirements
    const handleFinish = async () => {
        await handlePinMessage(fileContent);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-3/5 h-auto max-h-[80%] rounded-2xl shadow-lg flex flex-col">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Uploaded Strings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-4">
                    {fileContent.length > 0 ? (
                        <ul className="space-y-2">
                            {fileContent.map((line, index) => (
                                <li
                                    key={index}
                                    className="p-2 bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
                                >
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEditedRequirement(index);
                                            }}
                                            className="flex-1 bg-white border p-2 focus:outline-none rounded-md"
                                        />
                                    ) : (
                                        <span className="flex-1 overflow-hidden text-ellipsis">{line}</span>
                                    )}
                                    <div className="ml-4 flex space-x-2">
                                        {editingIndex === index ? (
                                            <button
                                                onClick={() => saveEditedRequirement(index)}
                                                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(index)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteRequirement(index)}
                                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No data uploaded yet. Please upload a file below.</p>
                    )}
                </div>

                {/* Add Requirement Section */}
                <div className="p-4 border-t flex items-center">
                    <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add new requirement"
                        className="flex-1 mr-4 p-2 border rounded-md bg-white"
                    />
                    <button
                        onClick={handleAddRequirement}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>

                {/* File Upload, Clear, and Finish Section */}
                <div className="p-4 border-t flex flex-wrap justify-between items-center gap-2">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleClearRequirements}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleFinish}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
