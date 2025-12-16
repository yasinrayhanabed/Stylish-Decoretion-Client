import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import EnhancedBookingForm from "../components/EnhancedBookingForm";

export default function BookingPage() {
  const { id } = useParams(); 
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.warn("Please log in to book a service.");
      nav("/login", { state: { from: `/book-service/${id}` } });
    }
  }, [user, authLoading, nav, id]);

  useEffect(() => {
    if (!id || !user) {
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
  }, [id, nav, user]);

  const handleSubmit = async (bookingData) => {
    if (authLoading || !user) return;

    if (!service) {
        toast.error("Service data is missing. Cannot book.");
        return;
    }
    
    const finalBookingData = {
        serviceId: service._id,
        serviceName: service.service_name,
        serviceCategory: service.service_category,
        ...bookingData,
        userId: user._id, 
        userName: user.name,
        userEmail: user.email,
    };

    setLoading(true);
    try {
      const res = await API.post("/bookings", finalBookingData);
      
      toast.success("Booking created successfully! Proceeding to payment.");
      localStorage.setItem('pendingBooking', JSON.stringify({
        bookingId: res.data.bookingId || res.data._id,
        serviceName: service.service_name,
        amount: bookingData.finalAmount,
        ...finalBookingData
      }));
      
      nav('/payment');

    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) return <Spinner />;

  if (!service) return <div className="text-center py-10 text-red-500">Service details unavailable.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Book Service: {service.service_name}</h1>
          <p className="text-gray-600">Complete your booking with our enhanced features</p>
        </div>
        
        <EnhancedBookingForm 
          service={{
            ...service,
            name: service.service_name,
            price: service.cost,
            category: service.service_category
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}