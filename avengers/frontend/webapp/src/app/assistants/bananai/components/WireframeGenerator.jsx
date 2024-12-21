"use client";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "@/app/page.module.css";
import Image from "next/image";
import logo from '../assets/logo.png';
import upload from '../assets/upload.png';

function WireframeGenerator({ addRendering }) {
  const [file, setFile] = useState(null);
  const [umlImageUrl, setUmlImageUrl] = useState("");
  const [format, setFormat] = useState("png");
  const [fileName, setFileName] = useState("diagram");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setIsLoading(true);
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
      setUmlImageUrl(umlUrl);
      addRendering(umlUrl);
    } catch (error) {
      console.error("Error fetching UML diagram:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const downloadImage = async () => {
    if (!umlImageUrl) return;

    const formattedUrl = umlImageUrl.replace("/png/", `/${format}/`);
    try {
      const response = await fetch(formattedUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the image for download");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName || "diagram"}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div>
      <div className="border border-gray-300 shadow-lg rounded-lg w-full max-w-3xl mx-auto bg-white dark:bg-neutral-900 p-6 mt-8">
        <Image src={logo} alt="BANANAI Logo" width={90} height={90} />     

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
              <Image src={upload} alt="Upload PDF" width={100} height={100} className="hover:scale-110" />
            </label>
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

        {/* Main scrollable area */}
        <div className="overflow-hidden rounded-lg relative mt-6" style={{ height: "500px", maxWidth: "1200px", margin: "0 auto" }}>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner-border text-indigo-600" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : umlImageUrl ? (
            <div className="relative h-full">
              {/* Scrollable Image */}
              <div
                className="overflow-auto h-full"
                style={{
                  marginBottom: "70px", // Reserve space for the controls
                }}
              >
                <img
                  src={umlImageUrl}
                  alt="Generated Wireframes"
                  className="mx-auto my-4 border rounded-md"
                  style={{ display: "block", maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>

              {/* Fixed Download Controls */}
              <div
                className="bg-white dark:bg-neutral-900 p-4 absolute bottom-0 left-0 w-full"
                style={{ zIndex: 10 }}
              >
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
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-6">
              No Wireframes diagram generated yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WireframeGenerator;
