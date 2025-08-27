
import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, onSearch }) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter city, address, or landmark"
        className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-shadow duration-200"
        aria-label="Search for places"
      />
      <button 
        onClick={onSearch}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-blue-600 rounded-r-full transition-colors"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
