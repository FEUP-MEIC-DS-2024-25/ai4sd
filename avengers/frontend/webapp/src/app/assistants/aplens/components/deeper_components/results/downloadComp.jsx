import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const DownloadComponent = ({ results }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [fileType, setFileType] = useState("pdf");

  const handleDownloadClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const createMardownContent = () => {
    const improvementsMarkdown = results.improvements.map(
        (improvement) =>
            `- **${Object.keys(improvement)[0]}**: ${Object.values(improvement)[0]}`
    ).join("\n");

    const strengthsMarkdown = results.strenghts.map(
        (strength) =>
            `- **${Object.keys(strength)[0]}**: ${Object.values(strength)[0]}`
    ).join("\n")

    // Create Markdown content
    const markdownData = `
# Evaluation Report

This is the evaluation of the provided repository regarding pattern ${results.pattern}, provided by the APLens tool.
        
## Summary
        
- **Percentage Score:** ${results.percentage}
- **Explanation:** ${results.explanation}
        
## Areas for Improvement

${improvementsMarkdown}

## Well-Implemented Features

${strengthsMarkdown}

---

`;
    return markdownData
  }

  const handleDownload = () => {
    if (fileType === "json") {
      
      const blob = new Blob([JSON.stringify(results, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.json";
      link.click();
      URL.revokeObjectURL(url);
    } else if (fileType === "md") {

        const markdownData = createMardownContent();

        const blob = new Blob([markdownData], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "report.md";
        link.click();
        URL.revokeObjectURL(url);
    } else if (fileType === "pdf"){
        // const markdownData = createMardownContent();

        alert(`Implementation still in progress, will be available soon!`)

        
    } else {
        alert(`File type ${fileType.toUpperCase()} not recognized`);
    }
  };

  return (
    <div className="relative">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadClick}
          className="text-black hover:text-[#333333]"
          aria-label="Download"
        >
          <FileDownloadIcon fontSize="large" />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleCloseModal}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative"
          onClick={(event) => event.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* Modal Content */}
            <h2 className="text-lg font-semibold text-center mb-4">
              Download your report
            </h2>
            <div className="flex flex-col items-center mb-4">
              <label className="text-sm mb-2" htmlFor="fileType">
                File type
              </label>
              <select
                id="fileType"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                onChange={(event) => setFileType(event.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="md">MD</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadComponent;
