"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="p-2 mb-4 mt-5 flex flex-col items-center justify-center mx-auto bg-gray-300 shadow-md rounded-md w-5/6">
      <img
        src="app/pictures/loading.gif"
        alt="Processing GIF"
        className="h-20 w-20 mb-4"
      />
      <p className="text-xl font-bold text-gray-700">
        Your request is being processed
      </p>
    </div>
  );
}
