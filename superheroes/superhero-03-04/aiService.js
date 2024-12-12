const { VertexAI } = require("@google-cloud/vertexai");

const projectId = "ds-feup-440216";
const location = "us-central1";

const vertexAI = new VertexAI({ project: projectId, location: location });

// Generate PlantUML code using Vertex AI
exports.createWireframe = async (requirementsText) => {
  const model = vertexAI.preview.getGenerativeModel({ model: "gemini-pro" });

  const request = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `Generate a mindmap in PlantUML code based on: ${requirementsText}. Provide the code without Markdown or formatting.` }
        ],
      },
    ],
  };

  try {
    const result = await model.generateContent(request);
    const response = await result.response;

    console.log("AI generated wireframe response:", response);

    // Return the PlantUML content as plain text
    return response.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error generating wireframe from Gemini:", error);
    throw error;
  }
};
// Generate multiple PlantUML codes using Vertex AI
/*exports.createMultipleWireframes = async (requirementsText) => {
  const model = vertexAI.preview.getGenerativeModel({ model: "gemini-pro" });

  const request = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze the requirements: ${requirementsText}. Generate separate PlantUML codes for individual components (e.g., headers, footers, forms, navigation bars). Provide each code as plain text without formatting.`
          },
        ],
      },
    ],
  };

  try {
    const result = await model.generateContent(request);
    const response = await result.response;

    // Extract multiple UML codes from the response
    const umlCodes = response.candidates.map(candidate => candidate.content.parts[0].text.trim());

    return umlCodes;
  } catch (error) {
    console.error("Error generating multiple wireframes from Gemini:", error);
    throw error;
  }
};*/
