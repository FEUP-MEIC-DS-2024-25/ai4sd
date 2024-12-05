"use client";

import React from "react";

export default function Filters({
  onOutputTypeChange,
  onOutputLanguageChange,
}) {
  return (
    <div className="p-7 mb-4 bg-gray-100 rounded-md shadow-inner w-full h-32 flex justify-center items-center">
      <div className="mr-20">
        <label className="block text-center font-bold mb-2">
          Type of the output file
        </label>
        <select className="p-2 bg-white border rounded-md w-full" onChange={(e) => onOutputTypeChange(e.target.value)}>
          <option value="pdf">.pdf</option>
          <option value="txt">.txt</option>
        </select>
      </div>
      <div className="mr-20">
        <label className="block text-center font-bold mb-2">
          Language of the output file
        </label>
        <select className="p-2 bg-white border rounded-md w-full" onChange={(e) => onOutputLanguageChange(e.target.value)}>
          <option value="english">English</option>
          <option value="portuguese">Portuguese</option>
        </select>
      </div>
    </div>
  );
}
