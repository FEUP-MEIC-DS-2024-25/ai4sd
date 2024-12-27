"use client";
import styles from "@/app/page.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import { marked } from "marked";

export default function UnitTestAssistant() {
  const [functionCode, setFunctionCode] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [unitTestsContent, setUnitTestsContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const handleGenerateTests = async () => {
    setError("");
    try {
        const response = await axios.post("https://superhero-07-02-150699885662.europe-west1.run.app/api/generate_tests", {
            function_code: functionCode,
            file_content: fileContent,
            });
        setUnitTestsContent(response.data.unit_tests);
    } catch (err) {
        setError(`Error generating tests: ${err.message}`);
    }
  };

  useEffect(() => {
    // Highlight code blocks whenever unitTestsContent changes
    if (resultRef.current) {
      const codeBlocks = resultRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [unitTestsContent]);

  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "text/x-python") {
      handleFileRead(file);
    } else {
      alert("Please upload a valid file.");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileRead(file);
  };

  const handleRemoveFile = () => {
    setFileName("");
    setFileContent("");
    // Reset the file input
    if (document.getElementById("file-input")) {
      document.getElementById("file-input").value = "";
    }
  };

  const handleSaveToFile = () => {
    if (!unitTestsContent) {
      alert("No content to save. Generate tests first.");
      return;
    }
    const blob = new Blob([unitTestsContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unit_tests.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full flex flex-col overflow-y-auto">
      <div className="flex-shrink-0 bg-gray-100 flex flex-col items-center p-4 sm:p-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 mb-4 sm:mb-6 text-center">
          Unit Test Assistant
        </h1>
        <div className="w-full md:w-5/6 space-y-4">
          <div className="flex space-x-4">
            <textarea
              value={functionCode}
              onChange={(e) => setFunctionCode(e.target.value)}
              placeholder="Enter your code here..."
              className="w-3/4 p-2 sm:p-4 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 sm:h-auto resize-y"
            />
            <div
              className={`w-1/4 p-4 border-dashed text-gray-600 border-2 border-gray-400 rounded-lg text-center cursor-pointer bg-white relative ${fileName ? 'border-green-500' : ''}`}
              onClick={() => document.getElementById("file-input").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              {fileName ? (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-700 mb-2 truncate max-w-full">
                    {fileName}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="absolute top-1 right-1 px-1 py-0.5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-gray-500">
                    Click to change file
                  </p>
                </div>
              ) : (
                "Upload file"
              )}
            </div>
          </div>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <div className="flex justify-center">
            <button
              onClick={handleGenerateTests}
              className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Generate Unit Tests
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow bg-gray-100 flex flex-col items-center p-4 sm:p-6 overflow-y-auto">
        <div 
          ref={resultRef}
          className="w-full md:w-5/6 bg-gray-800 p-4 rounded-lg shadow-md overflow-auto max-h-[50vh]"
        >
          {unitTestsContent ? (
            <div
              dangerouslySetInnerHTML={{
                __html: marked(unitTestsContent),
              }}
              className="prose prose-invert"
            />
          ) : (
            error && <p className="text-red-500">{error}</p>
          )}
        </div>
        {unitTestsContent && (
          <button
            onClick={handleSaveToFile}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Save to File
          </button>
        )}
      </div>
    </div>
  );
}