const { VertexAI } = require("@google-cloud/vertexai");

const projectId = "ds-feup-440216";
const location = "us-central1";

const vertexAI = new VertexAI({ project: projectId, location: location });

// Keyword mappings for vague requirements
const keywordMappings = {
  "name": "text box",
  "email": "text box",
  "input": "text box",
  "enter": "text box",
  "select": "dropdown list",
  "choose": "dropdown list",
  "dropdown": "dropdown list",
  "button": "button",
  "submit": "button",
  "click": "button",
  "list": "list",
  "table": "table",
  "navigation": "menu bar",
  "login": "login form",
  "signup": "registration form",
};

// Function to preprocess vague requirements into a clearer format
const preprocessRequirements = (requirementsText) => {
  let preprocessedText = requirementsText;

  for (const [key, value] of Object.entries(keywordMappings)) {
    // Replace vague words with explicit UI components
    const regex = new RegExp(`\\b${key}\\b`, "gi"); // Match whole words, case-insensitive
    preprocessedText = preprocessedText.replace(regex, value);
  }

  return preprocessedText;
};

// Function to clean and ensure the output starts with 'salt'
const cleanCodeOutput = (rawCode) => {
  const lines = rawCode.split("\n");
  const saltIndex = lines.findIndex(line => line.trim().startsWith("salt"));

  if (saltIndex === -1) {
    throw new Error("The output does not contain valid PlantUML Salt code.");
  }

  // Keep only the lines starting from 'salt'
  const cleanedLines = lines.slice(saltIndex);
  return `${cleanedLines.join("\n").trim()}`;
};

// Build the refined prompt
const buildPrompt = (requirementsText) => {
  const cleanedText = preprocessRequirements(requirementsText);

  return `
    Analyze the following requirements and generate **valid** PlantUML Salt code for a wireframe:

    Requirements:
    ${cleanedText}

    Guidelines:
    1. Map keywords like "input", "button", "dropdown" to their corresponding PlantUML Salt components (e.g., \`text box\`, \`button\`, \`dropdown list\`).
    2. Use correct syntax for PlantUML Salt as documented at https://plantuml.com/salt.
    3. The output must be clean and valid PlantUML Salt code that runs in the online editor (https://editor.plantuml.com/uml/).
    4. For lists, use \`list\` blocks. For tables, use \`table\` blocks. For navigation bars, use \`menu bar\` blocks.
    5. If the output contains any syntax errors or does not render, revise and provide a valid alternative.
    6. Do not include any text outside the PlantUML Salt code (e.g., comments or explanations).
    7. In the text box parameters, write dummy words to fill blank spaces.
    8. Always start with \`\`\`\nsalt and end with \`\`\`.

    Example Input: 
    "Create a form with a name field, email field, a dropdown to select a role, and a submit button."

    Expected Output:
    \`\`\`
    salt
    {
      {
        Name | [ ]
        Email | [ ]
        Role | [ Select One ]
        [Submit]
      }
    }
    \`\`\`

    If you cannot generate valid code, respond with: "Error: Unable to process the request with the given input."
  `;
};

exports.createWireframe = async (requirementsText, maxRetries = 3) => {
  const model = vertexAI.preview.getGenerativeModel({ model: "gemini-pro" });

  const refinedPrompt = buildPrompt(requirementsText);

  const request = {
    contents: [
      {
        role: "user",
        parts: [{ text: refinedPrompt }],
      },
    ],
  };

  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const result = await model.generateContent(request);
      const response = await result.response;

      console.log(`Attempt ${attempts + 1}: AI generated raw response`, response);

      // Safely retrieve and clean up the PlantUML code
      if (
        response &&
        response.candidates &&
        response.candidates[0]?.content?.parts?.[0]?.text
      ) {
        const rawCode = response.candidates[0].content.parts[0].text.trim();

        // Clean the code to ensure it starts with 'salt'
        const cleanedCode = cleanCodeOutput(rawCode);
        console.log("Cleaned PlantUML Code:", cleanedCode);

        return cleanedCode;
      } else {
        throw new Error("Invalid response structure from Gemini API.");
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;

      if (attempts >= maxRetries) {
        throw new Error(
          `Failed to generate a valid wireframe after ${maxRetries} attempts.`
        );
      }
    }
  }
};
