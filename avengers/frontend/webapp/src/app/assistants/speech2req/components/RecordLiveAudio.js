"use client";

import React, { useState, useRef } from "react";

const RecordLiveAudio = ({ setTranscription, setSummary}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

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



    const audioFile = new File([audioBlob], "recording.mp3", { type: "audio/mp3" });

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("title", "Live Recording");

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/transcribe", {
      //const response = await fetch("https://superhero-04-03-150699885662.europe-west1.run.app/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

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
    <div className="d-flex flex-column gap-2 align-items-center">
      <h2 className="text-center text-dark">Live Audio Recorder</h2>
      <button 
        className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {isRecording && <p className="text-danger">Recording...</p>}
      {(audioBlob && !isRecording) && (
        <p className="text-secondary">Recording complete! You can play, download or upload it below:</p>
      )}
      {audioBlob && (
        <div className="text-center">
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <button className="btn btn-success mt-2" onClick={uploadRecording} disabled={isLoading}>
            Upload Recording
          </button>
          {isLoading && (
          <div className="mt-2 text-info text-center">
            <p>Loading...</p>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordLiveAudio;
