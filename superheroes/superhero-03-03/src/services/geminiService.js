const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../', '.env') });


const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.sendPrompt = async (prompt) => {
  console.log('Sending prompt to Gemini API...');
    try {
        const result = await model.generateContent(prompt);
        console.log('Received response from Gemini API:', result.response.text());
        return result.response.text();  // pode ser preciso mandar metadata


    } catch (error) {
        console.error('Error sending prompt to Gemini API:', error);
        throw new Error('Failed to get response from Gemini API.');
    }
};
