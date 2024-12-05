"use client";
import React from "react";

const DownloadSRS = ({ transcription, summary }) => {
  const handleDownload = async () => {
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
    <div>
      <button onClick={handleDownload} disabled={!transcription || !summary}>
        Download SRS Document
      </button>
    </div>
  );
};

export default DownloadSRS;
