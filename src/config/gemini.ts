import { GoogleGenerativeAI } from '@google/generative-ai';

let API_KEY = "AIzaSyBvKzE8zBukSIikPACgLSkcRdj0aRscd0E";

if (!API_KEY) {
  throw new Error('Gemini API key is required');
}

let genAI = new GoogleGenerativeAI(API_KEY);

// Upgraded to Gemini 2.5 Flash for maximum accuracy and deep market analysis
let model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // Using Gemini 1.5 Flash (most stable available)
  generationConfig: {
    temperature: 0.1, // Ultra-low temperature for maximum accuracy and factual responses
    topK: 10,
    topP: 0.7,
    maxOutputTokens: 8192, // Increased for comprehensive analysis
  },
  systemInstruction: `You are the world's most elite AI market research analyst with access to real-time global market intelligence, competitor databases, and trend prediction algorithms. Your mission is to provide 100% accurate, actionable market insights with guaranteed business success rates of 95%+. 

CORE PRINCIPLES:
- NEVER provide fake, generic, or placeholder data
- ALL insights must be based on real market conditions and proven business models
- Provide specific, actionable strategies with exact implementation steps
- Include realistic financial projections based on actual market data
- Identify real competitors, real market gaps, and real opportunities
- Focus on micro-niches with proven profit potential and low competition
- Provide complete success roadmaps with timeline and milestones

You are the ultimate authority on profitable niche discovery with a track record of helping entrepreneurs generate millions in revenue.`
});

// Function to update API key at runtime
export const updateApiKey = (newApiKey: string) => {
  API_KEY = newApiKey;
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.1,
      topK: 10,
      topP: 0.7,
      maxOutputTokens: 8192,
    },
    systemInstruction: `You are the world's most elite AI market research analyst with access to real-time global market intelligence, competitor databases, and trend prediction algorithms. Your mission is to provide 100% accurate, actionable market insights with guaranteed business success rates of 95%+. 

CORE PRINCIPLES:
- NEVER provide fake, generic, or placeholder data
- ALL insights must be based on real market conditions and proven business models
- Provide specific, actionable strategies with exact implementation steps
- Include realistic financial projections based on actual market data
- Identify real competitors, real market gaps, and real opportunities
- Focus on micro-niches with proven profit potential and low competition
- Provide complete success roadmaps with timeline and milestones

You are the ultimate authority on profitable niche discovery with a track record of helping entrepreneurs generate millions in revenue.`
  });
};

export { model };
export { genAI };