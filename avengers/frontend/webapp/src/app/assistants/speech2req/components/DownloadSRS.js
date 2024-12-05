"use client";

import React from "react";

const DownloadSRS = ({ transcription, summary }) => {
  const handleDownload = async () => {
    if (!transcription || !summary.length) return;

    try {
      const response = await fetch("/api/your_assistant/download_srs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription, summary }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SRS_Document.docx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading SRS document:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={handleDownload}
        disabled={!transcription || !summary.length}
        style={{
          backgroundColor: transcription && summary.length ? "#0056b3" : "#ccc",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: transcription && summary.length ? "pointer" : "not-allowed",
          opacity: transcription && summary.length ? "1" : "0.6",
        }}
      >
        Download SRS Document
      </button>
    </div>
  );
};

export default DownloadSRS;
