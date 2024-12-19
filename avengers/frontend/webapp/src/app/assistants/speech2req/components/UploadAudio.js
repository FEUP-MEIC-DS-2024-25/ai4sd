"use client";

import React, { useState } from "react";


const UploadAudio = ({ setTranscription, setSummary }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Replacing handleSubmit with uploadFile function
  const uploadFile = async (file) => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    console.log("Uploading file...");
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("title", "Test Meeting");

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio.");
      }

      const data = await response.json();
      console.log("Response:", data);

      if (data.transcription) {
        setTranscription(data.transcription);
        setSummary(data.summary);
      } else {
        console.error("No transcription received:", data);
      }
    } catch (error) {
      console.error("Error during transcription:", error);
    } finally {
      setIsLoading(false);
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
        onClick={() => uploadFile(file)} // Call uploadFile when the button is clicked
        disabled={isLoading} // Disable the button when the form is submitting
      >
        Upload and Transcribe
      </button>
      {isLoading && (
      <div className="mt-2 text-info text-center">
        <p>Loading...</p>
      </div>
      )}
    </div>
  );
};

export default UploadAudio;
