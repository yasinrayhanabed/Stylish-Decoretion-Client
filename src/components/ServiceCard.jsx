import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FallbackImage from './FallbackImage';
import { formatCurrency } from '../utils/formatCurrency';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <figure className="h-48 overflow-hidden">
        <FallbackImage
          src={service.images?.[0] || service.photo}
          alt={service.service_name}
          category={service.category}
          className="w-full h-full object-cover"
        />
      </figure>
      
      <div className="card-body p-6">
        <h3 className="card-title text-lg font-semibold mb-2">
          {service.service_name}
        </h3>
        
        <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
          {service.description || 'Professional decoration service'}
        </p>
        
        <div className="card-actions justify-between items-center">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(service.cost, { currency: '৳', showCurrency: true })}
          </span>
          <Link
            to={`/services/${service._id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
