// src/pages/BookingPage.jsx (FIXED - Service Details Page এর Book Now button-এর মাধ্যমে আসা ফর্ম)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth"; // 💡 Added useAuth

export default function BookingPage() {
  const { id } = useParams(); 
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth(); // 💡 Get user info
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // 💡 Authentication Check
  useEffect(() => {
    if (!authLoading && !user) {
      toast.warn("Please log in to book a service.");
      nav("/login", { state: { from: `/book-service/${id}` } }); // Redirect to login
    }
  }, [user, authLoading, nav, id]);


  useEffect(() => {
    if (!id || !user) { // Only fetch service if id and user are available
      setLoading(false);
      return;
    }
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Failed to fetch service for booking:", err);
        toast.error("Failed to load service details.");
        nav("/services"); 
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, nav, user]); // Added user as a dependency for fetching

  const [formData, setFormData] = useState({
    date: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authLoading || !user) return; // Double check

    if (!formData.date || !formData.location) {
      toast.error("Please fill in both Date and Location.");
      return;
    }

    if (!service) {
        toast.error("Service data is missing. Cannot book.");
        return;
    }
    
    const bookingData = {
        serviceId: service._id,
        serviceName: service.service_name,
        serviceCategory: service.service_category, // Added category
        date: formData.date,
        location: formData.location,
        cost: service.cost,
        // User info will be fetched from JWT on server side, but sending these for completeness
        userId: user._id, 
        userName: user.name,
        userEmail: user.email,
    };

    setLoading(true); // Start loading for form submission
    try {
      const res = await API.post("/bookings", bookingData);
      
      toast.success("Booking created successfully! Proceeding to payment.");
      // Store booking data for payment page
      localStorage.setItem('pendingBooking', JSON.stringify({
        bookingId: res.data.bookingId || res.data._id,
        serviceName: service.service_name,
        amount: service.cost,
        ...bookingData
      }));
      
      nav('/payment'); // Navigate to payment page

    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (authLoading || loading || !user) return <Spinner />;

  if (!service) return <div className="text-center py-10 text-red-500">Service details unavailable.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Book Service: {service.service_name}</h1>
      
      {/* Service Summary */}
      <div className="mb-6 p-4 border rounded-lg bg-blue-50">
        <p className="font-semibold text-gray-700 text-lg">Service: {service.service_name}</p>
        <p className="text-gray-700 font-bold">Cost: BDT {service.cost} {service.unit ? `/ ${service.unit}` : ''}</p>
        <p className="text-sm text-gray-500 mt-2">Category: {service.service_category || 'General'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700">Your Details</h2>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="label">
                    <span className="label-text">Name</span>
                </label>
                <input 
                    type="text" 
                    value={user.name || 'N/A'} // 💡 Use user from useAuth
                    disabled 
                    className="input input-bordered w-full text-gray-700 bg-gray-200" 
                />
            </div>
            <div>
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input 
                    type="email" 
                    value={user.email || 'N/A'} // 💡 Use user from useAuth
                    disabled 
                    className="input input-bordered w-full text-gray-700 bg-gray-100" 
                />
            </div>
        </div>

        {/* Booking Specific Inputs */}
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 pt-4 text-gray-700">Booking Details</h2>
        
        <div>
            <label className="label">
                <span className="label-text font-medium">Booking Date (Required)</span>
            </label>
            <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input input-bordered w-full" 
            />
        </div>
        
        <div>
            <label className="label">
                <span className="label-text font-medium">Event Location/Address (Required)</span>
            </label>
            <textarea 
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                rows="3"
                className="textarea textarea-bordered w-full" 
                placeholder="Full address, City, Landmark..."
            ></textarea>
        </div>

        <button 
            type="submit" 
            className="btn btn-primary w-full bg-green-600 hover:bg-green-700 border-none text-white mt-6"
            disabled={loading}
        >
            {loading ? 'Processing...' : `Confirm Booking (BDT ${service.cost})`}
        </button>
      </form>
    </div>
  );
}