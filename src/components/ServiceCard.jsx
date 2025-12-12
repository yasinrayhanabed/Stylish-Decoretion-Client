import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FallbackImage from './FallbackImage';

export default function ServiceCard({ service, index = 0 }){

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
    >
      <figure className="relative overflow-hidden h-48">
        <FallbackImage
          src={service.images?.[0] || service.photo}
          alt={service.service_name}
          category={service.category}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <div className="badge badge-primary badge-lg font-bold shadow-lg">
            ৳{service.cost}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </figure>
      
      <div className="card-body p-5">
        <h2 className="card-title text-lg font-bold text-base-content group-hover:text-primary transition-colors duration-300">
          {service.service_name}
          {service.featured && <div className="badge badge-secondary badge-sm">Popular</div>}
        </h2>
        
        <p className="text-base-content/70 text-sm line-clamp-2 mb-3">
          {service.description || 'Professional decoration service tailored to your needs'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="badge badge-outline badge-sm">
            📂 {service.category}
          </div>
          {service.unit && (
            <div className="badge badge-ghost badge-sm">
              📏 {service.unit}
            </div>
          )}
        </div>
        
        <div className="card-actions justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-base-content/60">Starting from</span>
            <span className="text-xl font-bold text-success">৳{service.cost}</span>
          </div>
          <Link
            to={`/services/${service._id}`}
            className="btn btn-primary btn-sm hover:btn-secondary transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
