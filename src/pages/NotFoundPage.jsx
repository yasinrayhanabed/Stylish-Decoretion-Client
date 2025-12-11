// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  // একটি স্টাইল অবজেক্ট যা পেজটিকে মাঝখানে এবং সুন্দরভাবে দেখাতে সাহায্য করবে
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh', // ভিউপোর্ট হাইটের 70%
    textAlign: 'center',
    padding: '20px'
  };

  const codeStyle = {
    fontSize: '6rem',
    fontWeight: 'bold',
    color: '#dc3545', // বুটস্ট্র্যাপের মতো একটি লাল রং
    marginBottom: '10px'
  };

  const headingStyle = {
    fontSize: '2rem',
    marginBottom: '20px'
  };

  return (
    <div style={containerStyle}>
      <p style={codeStyle}>404</p>
      <h1 style={headingStyle}>পেজটি খুঁজে পাওয়া যায়নি!</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
        আপনি যে ঠিকানাটি খুঁজছেন, তা হয় পরিবর্তন করা হয়েছে বা আর নেই।
      </p>
      
      {/* Link to Homepage */}
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
        হোমপেজে ফিরে যান
      </Link>
    </div>
  );
};

export default NotFoundPage;