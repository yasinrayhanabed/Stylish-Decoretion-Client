import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-10">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">StyleDecor</h2>
            <p className="text-sm mt-1">Creating Stylish Spaces for You</p>
          </div>

          <div className="flex justify-center md:justify-end gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
        <hr className="my-6 border-gray-700" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left text-sm">
          <p>© {new Date().getFullYear()} StyleDecor — All Rights Reserved</p>
          <p className="mt-2 md:mt-0">
            Contact: <a href="mailto:support@styledecor.com" className="hover:text-violet-400">support@styledecor.com</a> | +880123456789
          </p>
        </div>
      </div>
    </footer>
  );
}
