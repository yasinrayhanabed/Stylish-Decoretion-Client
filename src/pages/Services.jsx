import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { PageSkeleton } from "../components/PageSkeleton";
import { motion } from "framer-motion";
import ServiceCard from "../components/ServiceCard";

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredServices.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
