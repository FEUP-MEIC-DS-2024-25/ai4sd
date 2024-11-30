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
      "content": "#include <stdio.h>\\n#include <string.h>\\n#include <stdlib.h>\\n\\nint main(int argc, char *argv[])\\n{\\n    char buffer[5];\\n\\n    if (argc < 2)\\n    {\\n        printf(\"Usage: %s <string>\\n\", argv[0]);\\n        exit(0);\\n    }\\n\\n    strcpy(buffer, argv[1]);\\n    printf(\"buffer content= %s\\n\", buffer);\\n\\n    return 0;\\n}"
    };

    try {
      // Replace 'https://your-api-url.com/upload' with your actual API endpoint
      console.log("file: ", fileContents);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8000/online', true)
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        if (xhr.status === 200){
          let response = JSON.parse(xhr.responseText);
          console.log("response: ", response.data);
          setResponseData(response);
          setFile(null);
        }
        else{
          console.error("phodase", xhr.status)
        }
      }
      xhr.send(JSON.stringify(contents_data))

      // hard coded response
      // const response = {
      //   ok: true,
      //   json: () => Promise.resolve(
      //     {
      //       data: [
      //         {
      //           title: "Buffer Overflow Vulnerability",
      //           description: "The `strcpy` function copies the entire contents of `argv[1]` into the `buffer` array, which has a fixed size of 5 bytes. If the length of `argv[1]` is greater than or equal to 5 (including the null terminator), this will lead to a buffer overflow, overwriting adjacent memory locations. This can cause program crashes, unexpected behavior, or even allow attackers to execute arbitrary code.",
      //           lines: ["strcpy(buffer, argv[1]);"],
      //           fix: "Use a safer string copy function like `strncpy` with a size parameter to prevent overflowing the buffer.  Also, always validate and sanitize user inputs to ensure they are within the expected size limits. For instance, check the length of argv[1] before copying."
      //         }
      //       ]
      //     }
      //   )
      // };

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
              <p><Markdown>{vulnerability.description}</Markdown></p>
            <div>
              <p>Lines:</p>
                <p><Markdown>{"```"+vulnerability.lines+"```"}</Markdown></p>
                {/* {vulnerability.lines.map((lineNumber) => (
                  <li>
                    {lineNumber}
                  </li>
                ))} */}
            </div><p>Fix: <Markdown>{vulnerability.fix}</Markdown></p>
          </div>
        ))}   
        </div>
      )}
    </div>
  );
};

export default UploadFilePage;
