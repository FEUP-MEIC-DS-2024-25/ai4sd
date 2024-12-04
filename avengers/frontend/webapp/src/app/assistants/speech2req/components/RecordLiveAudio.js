"use client";

import React, { useState, useRef } from "react";

const RecordLiveAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        audioChunks.current = []; // Reset chunks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const uploadRecording = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("/api/your_assistant/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Server response:", data); // Handle data
    } catch (err) {
      console.error("Error uploading audio:", err);
    }
  };

  return (
    <div>
      <h2>Live Audio Recorder</h2>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioBlob && (
        <div>
          <p>Recording complete! You can play or upload it below:</p>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <button onClick={uploadRecording}>Upload Recording</button>
        </div>
      )}
    </div>
  );
};

export default RecordLiveAudio;
