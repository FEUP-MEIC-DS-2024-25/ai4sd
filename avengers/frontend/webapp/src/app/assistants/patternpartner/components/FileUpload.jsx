"use client";

import React, { useState } from "react";
import { uploadLogFile } from "./services/apiService";

const FileUpload = () => {
  //const [file, setFile] = useState(null);
  const [file, setFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(''); // To store the upload response
  const [message, setMessage] = useState("");
  const [spinner, setSpinnerVisibility] = useState(false); //To store spinner's visibilty

  const handleFileChange = (e) => {
    //setFile(e.target.files[0]);
    //setFile(e.target.files);
    const allowedTypes = [".txt", ".log", ".csv", ".json"]; // Add allowed formats
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.name.slice(file.name.lastIndexOf(".")).toLowerCase())
    );

    if (invalidFiles.length > 0) {
      alert(`Unsupported file types: ${invalidFiles.map((file) => file.name).join(", ")}`);
    } else {
      setFiles(files); // Store the valid files
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select a file.");
      return;
    }

    setSpinnerVisibility(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("logfiles", file); // Append each file to the FormData
      });

      const response = await uploadLogFile(file);

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error || 'Upload failed'}`);
        return;
      }

      const data = await response.json();
      setUploadStatus(data.message);

      setMessage(response.message || "File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file.");
    }
    setSpinnerVisibility(false);
  };

  return (
    <div className="file-upload">
      <h3>Upload Log File</h3>
      <div style={{ marginBottom: '10px' }}>
        <input type="file" accept=".txt,.log,.csv,.json" multiple onChange={handleFileChange} />
      </div>
      
      {/* Button and spinner container */}
      <div className="upload-container">
        <button onClick={handleFileUpload} style={{ marginLeft: '10px' }}>
          Upload File
        </button>

        {/* Display Spinner */}
        {spinner && (
          <div className="loader"></div>
        )}
      </div>

      {uploadStatus && <p style={{ marginTop: '10px', color: 'black' }}>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
