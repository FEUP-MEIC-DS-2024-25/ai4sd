"use client"; // This makes the file a client component

import React, { useState } from "react";
import Chat from "./Chat";
import FileUpload from "./FileUpload";
import "./styling.css"; // Ensure your styling file is imported

const App = () => {
  const [selectedAssistant, setSelectedAssistant] = useState("PatternPartner");
  const [history, setHistory] = useState([]);

  const handleSelectAssistant = (id) => {
    setSelectedAssistant(id);
    setHistory([]); // Reset history when switching
  };

  return (
    <div className="app">
      <div className="main-content">
        <Chat assistantId={selectedAssistant} />
        <FileUpload />
      </div>
    </div>
  );
};

export default App;
