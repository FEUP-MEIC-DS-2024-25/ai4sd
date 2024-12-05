"use client";
import React from "react";

const ShowSummary = ({ summary }) => {
  if (!summary) {
    return <p>No summary available yet. Please process your transcription!</p>;
  }

  return (
    <div>
      <h2>Summary of Requirements</h2>
      <ul>
        {summary.map((item, index) => (
          <li key={index}>
            <strong>{item.title}</strong>: {item.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowSummary;