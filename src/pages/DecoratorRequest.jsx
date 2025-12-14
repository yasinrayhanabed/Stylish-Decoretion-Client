import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { FaPalette, FaUser, FaPhone, FaMapMarkerAlt, FaFileAlt, FaImage, FaStar, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function DecoratorRequest() {
  const [formData, setFormData] = useState({
    experience: '',
    specialty: '',
    portfolio: '',
    description: '',
    phone: '',
    location: '',
    expectedRate: ''
  });
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    checkRequestStatus();
  }, []);

  const checkRequestStatus = async () => {
    try {
      const response = await API.get('/me');
      const user = response.data;
      if (user.decoratorRequestStatus) {
        setRequestStatus({
          status: user.decoratorRequestStatus,
          data: user.decoratorRequest
        });
      }
    } catch (err) {
      console.error('Failed to check request status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/decorator-requests', formData);
      console.log('Success response:', response.data);
      toast.success(response.data.message || 'Decorator request submitted successfully! We will review and contact you soon.');
      setFormData({
        experience: '',
        specialty: '',
        portfolio: '',
        description: '',
        phone: '',
        location: '',
        expectedRate: ''
      });
      // Refresh status after successful submission
      checkRequestStatus();
    } catch (err) {
      console.error('Request submission failed:', err);
      
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || 'Server error occurred';
        toast.error(`Error: ${errorMessage}`);
        console.error('Server Error:', err.response.status, err.response.data);
      } else if (err.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
        console.error('Network Error:', err.request);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Checking your decorator request status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <FaPalette className="text-5xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Become a Decorator</h1>
            <p className="text-xl text-purple-100">Join our team of professional decorators and showcase your creativity</p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                <span>Flexible Working Hours</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                <span>Competitive Rates</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                <span>Creative Freedom</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Display */}
        {requestStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`p-6 rounded-2xl shadow-xl ${
              requestStatus.status === 'approved' ? 'bg-green-50 border-l-4 border-green-500' :
              requestStatus.status === 'rejected' ? 'bg-red-50 border-l-4 border-red-500' :
              'bg-yellow-50 border-l-4 border-yellow-500'
            }`}>
              <div className="flex items-center mb-4">
                {requestStatus.status === 'approved' && <FaCheckCircle className="text-2xl text-green-600 mr-3" />}
                {requestStatus.status === 'rejected' && <FaTimesCircle className="text-2xl text-red-600 mr-3" />}
                {requestStatus.status === 'pending' && <FaClock className="text-2xl text-yellow-600 mr-3" />}
                <h3 className={`text-xl font-bold ${
                  requestStatus.status === 'approved' ? 'text-green-800' :
                  requestStatus.status === 'rejected' ? 'text-red-800' :
                  'text-yellow-800'
                }`}>
                  {requestStatus.status === 'approved' && 'Request Approved! 🎉'}
                  {requestStatus.status === 'rejected' && 'Request Rejected'}
                  {requestStatus.status === 'pending' && 'Request Under Review'}
                </h3>
              </div>
              <p className={`${
                requestStatus.status === 'approved' ? 'text-green-700' :
                requestStatus.status === 'rejected' ? 'text-red-700' :
                'text-yellow-700'
              }`}>
                {requestStatus.status === 'approved' && 'Congratulations! Your decorator request has been approved. You can now access the decorator dashboard.'}
                {requestStatus.status === 'rejected' && 'Unfortunately, your decorator request was not approved this time. You can submit a new request below.'}
                {requestStatus.status === 'pending' && 'Your decorator request is currently being reviewed by our admin team. We will notify you once a decision is made.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Form - Show only if no pending request or if rejected */}
        {(!requestStatus || requestStatus.status === 'rejected') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaStar className="inline mr-2 text-yellow-500" />
                  Years of Experience *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 Years</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPalette className="inline mr-2 text-purple-500" />
                  Specialty *
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Specialty</option>
                  <option value="Wedding Decoration">Wedding Decoration</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Corporate Events">Corporate Events</option>
                  <option value="Home Decoration">Home Decoration</option>
                  <option value="Festival Decoration">Festival Decoration</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2 text-green-500" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city/area"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Expected Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 Expected Rate (per project)
                </label>
                <input
                  type="number"
                  name="expectedRate"
                  value={formData.expectedRate}
                  onChange={handleChange}
                  placeholder="Enter expected rate in BDT"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaImage className="inline mr-2 text-blue-500" />
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="Link to your work portfolio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFileAlt className="inline mr-2 text-indigo-500" />
                Tell us about yourself *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your experience, skills, and why you want to be a decorator..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>



            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </motion.div>
        )}
      </div>
    </div>
  );
}