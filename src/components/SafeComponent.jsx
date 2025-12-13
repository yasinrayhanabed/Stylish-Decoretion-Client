import React from 'react';

const SafeComponent = ({ children, fallback = null }) => {
  try {
    return children;
  } catch (error) {
    console.error('Component render error:', error);
    
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="alert alert-error">
        <div>
          <span>Something went wrong. Please refresh the page.</span>
        </div>
      </div>
    );
  }
};

export default SafeComponent;