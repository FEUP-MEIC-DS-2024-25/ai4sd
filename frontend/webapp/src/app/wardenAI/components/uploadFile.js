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
      "content": fileContents//"#include <stdio.h>\\n#include <string.h>\\n#include <stdlib.h>\\n\\nint main(int argc, char *argv[])\\n{\\n    char buffer[5];\\n\\n    if (argc < 2)\\n    {\\n        printf(\"Usage: %s <string>\\n\", argv[0]);\\n        exit(0);\\n    }\\n\\n    strcpy(buffer, argv[1]);\\n    printf(\"buffer content= %s\\n\", buffer);\\n\\n    return 0;\\n}"
    };

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8000/online', true)
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        if (xhr.status === 200){
          let response = JSON.parse(xhr.responseText);
          setResponseData(response);
          setFile(null);
        }
        else{
          console.error("Error uploading file:", xhr.statusText);
        }
      }
      xhr.send(JSON.stringify(contents_data))

    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-dark h-75 text-center p-10" style={{ height: '100vh' }}>

      {!(responseData != null) ? (
        <div>
        <h1>File Upload</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
          />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <button
                type="submit"
                disabled={!file || loading}
                className="btn btn-primary"
              >
                Upload File
              </button>
            )}
        </form>
        </div>
      ) : (
        <div>
          {responseData.data.map((vulnerability) => (
            <div key={vulnerability.title}>
            <strong><h1>{vulnerability.title}</h1></strong>
              <Markdown>{vulnerability.description}</Markdown>
            <div>
              <p>Lines:</p>
              <Markdown>{"```"+vulnerability.lines+"```"}</Markdown>
            </div>
            <p>Fix:</p> <Markdown>{vulnerability.fix}</Markdown>
          </div>
        ))}   
        </div>
      )}
    </div>
  );
};

export default UploadFilePage;
