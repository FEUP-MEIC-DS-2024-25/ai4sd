"use client";

import Image from "next/image";
import React from "react";
import fileSVG from "@/app/pictures/file.svg";

export default function DownloadOutput({
  downloadUrl,
  downloadFilename,
  feedbackInfo,
  setFeedbackInfo,
}) {
  return (
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
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="document-item mr-5 mt-3 mb-3 w-32 h-36 bg-white shadow-md rounded-xl flex flex-col items-center pt-10"
          >
            <Image
              src={fileSVG}
              alt="File SVG"
              height={70}
              width={70}
              className="px-2 mb-3"
            />
            <span className="px-2 text-s">{downloadFilename}</span>
          </a>
        </div>

        <div className="shadow-inner rounded-md w-1/2 flex flex-col h-full">
          <textarea
            className="p-2 mb-3 h-full bg-white border rounded-md border-gray-300 resize-none"
            placeholder="Changes you want to include in a new file version"
            value={feedbackInfo}
            onChange={(e) => setFeedbackInfo(e.target.value)}
          />
          <button
            type="button"
            className="px-4 py-1 bg-purple-600 text-white rounded-md text-xl font-bold tracking-wider shadow-md hover:bg-purple-800 duration-300"
          >
            Send feedback <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div >
  );
}
