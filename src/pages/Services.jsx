import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== "All") params.category = category;
      if (sort) params.sort = sort;

      const res = await API.get("/services", { params });
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, category, sort]);

  const categories = ["All", "Wedding", "Decoration", "Party", "Birthday"];

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Our Services</h1>

      {/* Search + Category + Sort */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort by</option>
          <option value="cost_asc">Cost Low → High</option>
          <option value="cost_desc">Cost High → Low</option>
        </select>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-center text-gray-500">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-red-500 font-semibold">No services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="border rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col bg-white"
            >
              <img
                src={service.images?.[0] || "https://via.placeholder.com/400x250?text=Service+Image"}
                alt={service.service_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-bold text-2xl mb-2 text-gray-800">{service.service_name}</h2>
                <p className="text-gray-600 mb-4 flex-1 line-clamp-3">{service.description}</p>
                <div className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-4">
                  <span>Category: {service.category}</span>
                  <span>Cost: BDT {service.cost}</span>
                </div>
                <Link
                  to={`/services/${service._id}`}
                  className="bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
