"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ShowSummary = ({ summary }) => (
  console.log("Summary:", summary),
  <div style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>
    <h2 style={{ color: "#333", marginBottom: "10px" }}>Summary of Requirements</h2>
    {summary ? (
      <div
        style={{
          color: "#000",
          backgroundColor: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "14px",
          lineHeight: "1.6",
        }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
    ) : (
      <p style={{ color: "#666", fontStyle: "italic" }}>
        No summary available yet. Please process your transcription!
      </p>
    )}
  </div>
);

export default ShowSummary;