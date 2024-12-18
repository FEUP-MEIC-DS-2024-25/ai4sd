"use client"
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "@/app/page.module.css";

import Image from "next/image";
import logo from '../assets/logo.png';
import upload from '../assets/upload.png';
function WireframeGenerator({ addRendering }) {
  const [file, setFile] = useState(null);
  const [umlImageUrl, setUmlImageUrl] = useState("");
  const [format, setFormat] = useState("png"); // Default format
  const [fileName, setFileName] = useState("diagram"); // Default file name

  // Handle file input changes
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Submit the PDF to generate UML
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("requirementsPdf", file);

    try {
      const response = await fetch("http://localhost:3000/generate-wireframe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch UML diagram");
      }

      const umlUrl = await response.text();
      setUmlImageUrl(umlUrl); // Set the returned URL to state
      addRendering(umlUrl); // Add to the previous renderings list
    } catch (error) {
      console.error("Error fetching UML diagram:", error);
    }
  };

  // Handle format change for the dropdown
  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  // Handle file name change
  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  // Download the image in the selected format
  const downloadImage = async () => {
    if (!umlImageUrl) return;

    // Modify URL to include the selected format
    const formattedUrl = umlImageUrl.replace("/png/", `/${format}/`);

    try {
      // Fetch the image as a blob
      const response = await fetch(formattedUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the image for download");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create an invisible link element to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;

      // Use the user-provided file name and selected format
      link.download = `${fileName || "diagram"}.${format}`;
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the blob URL
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };


  return (
    <div>
      <div className="flex justify-center">
        <Image src={logo} alt="BANANAI Logo" width={200} height={200} />
      </div>
      <div className="border border-gray-300 shadow-lg rounded-lg w-full max-w-3xl mx-auto bg-white dark:bg-neutral-900 p-6 mt-8">     
      {/* Upload Form */}
      <div className="text-center">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            accept="application/pdf"
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <Image src={upload} alt="Upload PDF" width={100} height={100} />
          </label>
          {/* Display the selected file name or placeholder */}
          {file && (
              <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>
            )}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-3 hover:bg-indigo-700"
          >
            Generate Wireframes
          </button>
        </form>
      </div>

      {/* Wireframes */}
      {umlImageUrl ? (
        <div className="text-center mt-6">
          <h2 className="text-lg font-semibold mb-4">Generated Wireframes</h2>
          <img
            src={umlImageUrl}
            alt="Generated Wireframes"
            className="mx-auto my-4 border rounded-md"
          />

          {/* Download Options */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="format" className="font-medium">
                Download Format:
              </label>
              <select
                id="format"
                value={format}
                onChange={handleFormatChange}
                className="border rounded-md p-1"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="fileName" className="font-medium">
                File Name:
              </label>
              <input
                id="fileName"
                type="text"
                value={fileName}
                onChange={handleFileNameChange}
                placeholder="Enter file name"
                className="border rounded-md p-1"
              />
            </div>

            <button
              onClick={downloadImage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Download
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">
          No Wireframes diagram generated yet.
        </p>
      )}
    </div>
  </div>
  );
}

export default WireframeGenerator;
