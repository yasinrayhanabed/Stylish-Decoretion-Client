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
        const res = await API.get(`/services/${id}`); // ✅ baseURL = /api
        setService(res.data);
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

  if (service === undefined) return <Spinner />;
  if (service === null) return <div className="text-center py-10 text-red-500">Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <img
          src={service.photo || "https://via.placeholder.com/800x400?text=Service+Image"}
          alt={service.service_name}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{service.service_name}</h1>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <div className="flex justify-between text-gray-700 font-semibold mb-4">
            <span>Category: {service.category}</span>
            <span>Cost: BDT {service.cost}</span>
            <span>Unit: {service.unit || "N/A"}</span>
          </div>
          <button
            onClick={handleBook}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
