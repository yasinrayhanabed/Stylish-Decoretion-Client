import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh', 
    textAlign: 'center',
    padding: '20px'
  };

  const codeStyle = {
    fontSize: '6rem',
    fontWeight: 'bold',
    color: '#dc3545', 
    marginBottom: '10px'
  };

  const headingStyle = {
    fontSize: '2rem',
    marginBottom: '20px'
  };

  return (
    <div style={containerStyle}>
      <p style={codeStyle}>404</p>
      <h1 style={headingStyle}>Page Not Found!</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
        This Page is not Available
      </p>
      
      <Link 
        to="/" 
        style={{ 
          textDecoration: 'none', 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '5px',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;