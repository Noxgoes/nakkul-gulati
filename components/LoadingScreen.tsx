import React from 'react';

interface LoadingScreenProps {
  location: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ location }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
      <svg className="animate-spin h-10 w-10 text-white mb-4 [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.7))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h2 className="text-xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">Finding places near...</h2>
      <p className="text-lg text-white/80 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">{location}</p>
    </div>
  );
};