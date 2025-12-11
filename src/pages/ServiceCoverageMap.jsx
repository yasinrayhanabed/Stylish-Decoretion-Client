import React from 'react';
import { motion } from 'framer-motion';

export default function ServiceCoverageMap() {
  const coverageAreas = [
    { name: "Dhaka", status: "Available", color: "bg-green-500" },
    { name: "Chittagong", status: "Available", color: "bg-green-500" },
    { name: "Sylhet", status: "Available", color: "bg-green-500" },
    { name: "Rajshahi", status: "Coming Soon", color: "bg-yellow-500" },
    { name: "Khulna", status: "Coming Soon", color: "bg-yellow-500" },
    { name: "Barisal", status: "Planning", color: "bg-gray-400" }
  ];

  return (
    <div className="min-h-screen bg-base-100 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Service Coverage Areas</h1>
          <p className="text-lg text-gray-600">We're expanding our services across Bangladesh</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-base-200 rounded-lg p-8 flex items-center justify-center min-h-[400px]"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-lg font-semibold">Interactive Map</p>
              <p className="text-gray-600">Coverage areas visualization</p>
            </div>
          </motion.div>

          {/* Coverage List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Coverage Status</h2>
            <div className="space-y-4">
              {coverageAreas.map((area, index) => (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${area.color}`}></div>
                    <span className="font-semibold">{area.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    area.status === 'Available' ? 'bg-green-100 text-green-800' :
                    area.status === 'Coming Soon' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {area.status}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary text-primary-content rounded-lg">
              <h3 className="text-lg font-bold mb-2">Request Service in Your Area</h3>
              <p className="mb-4">Don't see your area listed? Let us know and we'll consider expanding there!</p>
              <button className="btn btn-secondary">Request Coverage</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}