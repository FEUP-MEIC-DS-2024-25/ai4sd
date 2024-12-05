import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (input) formData.append("content", input);

    try {
      const response = await fetch("http://localhost:5000/Chat", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setMessages((prev) => [...prev, jsonResponse.content]);
      } else {
        throw new Error("POST request failed");
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

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Ask a Question Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Ask a Question</h2>
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white text-black"
            />
        <button
          type="submit"
          className="button"
        >
          Send
        </button>
      </form>

      {/* Upload File Form */}
      <form onSubmit={handleSubmitFile} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Upload a File</h2>
        <input
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files ? e.target.files[0] : null;
            setFile(selectedFile);
          }}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="button"
        >
          Send File
        </button>
      </form>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full max-w-md bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="bg-primary text-xs leading-none py-1 text-center text-white"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Response Section */}
      {response && (
        <div className="prose mt-6 max-w-full">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-box w-full max-w-md bg-gray-50 p-4 rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message bg-blue-100 p-2 my-2 rounded-lg">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
