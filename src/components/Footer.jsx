import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">🎨 StyleDecor</h2>
            <p className="text-sm mb-4">Creating Stylish Spaces for You</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaPhone className="text-violet-400" />
                <span>+880 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-violet-400" />
                <a href="mailto:support@styledecor.com" className="hover:text-violet-400">
                  support@styledecor.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-violet-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaClock className="text-violet-400" />
                <div>
                  <div>Mon - Fri: 9:00 AM - 6:00 PM</div>
                  <div>Sat: 10:00 AM - 4:00 PM</div>
                  <div>Sun: Closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <div><a href="/" className="hover:text-violet-400">Home</a></div>
              <div><a href="/services" className="hover:text-violet-400">Services</a></div>
              <div><a href="/about" className="hover:text-violet-400">About</a></div>
              <div><a href="/contact" className="hover:text-violet-400">Contact</a></div>
              <div><a href="/coverage" className="hover:text-violet-400">Service Areas</a></div>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-700" />
        <div className="text-center text-sm">
          <p>© {new Date().getFullYear()} StyleDecor. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
