"use client";

import React, { useState } from 'react';

const UploadAudio = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await fetch('/api/your_assistant/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data); // Handle data or update state
  };

  return (
    <div>
      <input type="file" accept="audio/mp3" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Upload and Transcribe</button>
    </div>
  );
};

export default UploadAudio;
