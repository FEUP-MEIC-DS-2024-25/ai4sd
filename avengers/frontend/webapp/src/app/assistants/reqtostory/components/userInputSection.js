import React from "react";
import LanguageSelector from "./languageSelector";

export default function UserInputSection({
    userInput,
    setUserInput,
    file,
    setFile,
    error,
    setError,
    handleSubmit,
    isLoading,
    selectedLanguage,
    setSelectedLanguage
}) {
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5MB limit.");
                return;
            }

            const validExtensions = ["txt", "md", "csv"];
            const extension = selectedFile.name.split(".").pop().toLowerCase();
            if (!validExtensions.includes(extension)) {
                setError("Only text files (.txt, .md, .csv) are supported.");
                return;
            }

            setFile(selectedFile);
            setError("");
        }
    };

    return (
        <section className="bg-[#171717] text-[#e1e1e1] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 m-8 flex flex-col items-center gap-6">
            <h2>User Story Generator</h2>
            <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
            <textarea
                className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] block mx-auto p-8 w-[80%] resize-none"
                id="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter text or leave empty to upload a file."
                rows={5}
            />
            <div id="fileControlsContainer">
                <input
                    id="uploadButton"
                    type="file"
                    accept=".txt,.md,.csv"
                    onChange={handleFileChange}
                />
                {file && (
                    <button
                        id="deleteButton"
                        className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] px-4 py-2 ml-4"
                        onClick={() => setFile(null)}
                    >
                        <i className="fa fa-trash"></i> Remove File
                    </button>
                )}
            </div>
            {error && (
                <div
                    id="fileError"
                    className="text-[#ff4444] my-2 text-sm text-left"
                >
                    {error}
                </div>
            )}
            <button
                id="submitButton"
                className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-2xl m-4 p-2"
                onClick={handleSubmit}
            >
                {isLoading ? "Generating..." : "Generate User Stories"}
            </button>
        </section>
    );
}
