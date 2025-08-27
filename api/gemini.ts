import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This function is the serverless backend.
// It will be deployed automatically by Vercel.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API_KEY environment variable is not set" });
  }

  const ai = new GoogleGenAI({ apiKey });
  const { action, payload } = req.body;

  try {
    let result;
    switch (action) {
      case 'findNearbyPlaces':
        result = await findNearbyPlaces(ai, payload);
        break;
      case 'getPlaceDetails':
        result = await getPlaceDetails(ai, payload);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action specified' });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error processing Gemini API request:", error);
    return res.status(500).json({ error: 'Failed to fetch data from Gemini API.' });
  }
}

// --- Gemini Logic (moved from the frontend) ---

const placeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The name of the place." },
    rating: { type: Type.NUMBER, description: "A numerical rating out of 5, e.g., 4.5." },
    description: { type: Type.STRING, description: "A brief, one-sentence description of the place." },
    address: { type: Type.STRING, description: "Approximate address or distance, e.g., '123 Main St, 1.2 mi'." },
    categoryTag: { type: Type.STRING, description: "A single, relevant category tag, e.g., 'Café', 'Italian', 'Park'." },
  },
  required: ["name", "rating", "description", "address", "categoryTag"],
};

const findNearbyPlaces = async (ai: GoogleGenAI, payload: { location: string; category: string }) => {
  const { location, category } = payload;
  if (!location || !category) throw new Error("Location and category are required.");
  
  const prompt = `Find 5 popular ${category} near ${location}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: placeSchema,
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

const getPlaceDetails = async (ai: GoogleGenAI, payload: { placeName: string; location: string }) => {
  const { placeName, location } = payload;
  if (!placeName || !location) throw new Error("Place name and location are required.");
  
  const prompt = `Provide a more detailed, 2-3 sentence description for a place called "${placeName}", which is located around "${location}". Focus on its ambiance, popular items, or what makes it unique. Do not repeat the name of the place in the response.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text.trim();
};
