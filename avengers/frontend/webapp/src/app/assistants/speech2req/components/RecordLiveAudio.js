"use client";

import React, { useState, useRef } from "react";

const RecordLiveAudio = ({ setTranscription }) => {
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
        audioChunks.current = [];
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
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.transcription) {
        setTranscription(data.transcription);
      }
    } catch (err) {
      console.error("Error uploading audio:", err);
    }
  };

  return (
    <div className="d-flex flex-column gap-2 align-items-center">
      <h2 className="text-center">Live Audio Recorder</h2>
      <button 
        className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioBlob && (
        <div className="text-center">
          <p className="mt-3">Recording complete! You can play or upload it below:</p>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <button className="btn btn-success mt-2" onClick={uploadRecording}>
            Upload Recording
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordLiveAudio;
