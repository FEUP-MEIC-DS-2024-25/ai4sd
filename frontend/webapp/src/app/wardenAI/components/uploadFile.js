"use client";

import React, { useState } from 'react';

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
      content: `#include <stdio.h>\\n#include <string.h>\\n#include <stdlib.h>\\n\\nint main(int argc, char *argv[])\\n{\\n    char buffer[5];\\n\\n    if (argc < 2)\\n    {\\n        printf(\\"Usage: %s <string>\\n\\", argv[0]);\\n        exit(0);\\n    }\\n\\n    strcpy(buffer, argv[1]);\\n    printf(\\"buffer content= %s\\n\\", buffer);\\n\\n    return 0;\\n}`
    };
    

    try {
      // Replace 'https://your-api-url.com/upload' with your actual API endpoint
      console.log("file: ", fileContents);
      const response = await fetch('http://localhost:8000/online', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify(contents_data)
      });
      
      // hard coded response
      // const response = {
      //   ok: true,
      //   json: () => Promise.resolve(
      //     {
      //       data: [
      //         { 
      //           title: 'Sample Title',
      //           description: 'Sample Body',
      //           lines: [12, 34],
      //           fix: "Sample Fix"
      //         },
      //         {
      //           title: 'Sample Title 2',
      //           description: 'Sample Body 2',
      //           lines: [13, 35],
      //           fix: "Sample Fix 2"
      //         }
      //       ]
      //     }
      //   )
      // };

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setResponseData(data);
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-dark h-75 text-center p-10" style={{ height: '100vh' }}>

      {!responseData ? (
        <div>
        <h1>File Upload</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="btn btn-primary"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
        </div>
      ) : (
        <div>
          {responseData.data.map((vulnerability) => (
          <div>
            <strong><h1>{vulnerability.title}</h1></strong>
            <p>{vulnerability.description}</p>
            <div>
              <p>Lines:</p>
              <ul>
                {vulnerability.lines.map((lineNumber) => (
                  <li>
                    {lineNumber}
                  </li>
                ))}
              </ul>
            </div><p>Fix: {vulnerability.fix}</p>
          </div>
        ))}   
        </div>
      )}
    </div>
  );
};

export default UploadFilePage;
