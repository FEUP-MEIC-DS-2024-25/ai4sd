import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import "./App.css";

const App = () => {
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!input) {
      console.error("Input is required");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ content: input }), // Convert input to JSON
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        setMessages((prev) => [...prev, jsonResponse.content]); // Append response to messages
      } else {
        const errorDetails = await response.text();
        throw new Error(`POST request failed: ${errorDetails}`);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  

  const handleSubmitFile = async (event) => {
    event.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("http://localhost:5000/UploadFile", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const jsonResponse = await uploadResponse.json();
        console.log("File upload successful:", jsonResponse);
        trackProgress();
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const trackProgress = async () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:5000/progress");
        if (response.ok) {
          const jsonResponse = await response.json();
          setProgress(jsonResponse.status);
          setResponse((prevResponse) =>
            jsonResponse.result.startsWith(prevResponse)
              ? jsonResponse.result
              : prevResponse + jsonResponse.result
          );
          if (jsonResponse.status === 100) {
            clearInterval(interval);
          }
        } else {
          throw new Error("Failed to fetch progress");
        }
      } catch (error) {
        console.error("Error during progress tracking:", error);
        clearInterval(interval);
      }
    }, 500);
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages, response, or progress changes
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, response, progress]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Combined Messages and Response Section */}
      <div className="chat-box w-full max-w-4xl bg-gray-50 p-6 rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message bg-blue-100 p-2 my-2 rounded-lg">
            {msg}
          </div>
        ))}
        {response && (
          <div className="prose mt-6 max-w-full">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
      <div className="form-container">
        {/* Ask a Question Form */}
        <form onSubmit={handleSubmit} className="form-box">
          <h2>Ask a Question</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="input-field"
          />
          <button type="submit" className="button">Send</button>
        </form>

        {/* Upload File Form */}
        <form onSubmit={handleSubmitFile} className="form-box">
          <h2>Upload a File</h2>
          <input
            type="file"
            onChange={(e) => {
              const selectedFile = e.target.files ? e.target.files[0] : null;
              setFile(selectedFile);
            }}
            className="input-field"
          />
          <button type="submit" className="button">Send File</button>
        </form>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default App;
