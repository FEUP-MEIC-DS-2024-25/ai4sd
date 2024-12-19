import React, { useState, useEffect } from "react";
import { useAnalysis } from "../context/AnalysisContext";

const SearchComponent = ({ activeView, setActiveView, clientId }) => {
  const { setAnalysisResults } = useAnalysis();
  const [reports, setReports] = useState([]); 
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (activeView === "Forms") {
      setSelectedReportId(null);
    }
  }, [activeView]);

  const fetchReports = async () => {
    setLoading(true); 
    try {
      
      const response = await fetch(
        "https://superhero-06-03-150699885662.europe-west1.run.app/api/get-client-reports/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id : clientId
          }),
        }
      );
      const data = await response.json();
      console.log("THE DATA I HAVE RECEIVED IS : ", response)
      setReports(data.reports || []); 
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 px-6">
      <div className="flex items-center mb-2 border-1.5 border-zinc-800">
        <button
          className={`w-24 px-4 py-1 transition duration-300 ${
            activeView === "Forms"
              ? "bg-zinc-800 text-white"
              : "bg-white text-zinc-800 border-r border-zinc-800"
          }`}
          onClick={() => setActiveView("Forms")}
        >
          Forms
        </button>
        <button
          className={`w-24 px-4 py-1 transition duration-300 ${
            activeView === "Reports"
              ? "bg-zinc-800 text-white"
              : "bg-white text-zinc-800"
          }`}
          onClick={() => {
            fetchReports(); 
            setActiveView("Reports");
          }}
        >
          Reports
        </button>
      </div>

      {/* Divider */}
      <hr className="w-1/2 border-t-1.5 border-zinc-800 my-4" />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search reports..."
        className="w-full mb-4 p-2 border border-zinc-800 rounded-sm"
      />

      {/* Dynamic List of Reviews */}
      <div className="flex flex-col pt-3 gap-2 w-48 h-80 overflow-auto box-content pr-4 ml-4 border-opacity-0 transition-all duration-300 ease-in-out">
        {loading ? (
          <p>Loading...</p> // Show loading message
        ) : (
          reports.map((report, index) => (
            <button
              key={report.id ? report.id : `report-${index}`}
              className={`flex flex-col items-start px-4 py-4 w-full h-auto border-1.5 border-zinc-800 rounded-sm text-ellipsis overflow-hidden whitespace-nowrap transition duration-300 ease-in-out ${
                selectedReportId === report.id
                  ? "bg-zinc-800 text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
              onClick={() => {
                setAnalysisResults(report);
                setSelectedReportId(report.id);
                setActiveView("Reports");
              }}
            >
              <span className="block font-medium text-sm">{report.name}</span>
              <span className="block text-xs text-gray-400">{report.timestamp}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
