import { GoogleGenAI, Type } from "@google/genai";
import { Place } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const findNearbyPlaces = async (location: string, category: string): Promise<Place[]> => {
  const prompt = `Find 5 popular ${category} near ${location}.`;

  try {
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
    const places = JSON.parse(jsonText);

    // Basic validation to ensure we have an array
    if (!Array.isArray(places)) {
      console.error("Gemini API did not return an array:", places);
      throw new Error("Invalid response format from API.");
    }
    
    return places as Place[];

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to fetch data from Gemini API.");
  }
};

export const getPlaceDetails = async (placeName: string, location: string): Promise<string> => {
  const prompt = `Provide a more detailed, 2-3 sentence description for a place called "${placeName}", which is located around "${location}". Focus on its ambiance, popular items, or what makes it unique. Do not repeat the name of the place in the response.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error(`Error fetching details for ${placeName}:`, error);
    throw new Error(`Failed to fetch details for ${placeName}.`);
  }
};
