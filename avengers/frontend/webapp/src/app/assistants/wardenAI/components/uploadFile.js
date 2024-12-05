"use client";

import React, { useState } from 'react';
import Markdown from 'react-markdown';

const UploadFilePage = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);

    // Prepare form data for file upload
    const fileContents = await file.text()

    const contents_data = {
      "content": fileContents
    };

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://superhero-05-01-150699885662.europe-west1.run.app', true)
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        console.log(xhr.responseText);

        if (xhr.status === 200){
          let response = JSON.parse(xhr.responseText);
          setResponseData(response);
          setFile(null);
        }
        else{
          console.error("Error uploading file:", xhr.statusText);
        }
      }

      xhr.onerror = function () {
        setResponseData({ "error": "Sorry, but we had a problem rendering vulnerabilities. Please try again later." });
      };

      xhr.send(JSON.stringify(contents_data))

    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
    
    };

  return (
    <div className="bg-light container-fluid d-flex justify-content-center align-items-center min-vh-100 text-dark">
      {responseData == null ? (
        <div className="card shadow-lg p-4 bg-light" style={{ maxWidth: '500px', width: '100%' }}>
          <h1 className="text-primary mb-4">Upload Your File</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">Choose a file:</label>
              <input
                id="fileInput"
                type="file"
                className="form-control bg-light"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center mt-4">
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="btn btn-primary btn-lg w-100"
                >
                  Upload File
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        responseData.error ? (
          <div className="alert alert-danger" role="alert">
            {responseData.error}
          </div>
        ) : (
          <div className="container p-4 m-4">
            {responseData.data.map((vulnerability) => (
              <div key={vulnerability.title} className="card mb-4 p-3 bg-light shadow-sm">
                <h2 className="text-success">{vulnerability.title}</h2>
                <Markdown>{vulnerability.description}</Markdown>
                <div>
                  <h5 className="mt-3">Lines:</h5>
                  <Markdown className="bg-light p-2 rounded border">
                    {"```" + vulnerability.lines + "```"}
                  </Markdown>
                </div>
                <h5 className="mt-3">Fix:</h5>
                <Markdown className="bg-light p-2 rounded border">
                  {vulnerability.fix}
                </Markdown>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};  

export default UploadFilePage;
