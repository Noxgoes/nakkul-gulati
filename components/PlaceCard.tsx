import React, { useState } from 'react';
import { Place } from '../types';
import { StarIcon } from './icons/StarIcon';
import { getPlaceDetails } from '../services/geminiService';

interface PlaceCardProps {
  place: Place;
}

const categoryTagColors: { [key: string]: string } = {
  default: 'bg-gray-200 text-gray-800',
  Café: 'bg-green-200 text-green-800',
  Books: 'bg-purple-200 text-purple-800',
  Food: 'bg-blue-200 text-blue-800',
  Wine: 'bg-red-200 text-red-800',
  Restaurant: 'bg-blue-200 text-blue-800',
  Park: 'bg-yellow-200 text-yellow-800',
  Museum: 'bg-indigo-200 text-indigo-800',
  Shop: 'bg-pink-200 text-pink-800',
};

// Function to create a simple hash from a string to get a consistent number
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};


export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const tagColor = Object.keys(categoryTagColors).find(key => place.categoryTag.toLowerCase().includes(key.toLowerCase())) || 'default';

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [details, setDetails] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [areDetailsVisible, setAreDetailsVisible] = useState(false);

  const handleToggleDetails = async () => {
    // If details are already visible, just hide them.
    if (areDetailsVisible) {
      setAreDetailsVisible(false);
      return;
    }

    // If details are already loaded, just show them again.
    if (details) {
      setAreDetailsVisible(true);
      return;
    }
    
    // First time loading: fetch details.
    setIsLoadingDetails(true);
    setDetailsError(null);

    try {
      const detailsResult = await getPlaceDetails(place.name, place.address);
      setDetails(detailsResult);
      setAreDetailsVisible(true);
    } catch (e) {
      console.error("Details fetch failed:", e);
      setDetailsError('Failed to load details. Please try again.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Use a highly reliable placeholder service to ensure an image always appears.
  // A unique, consistent image is generated for each place based on its name.
  const imageId = simpleHash(place.name);
  const displayImageUrl = `https://picsum.photos/seed/${imageId}/192/288`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="flex-shrink-0 h-48 w-32 md:h-full md:w-48 bg-gray-200">
          <img
            className="h-full w-full object-cover"
            src={displayImageUrl}
            alt={`A depiction of ${place.name}`}
          />
        </div>
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
            <div className="flex items-center mt-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < Math.round(place.rating)} />
              ))}
              <span className="text-gray-600 font-semibold ml-2">{place.rating.toFixed(1)}</span>
            </div>
            <p className="mt-2 text-gray-600">{place.description}</p>
            <p className="mt-2 text-sm text-gray-500">{place.address}</p>
            
            {areDetailsVisible && details && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 text-sm mb-4">{details}</p>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    title={`Map of ${place.name}`}
                    className="w-full h-48 border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      place.name + ', ' + place.address
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>
            )}
            {detailsError && !isLoadingDetails && (
               <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-red-600">{detailsError}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between items-end">
             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryTagColors[tagColor]}`}>
              {place.categoryTag}
            </span>
            <button 
              onClick={handleToggleDetails} 
              disabled={isLoadingDetails}
              className="flex items-center justify-center min-w-[120px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoadingDetails ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : areDetailsVisible ? 'Hide Details' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};