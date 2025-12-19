import React, { useState } from "react";
import API from "../api/axios";

const FallbackImage = ({
  src,
  alt,
  className = "",
  fallbackSrc = null,
  category = "decoration",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getFallbackImage = () => {
    if (fallbackSrc) return fallbackSrc;

    const fallbackImages = {
      "Wedding Decoration":
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=250&fit=crop",
      "Birthday Decoration":
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=250&fit=crop",
      "Corporate Event":
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop",
      "Home Decoration":
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
      "Party Decoration":
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
      "Festival Decoration":
        "https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?w=400&h=250&fit=crop",
      default:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
    };

    return fallbackImages[category] || fallbackImages["default"];
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const resolveBackendUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
    const apiBase = API.defaults.baseURL.replace(/\/api\/?$/, "");
    if (path.startsWith("/")) return `${apiBase}${path}`;
    return `${apiBase}/${path}`;
  };

  const getImageSrc = () => {
    if (imageError) return getFallbackImage();

    if (!src) return getFallbackImage();

    // resolve relative paths (like /uploads/xxx or uploads/xxx) to backend origin
    const resolved = resolveBackendUrl(src);
    return resolved || getFallbackImage();
  };

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`absolute inset-0 bg-base-200 animate-pulse flex items-center justify-center ${className}`}
        >
          <div className="loading loading-spinner loading-md"></div>
        </div>
      )}
      <img
        src={getImageSrc()}
        alt={alt}
        className={`${className} ${
          imageLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

export default FallbackImage;
