import { Place } from '../types';

// Helper function to handle API requests to our Vercel serverless function
async function fetchFromApi(action: string, payload: object) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData.error);
      throw new Error(errorData.error || 'An unknown API error occurred.');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to perform action "${action}":`, error);
    throw error; // Re-throw the error to be caught by the calling component
  }
}

export const findNearbyPlaces = async (location: string, category: string): Promise<Place[]> => {
  const places = await fetchFromApi('findNearbyPlaces', { location, category });
  
  if (!Array.isArray(places)) {
      console.error("API did not return an array for places:", places);
      throw new Error("Invalid response format from API.");
  }
  
  return places as Place[];
};

export const getPlaceDetails = async (placeName: string, location: string): Promise<string> => {
  return await fetchFromApi('getPlaceDetails', { placeName, location });
};
