
import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { PlaceList } from './components/PlaceList';
import { SkeletonList } from './components/SkeletonList';
import { findNearbyPlaces } from './services/geminiService';
import { Place } from './types';
import { CATEGORIES } from './constants';
import { CategoryFilter } from './components/CategoryFilter';
import { Map } from './components/Map';
import { LoadingScreen } from './components/LoadingScreen';

type GroupedPlaces = Record<string, Place[]>;
type ViewState = 'search' | 'loading' | 'results';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [places, setPlaces] = useState<GroupedPlaces>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mapLocation, setMapLocation] = useState<string>('world');
  const [mapZoom, setMapZoom] = useState<number>(2);
  const [view, setView] = useState<ViewState>('search');

  const handleSearch = useCallback(async () => {
    if (!searchQuery) {
      setError('Please enter a location to search.');
      return;
    }
    
    // 1. Immediately go to loading state to start the animation on the current map
    setView('loading');
    setError(null);
    setPlaces({});
    setSelectedCategory('All');

    // 2. After a short delay, update the map's content.
    // This allows the scale animation to start on the world map before the iframe reloads.
    setTimeout(() => {
        setMapLocation(searchQuery);
        setMapZoom(14); // Zoom in on the location
    }, 100); // 100ms delay to ensure CSS transition kicks in

    try {
      const categoriesToFetch = CATEGORIES.filter(c => c !== 'All');
      const placesPromises = categoriesToFetch.map(category =>
        findNearbyPlaces(searchQuery, category)
      );
      
      const results = await Promise.allSettled(placesPromises);
      
      const newPlaces: GroupedPlaces = {};
      results.forEach((result, index) => {
        const category = categoriesToFetch[index];
        if (result.status === 'fulfilled' && result.value.length > 0) {
          newPlaces[category] = result.value;
        }
      });
      
      if (Object.keys(newPlaces).length === 0) {
        setError('No places found for this location. Please try another search.');
      } else {
        setError(null);
      }

      setPlaces(newPlaces);
    } catch (e) {
      console.error(e);
      setError('Could not fetch places. Please try again later.');
    } finally {
      // Give the zoom animation time to be appreciated.
      // This duration should be slightly longer than the CSS animation duration.
      setTimeout(() => {
        setView('results');
      }, 1600); // Map animation is 1500ms, give it a bit extra.
    }
  }, [searchQuery]);

  const handleGoBackToSearch = () => {
    setView('search');
    setError(null);
    setMapLocation('world'); // Reset to world view
    setMapZoom(2); // Reset zoom level
  }
  
  const displayedPlaces = Object.entries(places)
    .filter(([category]) => selectedCategory === 'All' || category === selectedCategory);

  return (
    <div className="w-screen h-screen font-sans text-gray-800 overflow-hidden relative bg-gray-50">
      
      {(view === 'search' || view === 'loading') && (
        <Map location={mapLocation} zoom={mapZoom} isZooming={view === 'loading'} />
      )}
      
      {view === 'loading' && <LoadingScreen location={searchQuery} />}

      {view === 'search' && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-lg">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl">
              <header className="text-center mb-4">
                <h1 className="text-4xl font-bold text-gray-900">Nearby Places</h1>
              </header>
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      )}

      {view === 'results' && (
        <main className="h-full w-full flex flex-col">
          <header className='p-4 border-b border-gray-200 bg-white sticky top-0 z-10'>
             <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={handleGoBackToSearch} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
                  aria-label="Back to search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Results for "{searchQuery}"</h1>
            </div>
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              onSearch={handleSearch}
            />
          </header>

          <div className='flex-grow overflow-y-auto p-4 space-y-4'>
            <CategoryFilter 
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            
            {error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : displayedPlaces.length > 0 ? (
              <div className="space-y-10">
                {displayedPlaces.map(([category, places]) => (
                  <section key={category} aria-labelledby={`${category}-heading`}>
                    <h2 id={`${category}-heading`} className="text-2xl font-bold text-gray-800 mb-3">{category}</h2>
                    <PlaceList places={places} />
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-gray-700">No Results Found</h2>
                <p className="text-gray-500 mt-2">There were no places found for the selected category.</p>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
