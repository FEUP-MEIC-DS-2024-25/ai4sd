const fs = require("fs");
const pdfParse = require("pdf-parse");
const aiService = require("./aiService");
const plantumlEncoder = require("plantuml-encoder");

// Generate a new UML diagram from a PDF
exports.generateWireframe = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const pdfData = await pdfParse(fs.readFileSync(pdfPath));
    const requirementsText = pdfData.text;

    // Generate UML code from AI service
    const umlCode = await aiService.createWireframe(requirementsText);

    console.log("Generated UML Code:", umlCode);

    // Encode the UML code for URL-safe access
    const encodedUml = plantumlEncoder.encode(umlCode);
    const umlImageUrl = `https://www.plantuml.com/plantuml/png/${encodedUml}`;

    // Return the UML image URL as plain text
    res.send(umlImageUrl);
  } catch (error) {
    console.error("Error generating wireframe:", error);
    res.status(500).send("Failed to generate wireframe.");
  } finally {
    // Clean up uploaded PDF file
    if (req.file) fs.unlinkSync(req.file.path);
  }
};

// Regenerate a UML diagram based on existing UML code
exports.regenerateWireframe = async (req, res) => {
  try {
    const { umlCode } = req.body;

    if (!umlCode) {
      return res.status(400).send("Missing UML code for regeneration.");
    }

    // Encode the UML code for URL-safe access
    const encodedUml = plantumlEncoder.encode(umlCode);
    const umlImageUrl = `https://www.plantuml.com/plantuml/png/${encodedUml}`;

    console.log("Regenerated UML Image URL:", umlImageUrl);

    // Return the regenerated UML image URL
    res.send(umlImageUrl);
  } catch (error) {
    console.error("Error regenerating wireframe:", error);
    res.status(500).send("Failed to regenerate wireframe.");
  }
};
