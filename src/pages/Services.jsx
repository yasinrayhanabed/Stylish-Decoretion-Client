import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { PageSkeleton } from "../components/PageSkeleton";
import { motion } from "framer-motion";

export default function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await API.get("/services");
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services.filter(service => {
      const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "" || service.category === selectedCategory;
      const matchesBudget = (
        (minBudget === "" || service.cost >= parseInt(minBudget)) &&
        (maxBudget === "" || service.cost <= parseInt(maxBudget))
      );
      return matchesSearch && matchesCategory && matchesBudget;
    });
    setFilteredServices(filtered);
  };

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, minBudget, maxBudget, services]);

  useEffect(() => {
    fetchServices();
  }, []);


  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hero min-h-[40vh] bg-gradient-to-r from-primary to-secondary"
      >
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl">Professional decoration services for every occasion</p>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 bg-base-200 p-6 rounded-xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Budget (BDT)"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="input input-bordered w-full"
            />
            <input
              type="number"
              placeholder="Max Budget (BDT)"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </motion.div>
        {loading ? (
          <PageSkeleton />
        ) : filteredServices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-base-content">
              {services.length === 0 ? "No services available" : "No services match your criteria"}
            </p>
            <p className="text-base-content/70 mt-2">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <figure className="relative overflow-hidden">
                  <img
                    src={(service.images && service.images[0]) || service.photo || "https://via.placeholder.com/400x250?text=Service+Image"}
                    alt={service.service_name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 badge badge-primary font-bold">
                    BDT {service.cost}
                  </div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">{service.service_name}</h2>
                  <p className="text-base-content/70 text-sm line-clamp-2">{service.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="badge badge-outline text-xs">{service.category}</div>
                    {service.unit && <div className="badge badge-ghost text-xs">{service.unit}</div>}
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/services/${service._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
