"use client";

import React, { useState } from 'react';

// const [file, setFile] = useState(null);
// const [responseData, setResponseData] = useState(null);
// const [loading, setLoading] = useState(false);

function handleFileChange(event) {
  file = event.target.files[0];
};

async function handleSubmit (event) {
  event.preventDefault();
  if (!file) return;

  loading = true;

  // Prepare form data for file upload
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log("file: ", file);
    // Replace 'http://your-api-url.com/upload' with your actual API endpoint
    // const response = await fetch('http://localhost:8000/online', {
    //   method: 'POST',
    //   body: formData,
    // });
    // hard coded response
    const response = {
      ok: true,
      json: () => Promise.resolve({ 
        title: 'Sample Title',
        description: 'Sample Body',
        lines: [12, 34],
        fix: "Sample Fix"
     })
    };

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    responseData = data;
    file = null;
  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    loading = false;
  }
}

let responseData = null;
let file = null;
let loading = false;

export default function UploadFile() {
  return (
    <div className="bg-white text-dark h-75 text-center p-10" style={{ height: '100vh' }}>
      <h1>File Upload</h1>

      {!responseData ? (
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            // disabled={!file || loading}
            className="btn btn-primary"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      ) : (
        <div>
          <h2>{responseData.title}</h2>
          <p>{responseData.description}</p>
          <div>
            <strong>Lines:</strong>
            <ul>
              {responseData.line.map((lineNumber) => (
                <li>
                  {lineNumber}
                </li>
              ))}
            </ul>
          </div>
          <p>Fix: {responseData.fix}</p>
        </div>
      )}
    </div>
  );
}

