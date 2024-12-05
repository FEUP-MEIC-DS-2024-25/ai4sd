"use client";

import React, { useState } from "react";

const UploadAudio = ({ setTranscription }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio.");
      }

      const data = await response.json();

      if (data.transcription) {
        setTranscription(data.transcription);
      } else {
        console.error("No transcription received:", data);
      }
    } catch (error) {
      console.error("Error during transcription:", error);
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <input 
        type="file" 
        accept="audio/mp3" 
        style={{
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
