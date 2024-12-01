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
    // }
    // setResponseData({
    //   data: [
    //     {
    //       title: "Buffer Overflow",
    //       description: "Buffer Overflow is a type of security vulnerability that occurs when a program writes more data to a buffer than it can hold. This can cause the program to overwrite adjacent memory locations, which can lead to unexpected behavior or even crashes. Buffer overflows are a common attack vector for hackers, who can use them to gain unauthorized access to a system or steal sensitive data.",
    //       lines: "10-15",
    //       fix: "To fix a buffer overflow vulnerability, you can use a technique called \"stack smashing.\" This involves overwriting the return address on the stack with a pointer to a malicious function. When the program returns from the vulnerable function, it will execute the malicious code instead of the intended code. This technique is commonly used in buffer overflow attacks.",
    //     },
    //     {
    //       title: "SQL Injection",
    //       description: "SQL Injection is a type of security vulnerability that occurs when a user inputs malicious SQL code into a web application. This can allow an attacker to execute arbitrary SQL commands on the database, which can lead to unauthorized access to sensitive data or even complete system compromise.",
    //       lines: "20-25",
    //       fix: "To fix a SQL injection vulnerability, you can use a technique called \"parameterized queries.\" This involves using a database library that automatically escapes special characters in user input, preventing them from being interpreted as SQL commands. This technique is commonly used in web applications to prevent SQL injection attacks.",
    //     }
    //   ]
      // })
    };
  }

  return (
    <div className="bg-light container-fluid d-flex justify-content-center align-items-center min-vh-100 text-dark">
      {!(responseData != null) ? (
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
      )}
    </div>
  );
};

// (() => {
//   try {} catch (error) {
//     console.error("Error rendering vulnerabilities:", error);
//     return (
//         <div className="alert alert-danger">
//             <strong>Error:</strong> Unable to render vulnerabilities. Please try again.
//         </div>
//     );
// }
// })()

export default UploadFilePage;
