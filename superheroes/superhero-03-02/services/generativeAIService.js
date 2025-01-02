import { GoogleGenerativeAI } from "@google/generative-ai";
import { encodeForPlantUML } from "../utils/plantumlUtils.js";
import { getApiKey } from "./geminiKeyService.js";

const genAI = new GoogleGenerativeAI(process.env.API_KEY || getApiKey());
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const conversations = {}; // { conversationId: { history: [], lastUMLCode: '', umlType: '' } }

export function initializeConversation(conversationId) {
  conversations[conversationId] = {
    history: [],
    lastUMLCode: "",
    umlType: "",
  };
}

export function isConversationInitialized(conversationId) {
  return conversations.hasOwnProperty(conversationId);
}

export async function reviewUMLCode(conversationId, umlCode) {
  try {
    const chat = model.startChat({
      history: conversations[conversationId].history,
      generationConfig: { maxOutputTokens: 500 },
    });

    const reviewPrompt = `
You are a strict PlantUML validator. Carefully check the following PlantUML code character by character for syntax correctness. Imagine running this code through a PlantUML compiler and ensure it passes with NO errors.

CODE TO VALIDATE:
${umlCode}

INSTRUCTIONS:
- If the code is absolutely correct and can be processed by PlantUML with no syntax errors, respond ONLY with "CORRECT".
- If there is ANY syntax or structural error, return ONLY the corrected PlantUML code.
- The corrected code MUST start with "@startuml" and end with "@enduml".
- Do NOT provide explanations, do NOT use Markdown, do NOT add additional text.
- Double-check your result thoroughly before returning it.
    `.trim();

    const result = await chat.sendMessage(reviewPrompt);
    const reviewFeedback = result.response.text().trim();

    if (reviewFeedback.toUpperCase() === "CORRECT") {
      return { reviewedUML: umlCode };
    } else {
      if (
        reviewFeedback.startsWith("@startuml") &&
        reviewFeedback.endsWith("@enduml")
      ) {
        return { reviewedUML: reviewFeedback };
      } else {
        throw new Error(
          "Reviewed UML code has invalid structure or did not follow instructions."
        );
      }
    }
  } catch (error) {
    console.error("Error reviewing UML code:", error.message);
    return { error: `Error reviewing UML code: ${error.message}` };
  }
}

export async function generateUML(
  conversationId,
  umlType,
  requirements,
  retries = 3
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!conversations[conversationId]) {
        initializeConversation(conversationId);
      }

      conversations[conversationId].umlType = umlType;

      const chat = model.startChat({
        history: conversations[conversationId].history,
        generationConfig: { maxOutputTokens: 1000 },
      });

      const chatMessage = `
You are a PlantUML generation and validation expert. You will produce a ${umlType} UML diagram that has absolutely no syntax errors.

Follow these rules:
- Use a valid ${umlType} diagram format (for example, if it's a sequence diagram, follow sequence diagram syntax).
- Always declare participants/actors before using them.
- If using a sequence diagram, for example:
  @startuml
  actor User
  participant "Authentication System" as AS
  User -> AS : Submits username and password
  activate AS
  AS --> User : Returns authentication token
  deactivate AS
  @enduml

- Make sure to enclose participant names with spaces in quotes, like "Authentication System".
- No syntax errors are allowed. Double-check the syntax. Imagine running it in PlantUML and ensure it renders without errors.
- Return ONLY the PlantUML code, nothing else, no explanations, no Markdown.

Here are the requirements for the diagram:
${requirements}

Return only the final, correct PlantUML code starting with @startuml and ending with @enduml.
      `.trim();

      const result = await chat.sendMessage(chatMessage);
      const umlCode = result.response.text().trim();

      // Review the generated UML code
      const review = await reviewUMLCode(conversationId, umlCode);
      if (review.error) {
        throw new Error(review.error);
      }

      const reviewedUML = review.reviewedUML;

      // Check if the reviewed UML is different from the original
      if (reviewedUML !== umlCode) {
        console.log("UML code was corrected during review.");
      }

      conversations[conversationId].lastUMLCode = reviewedUML;

      const encodedUML = encodeForPlantUML(reviewedUML);
      const imageUrl = `https://www.plantuml.com/plantuml/png/${encodedUML}`;

      // Update conversation history
      conversations[conversationId].history.push({
        role: "user",
        content: chatMessage,
      });
      conversations[conversationId].history.push({
        role: "model",
        content: reviewedUML,
      });

      return { umlCode: reviewedUML, imageUrl };
    } catch (error) {
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.error("All attempts to generate UML failed.");
        return { error: "Failed to generate UML after multiple attempts." };
      }
      // Wait
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}

export async function applyChanges(conversationId, changes) {
  try {
    if (!model) {
      throw new Error("Gemini model not initialized");
    }

    if (
      !conversations[conversationId] ||
      !conversations[conversationId].lastUMLCode
    ) {
      return {
        message: "No UML diagram found. Use /generate to create one first.",
      };
    }

    const chat = model.startChat({
      history: conversations[conversationId].history,
      generationConfig: { maxOutputTokens: 1000 },
    });

    const currentUML = conversations[conversationId].lastUMLCode;
    const prompt = `
You have the following valid PlantUML code:

${currentUML}

Apply the following changes to this code:

${changes}

REQUIREMENTS:
- After applying changes, the code MUST still start with "@startuml" and end with "@enduml".
- The code MUST remain fully syntactically valid PlantUML.
- If the resulting code is correct and needs no fixes, respond ONLY with "CORRECT".
- If fixes are needed, return ONLY the corrected code.
- Do NOT use Markdown or provide explanations.
- Re-validate the final code thoroughly before returning it.
    `.trim();

    const result = await chat.sendMessage(prompt);
    const updatedUMLCode = result.response.text().trim();

    // Review the updated UML code
    const review = await reviewUMLCode(conversationId, updatedUMLCode);
    if (review.error) {
      throw new Error(review.error);
    }

    const reviewedUpdatedUML = review.reviewedUML;

    //Validate Uml code structure
    if (
      !reviewedUpdatedUML.startsWith("@startuml") ||
      !reviewedUpdatedUML.endsWith("@enduml")
    ) {
      throw new Error("Invalid UML code structure after applying changes.");
    }

    // Update history
    conversations[conversationId].history.push({
      role: "user",
      content: `Apply changes: ${changes}`,
    });
    conversations[conversationId].history.push({
      role: "model",
      content: reviewedUpdatedUML,
    });
    conversations[conversationId].lastUMLCode = reviewedUpdatedUML;

    const encodedUML = encodeForPlantUML(reviewedUpdatedUML);
    const imageUrl = `https://www.plantuml.com/plantuml/png/${encodedUML}`;

    return { updatedUMLCode: reviewedUpdatedUML, imageUrl };
  } catch (error) {
    console.error("Error applying changes to UML:", error.message);
    return { error: `Error applying changes to UML: ${error.message}` };
  }
}

export function getHistory(conversationId) {
  if (!conversations[conversationId]) {
    return { message: "No conversation found for this ID." };
  }

  return { history: conversations[conversationId].history };
}
