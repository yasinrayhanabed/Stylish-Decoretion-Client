import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(undefined);
  const nav = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        if (!res.data || Object.keys(res.data).length === 0) {
          setService(null); // mark as not found
        } else {
          setService(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setService(null);
      }
    };
    fetchService();
  }, [id]);

  const handleBook = () => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");
    nav(`/booking/${id}`);
  };

  if (service === undefined) return <Spinner />; // loading state
  if (service === null)
    return (
      <div className="text-center py-20 text-red-500 font-semibold text-xl">
        Service not found
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col lg:flex-row gap-6">
        {/* Service Image */}
        <div className="lg:w-1/2">
          <img
            src={service.images?.[0] || "https://via.placeholder.com/800x500?text=Service+Image"}
            alt={service.service_name}
            className="w-full h-80 lg:h-full object-cover"
          />
        </div>

        {/* Service Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{service.service_name}</h1>
            <p className="text-gray-700 mb-4">{service.description}</p>

            <div className="flex flex-wrap gap-4 text-gray-700 font-semibold mb-6">
              <span>Category: {service.category || "N/A"}</span>
              <span>Cost: BDT {service.cost || "0"}</span>
              <span>Unit: {service.unit || "N/A"}</span>
            </div>
          </div>

          <button
            onClick={handleBook}
            className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-600 transition w-full lg:w-auto"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
