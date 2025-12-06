import React from 'react';
export default function Footer(){
  return (
    <footer className="bg-gray-900 text-white p-6 mt-10">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} StyleDecor — All Rights Reserved</p>
        <p>Contact: support@styledecor.com | +880123456789</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="#" className="hover:text-pink-400">Facebook</a>
          <a href="#" className="hover:text-pink-400">Instagram</a>
          <a href="#" className="hover:text-pink-400">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
