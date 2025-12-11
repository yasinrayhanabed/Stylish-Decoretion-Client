import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 p-6">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg max-w-lg w-full">
        <span className="text-6xl" role="img" aria-label="Warning Sign">⚠️</span>
        <h1 className="text-5xl font-extrabold text-red-600 mt-4">403 Forbidden</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-4">
          Access Denied
        </h2>
        
        <p className="text-gray-600 mb-6">
          You are logged in, but you do not have the required permissions to access this resource.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;