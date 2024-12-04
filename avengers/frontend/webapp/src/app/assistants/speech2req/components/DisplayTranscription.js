import React from "react";

const DisplayTranscription = ({ transcription }) => {
  if (!transcription) {
    return <p>No transcription available yet. Please upload or record audio!</p>;
  }

  return (
    <div>
      <h2>Transcription</h2>
      <p>{transcription}</p>
    </div>
  );
};

export default DisplayTranscription;
