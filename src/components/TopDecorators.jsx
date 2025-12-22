import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import API from "../api/axios";
import FallbackImage from "./FallbackImage";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-warning text-sm" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-warning text-sm" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} className="text-base-300 text-sm" />
      ))}
      <span className="ml-1 text-xs text-base-content/70">
        {rating.toFixed(1)}
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
      const response = await API.get("/decorators/top-rated");
      const data =
        response.data?.decorators ?? response.data?.data ?? response.data ?? [];
      setDecorators(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch top decorators:", error);
      setDecorators([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
            <figure className="pt-6">
              <div className="w-20 h-20 bg-base-300 rounded-full mx-auto"></div>
            </figure>
            <div className="card-body text-center p-6">
              <div className="h-4 bg-base-300 rounded mb-2"></div>
              <div className="h-3 bg-base-300 rounded mb-2"></div>
              <div className="h-3 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (decorators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">
          No decorators available at the moment
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        decorators.length === 1
          ? "grid-cols-1 max-w-sm mx-auto"
          : decorators.length === 2
          ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
          : decorators.length === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {decorators.slice(0, 4).map((decorator, index) => (
        <motion.div
          key={decorator._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <figure className="pt-6">
            <FallbackImage
              src={decorator.photo}
              alt={decorator.name}
              fallbackSrc={`https://i.pravatar.cc/150?img=${index + 1}`}
              className="rounded-full w-20 h-20 object-cover"
            />
          </figure>
          <div className="card-body text-center p-6">
            <h3 className="font-semibold text-base">{decorator.name}</h3>
            <p className="text-sm text-base-content/70 mb-3">
              {decorator.specialty ||
                decorator.specialization ||
                "Interior Designer"}
            </p>
            <StarRating rating={decorator.averageRating || 4.5} />
            <div className="text-xs text-base-content/60 mt-2">
              {decorator.totalReviews || 25}+ Reviews
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
