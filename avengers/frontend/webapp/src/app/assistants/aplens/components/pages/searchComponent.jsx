import React, { useState } from "react";
import { useAnalysis } from "../context/AnalysisContext";

const SearchComponent = ({activeView, setActiveView, reports}) => {

      const {setAnalysisResults} = useAnalysis()
      const [selectedReportId, setSelectedReportId] = useState(null); 

      return (
        <div className="flex flex-col items-center pt-10 px-6">
          <div className="flex items-center mb-4 border-1.5 border-zinc-800">
                <button
                className={`w-24 px-4 py-1 transition duration-300 ${
                    activeView === "Forms"
                    ? "bg-zinc-800 text-white"
                    : "bg-white text-zinc-800 border-r border-zinc-800"
                }`}
                onClick={() => {setActiveView("Forms")}}
                >
                Forms
                </button>
                <button
                className={`w-24 px-4 py-1 transition duration-300 ${
                    activeView === "Reports"
                    ? "bg-zinc-800 text-white"
                    : "bg-white text-zinc-800"
                }`}
                onClick={() => {setActiveView("Reports")}}
                >
                Report
                </button>
            </div>
    
          {/* Divider */}
          <hr className="w-1/2 border-t-1.5 border-zinc-800 my-4" />
    
          {/* Dynamic List of Reviews */}
          {activeView=== "Reports" && (<div
            className="flex flex-col pt-3 gap-2 w-48 h-80 overflow-auto box-content pr-4 ml-4 border-opacity-0 transition-all duration-300 ease-in-out">
            {reports.current.map((report, index) => (
              <button
              key={report.id}
              className={`flex flex-col items-start px-4 py-4 w-full h-auto border-1.5 border-zinc-800 rounded-sm text-ellipsis overflow-hidden whitespace-nowrap transition duration-300 ease-in-out ${
                selectedReportId === report.retrievedData.id
                  ? "bg-zinc-800 text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
              onClick={() => {
                setAnalysisResults(report.retrievedData);
                setSelectedReportId(report.retrievedData.id);
              }}
            >
              <span className="block font-medium text-sm">{report.retrievedData.name}</span>
              <span className="block text-xs text-gray-400">{report.retrievedData.timestamp}</span>
            </button>
            ))}
        </div>)}
        </div>
      )
}

export default SearchComponent