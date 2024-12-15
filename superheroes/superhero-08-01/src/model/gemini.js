// https://github.com/google-gemini/generative-ai-js
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'

export class GeminiModel {
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  }

  async process(prompt) {
    const result = await this.model.generateContent([prompt]);

    return result.response.text();
  }
}
