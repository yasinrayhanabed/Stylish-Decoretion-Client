import React from 'react';

export const ServiceCardSkeleton = () => (
  <div className="border rounded-xl shadow-lg overflow-hidden bg-white animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="p-6 max-w-[1200px] mx-auto animate-pulse">
    <div className="h-10 bg-gray-300 rounded mb-8 w-1/3 mx-auto"></div>
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 h-10 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded w-48"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default PageSkeleton;