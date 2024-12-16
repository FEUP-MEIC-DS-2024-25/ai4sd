import plantumlEncoder from 'plantuml-encoder';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { encodeForPlantUML } from '../utils/plantumlUtils.js';
import { getApiKey } from './geminiKeyService.js';

// Configure the Google Generative AI instance
const genAI = new GoogleGenerativeAI(getApiKey());
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Variables to store conversations
const conversations = {}; // { conversationId: { history: [], lastUMLCode: '', umlType: '' } }

// Initialize a new conversation
export function initializeConversation(conversationId) {
  conversations[conversationId] = {
    history: [],
    lastUMLCode: '',
    umlType: '',
  };
}

// Check if the conversation is initialized
export function isConversationInitialized(conversationId) {
  return conversations.hasOwnProperty(conversationId);
}

// Function to generate UML
export async function generateUML(conversationId, umlType, requirements) {
  try {
    if (!model) {
      throw new Error('Gemini model not initialized');
    }
    // Initialize history if it doesn't exist
    if (!conversations[conversationId]) {
      initializeConversation(conversationId);
    }

    // Update the UML type
    conversations[conversationId].umlType = umlType;

    const chat = model.startChat({
      history: conversations[conversationId].history,
      generationConfig: { maxOutputTokens: 1000 },
    });

    const chatMessage = `Generate a ${umlType} UML Diagram in PlantUML code based on: ${requirements}. Please provide the code in plain text, without Markdown formatting.`;
    const result = await chat.sendMessage(chatMessage);
    const umlCode = result.response.text();

    conversations[conversationId].lastUMLCode = umlCode;

    const encodedUML = encodeForPlantUML(umlCode);
    const imageUrl = `https://plantuml.github.io/plantuml-core/png.html?${encodedUML}`;
    //v1 const imageUrl = `https://www.plantuml.com/plantuml/png/${encodedUML}`; this one doesnt support the errors

    return { umlCode, imageUrl };
  } catch (error) {
    console.error('Error generating UML:', error);
    return { error: 'Error generating UML.' };
  }
}

// Function to apply changes to the UML
export async function applyChanges(conversationId, changes) {
  try {
    if (!model) {
      throw new Error('Gemini model not initialized');
    }

    if (!conversations[conversationId] || !conversations[conversationId].lastUMLCode) {
      return { message: 'No UML diagram found. Use /generate to create one first.' };
    }

    const chat = model.startChat({
      history: conversations[conversationId].history,
      generationConfig: { maxOutputTokens: 1000 },
    });

    const currentUML = conversations[conversationId].lastUMLCode;
    const prompt = `Here is the current UML code: ${currentUML}. Apply the following changes in plain text, without Markdown formatting: ${changes}`;
    const result = await chat.sendMessage(prompt);
    const updatedUMLCode = result.response.text();

    // Update history
    conversations[conversationId].history.push({ role: 'user', parts: [{ text: `Apply changes: ${changes}` }] });
    conversations[conversationId].history.push({ role: 'model', parts: [{ text: updatedUMLCode }] });
    conversations[conversationId].lastUMLCode = updatedUMLCode;

    const encodedUML = encodeForPlantUML(updatedUMLCode);
    const imageUrl = `https://www.plantuml.com/plantuml/png/${encodedUML}`;

    return { updatedUMLCode, imageUrl };
  } catch (error) {
    console.error('Error applying changes to UML:', error);
    return { error: 'Error applying changes to UML.' };
  }
}

// Function to get conversation history
export function getHistory(conversationId) {
  if (!conversations[conversationId]) {
    return { message: 'No conversation found for this ID.' };
  }

  return { history: conversations[conversationId].history };
}
