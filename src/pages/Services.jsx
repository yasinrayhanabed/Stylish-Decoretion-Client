import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";


export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await API.get("/services");
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
  }, []);


  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Services</h1>
      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-red-500 font-semibold">No services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="border rounded-xl shadow-lg overflow-hidden flex flex-col bg-white">
              <img
                src={service.photo || "https://via.placeholder.com/400x250?text=Service+Image"}
                alt={service.service_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-bold text-2xl mb-2">{service.service_name}</h2>
                <p className="flex-1 text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                <div className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-4">
                  <span>Category: {service.category}</span>
                  <span>Cost: BDT {service.cost}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/services/${service._id}`}
                    className="flex-1 bg-violet-600 text-white text-center py-2 rounded-lg hover:bg-violet-700 transition"
                  >
                    View
                  </Link>
              
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
