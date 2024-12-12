const fs = require("fs");
const pdfParse = require("pdf-parse");
const aiService = require("./aiService");
const plantumlEncoder = require("plantuml-encoder");

// Generate multiple UML diagrams from a PDF
exports.generateMultipleWireframes = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const pdfData = await pdfParse(fs.readFileSync(pdfPath));
    const requirementsText = pdfData.text;

    const umlCodes = await aiService.createMultipleWireframes(requirementsText);

    console.log("Generated UML Codes:", umlCodes);

    const umlImageUrls = umlCodes.map(umlCode => {
      const encodedUml = plantumlEncoder.encode(umlCode);
      return `https://www.plantuml.com/plantuml/png/${encodedUml}`;
    });

    res.json({ images: umlImageUrls });
  } catch (error) {
    console.error("Error generating multiple wireframes:", error);
    res.status(500).send("Failed to generate multiple wireframes.");
  } finally {
    // Clean up uploaded PDF file
    if (req.file) fs.unlinkSync(req.file.path);
  }
};

// Update aiService to handle multiple wireframes
aiService.createMultipleWireframes = async (requirementsText) => {
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
};
