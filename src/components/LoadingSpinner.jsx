import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></span>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}