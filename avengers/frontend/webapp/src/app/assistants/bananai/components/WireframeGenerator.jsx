import PropTypes from "prop-types";
import { useState } from "react";

function WireframeGenerator({ addRendering }) {
  const [file, setFile] = useState(null);
  const [wireframeUrl, setWireframeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("requirementsPdf", file);

    try {
      const response = await fetch("http://localhost:3000/generate-wireframe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate wireframe");
      }

      const data = await response.json();
      if (data.wireframe) {
        const wireframeUrl = `http://www.plantuml.com/plantuml/svg/${data.wireframe}`;
        setWireframeUrl(wireframeUrl);
        addRendering(wireframeUrl); // Add to the previous renderings list
      } else {
        throw new Error("No wireframe data received");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Requirements PDF</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Wireframe"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {wireframeUrl && (
        <div>
          <h2>Generated Wireframe</h2>
          <iframe
            src={wireframeUrl}
            title="Generated Wireframe"
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}
    </div>
  );
}

WireframeGenerator.propTypes = {
  addRendering: PropTypes.func.isRequired,
};

export default WireframeGenerator;
