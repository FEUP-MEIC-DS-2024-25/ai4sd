"use client";

import React, { useState } from "react";
import { uploadLogFile } from "./services/apiService";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    try {
      const response = await uploadLogFile(file);
      setMessage(response.message || "File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div className="file-upload">
      <h3>Upload Log File</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
