"use client"
import { useState } from "react";

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
      <h1>Upload Requirements PDF</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="application/pdf" />
        <button type="submit">Generate UML Diagram</button>
      </form>

      {umlImageUrl ? (
        <div>
          <h2>Generated UML Diagram</h2>
          <img src={umlImageUrl} alt="Generated UML Diagram" />

          {/* Dropdown for selecting format and file name input */}
          <div>
            <label htmlFor="format">Download Format:</label>
            <select id="format" value={format} onChange={handleFormatChange}>
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>

            <label htmlFor="fileName">File Name:</label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Enter file name"
            />

            <button onClick={downloadImage}>Download</button>
          </div>
        </div>
      ) : (
        <p>No UML diagram generated yet.</p>
      )}
    </div>
  );
}

export default WireframeGenerator;
