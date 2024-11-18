"use client";

import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.css";
import styles from "@/app/page.module.css";

export default function AssistantInteraction() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [feedbackInfo, setFeedbackInfo] = useState("");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const deleteFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizeText = (file) => {
    const [name, extension] = file.name.split(".");
    const shortName = name.length > 15 ? name.substring(0, 15) : name;
    return `${shortName}.${extension}`;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFiles.length) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("additionalInfo", additionalInfo);

    setLoading(true);
    try {
      const response = await fetch("toDetermine", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ?.split("filename=")[1]
        ?.split(";")[0]
        ?.replace(/"/g, "") || "Classification.txt";

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFilename(filename);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.assistantInteraction}>
      <header className="p-5 mb-5 bg-gray-100 shadow-md text-xl font-bold text-center w-full flex items-center justify-center">
        <h2 className="text-3xl font-bold">RRBuddy</h2>
      </header>

      <div className="p-2 flex flex-col mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
        <form onSubmit={handleFormSubmit}>
          <div className="p-7 mb-4 bg-gray-100 rounded-md shadow-inner w-full h-32 flex justify-center items-center">
            <div className="mr-20">
              <label className="block text-center font-bold mb-2">
                Type of the output file
              </label>
              <select className="p-2 border rounded-md w-full">
                <option value="pdf">.pdf</option>
                <option value="txt">.txt</option>
              </select>
            </div>
            <div className="mr-20">
              <label className="block text-center font-bold mb-2">
                Language of the output file
              </label>
              <select className="p-2 border rounded-md w-full">
                <option value="english">English</option>
                <option value="portuguese">Portuguese</option>
              </select>
            </div>
            <div className="mr-20">
              <label className="block text-center font-bold mb-2">AI Model</label>
              <select className="p-2 border rounded-md w-full">
                <option value="gemini">Gemini</option>
                <option value="chatgpt">ChatGPT</option>
              </select>
            </div>
          </div>

          <div className="flex w-full">
            <div className="p-2 mb-2 mr-4 bg-gray-100 rounded-md shadow-inner w-1/2">
              <label
                htmlFor="files"
                className="block p-2 w-full bg-purple-600 border text-xl text-center text-white font-bold tracking-wider rounded-lg shadow-md cursor-pointer hover:bg-purple-800 duration-300"
              >
                Upload Files for Analysis <i className="fas fa-plus-circle"></i>
              </label>
              <input
                id="files"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <ul className="flex flex-wrap mt-3">
                {selectedFiles.length > 0 ? (
                  selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="document-item mr-5 mb-3 w-32 h-36 bg-white shadow-md rounded-xl flex flex-col items-center"
                    >
                      <button
                        type="button"
                        onClick={() => deleteFile(index)}
                        className="delete-button flex items-center justify-between w-full"
                      >
                        <div className="p-2 ml-auto bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 duration-300">
                          <i className="fas fa-trash text-purple-600 text-2xl hover:text-red-500 duration-300"></i>
                        </div>
                      </button>
                      <i className="px-2 far fa-file-alt text-6xl text-black mb-3"></i>
                      <span className="px-2 text-xs">{normalizeText(file)}</span>
                    </li>
                  ))
                ) : (
                  <li>No files selected.</li>
                )}
              </ul>
            </div>

            <div className="shadow-inner rounded-md w-1/2 flex flex-col h-full">
              <textarea
                className="p-2 mb-3 h-full border rounded-md border-gray-300 resize-none"
                placeholder="Additional information"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-1 bg-purple-600 text-white rounded-md text-xl font-bold tracking-wider shadow-md hover:bg-purple-800 duration-300"
              >
                Submit <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading && (
        <div className="p-2 mb-4 mt-5 flex flex-col items-center justify-center mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
          <img
            src="/static/img/loading.gif"
            alt="Processing GIF"
            className="h-20 w-20 mb-4"
          />
          <p className="text-xl font-bold text-gray-700">
            Your request is being processed
          </p>
        </div>
      )}

      {downloadUrl && (
        <div className="p-2 mb-4 mt-5 flex flex-col mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
          <div className="flex w-full">
            <div className="p-2 mb-2 mr-4 bg-gray-100 rounded-md shadow-inner w-1/2">
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="block p-2 w-full bg-purple-600 border text-xl text-center text-white font-bold tracking-wider rounded-lg shadow-md cursor-pointer hover:bg-purple-800 duration-300"
              >
                Download your file <i className="fas fa-download"></i>
              </a>
            </div>

            <div className="shadow-inner rounded-md w-1/2 flex flex-col h-full">
              <textarea
                className="p-2 mb-3 h-full border rounded-md border-gray-300 resize-none"
                placeholder="Changes you want to include in a new file version"
                value={feedbackInfo}
                onChange={(e) => setFeedbackInfo(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-1 bg-purple-600 text-white rounded-md text-xl font-bold tracking-wider shadow-md hover:bg-purple-800 duration-300"
              >
                Submit <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
