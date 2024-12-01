"use client";

import React, { useState } from "react";
import { generateContent } from "./services/apiService";

const Chat = ({ assistantId }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    try {
      const result = await generateContent(prompt, assistantId);
      setResponse(result.message || result);
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred. Please try again.");
    }
  };

  return (
    <div className="chat">
      <h3>Chat with {assistantId}</h3>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate</button>
      <div className="chat-response">
        <h4>Response:</h4>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chat;
