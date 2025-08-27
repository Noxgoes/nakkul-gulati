
import React from 'react';
import { Place } from '../types';
import { PlaceCard } from './PlaceCard';

interface PlaceListProps {
  places: Place[];
}

export const PlaceList: React.FC<PlaceListProps> = ({ places }) => {
  if (places.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">No Places Found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your search or category.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {places.map((place, index) => (
        <PlaceCard key={`${place.name}-${index}`} place={place} />
      ))}
    </div>
  );
};
