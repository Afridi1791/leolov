import { GoogleGenerativeAI } from '@google/generative-ai';

let API_KEY = "AIzaSyBvKzE8zBukSIikPACgLSkcRdj0aRscd0E";

if (!API_KEY) {
  throw new Error('Gemini API key is required');
}

let genAI = new GoogleGenerativeAI(API_KEY);

let model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

// Function to update API key at runtime
export const updateApiKey = (newApiKey: string) => {
  API_KEY = newApiKey;
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
};

export { model };
export { genAI };