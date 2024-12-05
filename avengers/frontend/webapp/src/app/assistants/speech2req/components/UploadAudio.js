"use client";

import React, { useState } from "react";

const UploadAudio = ({ setTranscription }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("/api/your_assistant/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.transcription) {
      setTranscription(data.transcription);
    }
    console.log(data);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <input 
        type="file" 
        accept="audio/mp3" 
        style = {{
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "4px",
        }}
        className="form-control" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button 
        className="btn btn-primary w-50 align-self-center" 
        onClick={handleSubmit}
      >
        Upload and Transcribe
      </button>
    </div>
  );
};

export default UploadAudio;
