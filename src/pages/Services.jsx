import React, { useState, useEffect } from "react";
import API from "../api/axios";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function fetchServices() {
      let url = "/services?";
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}&`;
      if (sortBy) url += `sort=${sortBy}&`;
      const res = await API.get(url);
      setServices(res.data);
    }
    fetchServices();
  }, [search, category, sortBy]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="home">Home</option>
          <option value="wedding">Wedding</option>
          <option value="office">Office</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="">Sort By</option>
          <option value="cost_asc">Cost: Low to High</option>
          <option value="cost_desc">Cost: High to Low</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}
