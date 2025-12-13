import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import API from '../api/axios';
import FallbackImage from './FallbackImage';

const StarRating = ({ rating, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1`}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className={`text-warning ${size === 'lg' ? 'text-lg' : 'text-sm'}`} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className={`text-warning ${size === 'lg' ? 'text-lg' : 'text-sm'}`} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} className={`text-base-300 ${size === 'lg' ? 'text-lg' : 'text-sm'}`} />
      ))}
      <span className={`ml-2 text-base-content/70 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

export default function TopDecorators() {
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDecorators();
  }, []);

  const fetchTopDecorators = async () => {
    try {
      const response = await API.get('/decorators/top-rated');
      setDecorators(response.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch top decorators:', error);
      setDecorators([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
            <figure className="px-6 pt-6">
              <div className="w-28 h-28 bg-base-300 rounded-full"></div>
            </figure>
            <div className="card-body text-center pb-6">
              <div className="h-6 bg-base-300 rounded mb-2"></div>
              <div className="h-4 bg-base-300 rounded mb-2"></div>
              <div className="h-4 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {decorators.length > 0 ? decorators.map((decorator, index) => (
        <motion.div
          key={decorator._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ y: -8, scale: 1.05 }}
          viewport={{ once: true }}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
          <figure className="px-6 pt-6">
            <div className="relative">
              <FallbackImage
                src={decorator.photo}
                alt={decorator.name}
                fallbackSrc={`https://i.pravatar.cc/150?img=${index + 10}`}
                className="rounded-full w-28 h-28 object-cover border-4 border-primary/20 group-hover:border-primary/60 transition-all duration-300 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </div>
          </figure>
          <div className="card-body text-center pb-6">
            <h3 className="card-title justify-center text-lg group-hover:text-primary transition-colors">
              {decorator.name}
            </h3>
            <p className="text-sm text-base-content/70 mb-2">
              {decorator.specialty || 'ডেকোরেশন এক্সপার্ট'}
            </p>
            <StarRating rating={decorator.averageRating || 4.5} />
            <div className="badge badge-outline badge-sm mt-2">
              {decorator.totalReviews ? `${decorator.totalReviews} রিভিউ` : 'টপ রেটেড'}
            </div>
            {decorator.completedProjects && (
              <div className="text-xs text-base-content/60 mt-1">
                {decorator.completedProjects} Project Successfully Done
              </div>
            )}
          </div>
        </motion.div>
      )) : (
        // Fallback decorators if no data
        [...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.05 }}
            viewport={{ once: true }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <figure className="px-6 pt-6">
              <div className="relative">
                <FallbackImage
                  src={`https://i.pravatar.cc/150?img=${i + 1}`}
                  alt={`Decorator ${i + 1}`}
                  className="rounded-full w-28 h-28 object-cover border-4 border-primary/20 group-hover:border-primary/60 transition-all duration-300 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              </div>
            </figure>
            <div className="card-body text-center pb-6">
              <h3 className="card-title justify-center text-lg group-hover:text-primary transition-colors">
                Expert Decoretors
              </h3>
              <p className="text-sm text-base-content/70 mb-2">Decoretors Specialist</p>
              <StarRating rating={4.5} />
              <div className="badge badge-outline badge-sm mt-2">Top Rated</div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}