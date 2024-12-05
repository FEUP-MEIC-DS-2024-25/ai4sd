"use client";

import React from "react";

const DisplayTranscription = ({ transcription }) => (
  <div style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>
    <h2 style={{ color: "#333", marginBottom: "10px" }}>Transcription</h2>
    {transcription ? (
      <p
        style={{
          color: "#000",
          backgroundColor: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {transcription}
      </p>
    ) : (
      <p style={{ color: "#666", fontStyle: "italic" }}>
        No transcription available yet. Please upload or record audio!
      </p>
    )}
  </div>
);

export default DisplayTranscription;
