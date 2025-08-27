
import React from 'react';

interface MapProps {
  location: string;
  zoom: number;
  isZooming?: boolean;
}

export const Map: React.FC<MapProps> = ({ location, zoom, isZooming = false }) => {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    location
  )}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`absolute inset-0 z-0 transition-all duration-[1500ms] ease-in-out ${isZooming ? 'scale-125 blur-md' : 'scale-100 blur-none'}`}>
      <iframe
        // By removing the key, we ensure the iframe itself is not replaced on re-render.
        // Only its 'src' attribute updates, allowing the parent div's CSS transition to run uninterrupted.
        title="Location Map"
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
      ></iframe>
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
    </div>
  );
};
