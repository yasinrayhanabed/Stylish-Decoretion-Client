import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(undefined);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({ date: "", location: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const nav = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  console.log("Attempting to fetch service with ID:", id); 

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setService(null);
        return;
      }
      try {
        const res = await API.get(`/services/${id}`); 
        setService(res.data);
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setService(null); 
      }
    };
    fetchService();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.warn("Please log in to book a service.");
      return nav("/login");
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.location) {
      toast.error("Please fill in both Date and Location.");
      return;
    }

    setBookingLoading(true);
    try {
      const booking = {
        serviceId: service._id,
        serviceName: service.service_name,
        serviceCategory: service.category,
        date: bookingData.date,
        location: bookingData.location,
        cost: service.cost,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      };

      const res = await API.post("/bookings", booking);
      toast.success("Booking created successfully! Proceeding to payment.");
      nav(`/payment/${res.data.bookingId}`);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setBookingData({ date: "", location: "" });
  };

  if (service === undefined) return <Spinner />;
  if (service === null)
    return (
      <div className="text-center py-10 text-red-500">Service not found</div>
    );

  return (
    <>
      <div className="min-h-screen bg-base-100">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-2xl overflow-hidden">
              <figure className="relative">
                <img
                  src={
                    (service.images && service.images[0]) || service.photo ||
                    "https://via.placeholder.com/800x400?text=Service+Image"
                  }
                  alt={service.service_name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 badge badge-primary badge-lg font-bold">
                  BDT {service.cost}
                </div>
              </figure>
              
              <div className="card-body">
                <h1 className="card-title text-4xl mb-4">{service.service_name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="badge badge-secondary">{service.category}</div>
                  {service.unit && <div className="badge badge-outline">{service.unit}</div>}
                </div>
                
                <p className="text-base-content/80 text-lg leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <div className="divider"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Category</div>
                    <div className="stat-value text-lg">{service.category}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Cost</div>
                    <div className="stat-value text-lg">BDT {service.cost}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Unit</div>
                    <div className="stat-value text-lg">{service.unit || "Per Service"}</div>
                  </div>
                </div>
                
                <div className="card-actions justify-center">
                  <button
                    onClick={handleBookNow}
                    className="btn btn-primary btn-lg px-8"
                  >
                    📝 Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-4">Book Service: {service.service_name}</h3>
            
            {/* Service Summary */}
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{service.service_name}</p>
                  <p className="text-sm opacity-70">{service.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">BDT {service.cost}</p>
                  {service.unit && <p className="text-sm opacity-70">per {service.unit}</p>}
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input 
                    type="text" 
                    value={user?.name || 'N/A'} 
                    disabled 
                    className="input input-bordered bg-base-200" 
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    value={user?.email || 'N/A'} 
                    disabled 
                    className="input input-bordered bg-base-200" 
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Booking Date *</span>
                </label>
                <input 
                  type="date" 
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input input-bordered" 
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Location/Address *</span>
                </label>
                <textarea 
                  value={bookingData.location}
                  onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
                  required
                  rows="3"
                  className="textarea textarea-bordered" 
                  placeholder="Full address, City, Landmark..."
                ></textarea>
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : `Confirm Booking (BDT ${service.cost})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}