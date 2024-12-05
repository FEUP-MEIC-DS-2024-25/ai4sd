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
