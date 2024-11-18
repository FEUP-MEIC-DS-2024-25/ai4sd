"use client";

import React from "react";

export default function InputSubmission({
  selectedFiles,
  handleFileChange,
  deleteFile,
  normalizeText,
  additionalInfo,
  setAdditionalInfo,
}) {
  return (
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
          className="p-2 mb-3 border rounded-md bg-white border-gray-300 resize-none"
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
  );
}
