
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categoryColors: { [key: string]: string } = {
  'All': 'bg-gray-100 text-gray-800',
  'Restaurants': 'bg-blue-100 text-blue-800',
  'Cafes': 'bg-green-100 text-green-800',
  'Parks': 'bg-yellow-100 text-yellow-800',
  'Museums': 'bg-purple-100 text-purple-800',
  'Shops': 'bg-orange-100 text-orange-800',
};

const selectedColors: { [key: string]: string } = {
  'All': 'bg-gray-700 text-white',
  'Restaurants': 'bg-blue-500 text-white',
  'Cafes': 'bg-green-500 text-white',
  'Parks': 'bg-yellow-500 text-white',
  'Museums': 'bg-purple-500 text-white',
  'Shops': 'bg-orange-500 text-white',
};


export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
            selectedCategory === category
              ? `${selectedColors[category] || 'bg-gray-700 text-white'} shadow-md`
              : `${categoryColors[category] || 'bg-gray-200 text-gray-700'} hover:shadow-sm`
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
