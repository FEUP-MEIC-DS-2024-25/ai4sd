"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

const ShowSummary = ({ summary }) => (
  console.log("Summary:", summary),
  <div style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>
    <h2 style={{ color: "#333", marginBottom: "10px" }}>Summary of Requirements</h2>
    {summary ? (
      /*
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {summary.map((item, index) => (
          <li
            key={index}
            style={{
              color: "#000",
              marginBottom: "10px",
              backgroundColor: "#f3f3f3",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <strong style={{ fontSize: "16px", color: "#0056b3" }}>
              {item.title}
            </strong>
            <p style={{ fontSize: "14px", marginTop: "5px" }}>{item.details}</p>
          </li>
        ))}
      </ul>
      */
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
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    ) : (
      <p style={{ color: "#666", fontStyle: "italic" }}>
        No summary available yet. Please process your transcription!
      </p>
    )}
  </div>
);

export default ShowSummary;
