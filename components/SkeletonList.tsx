
import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="flex">
      <div className="flex-shrink-0">
        <div className="h-48 w-32 bg-gray-300 md:h-full md:w-48"></div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
          <div className="h-10 bg-gray-300 rounded-full w-28"></div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonCategorySection: React.FC = () => (
  <div>
    <div className="h-9 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);


export const SkeletonList: React.FC = () => {
  return (
    <div className="space-y-10">
      {[...Array(3)].map((_, i) => (
        <SkeletonCategorySection key={i} />
      ))}
    </div>
  );
};
