import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import EnhancedBookingForm from "../components/EnhancedBookingForm";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaInfoCircle } from "react-icons/fa";

export default function BookingPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [service, setService] = useState(location.state?.service || null);
  const [loading, setLoading] = useState(!location.state?.service);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.warn("Please log in to book a service.");
      nav("/login", { state: { from: `/booking/${id}` } });
    }
  }, [user, authLoading, nav, id]);

  useEffect(() => {
    if (!id || !user || service) {
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
      // Ensure we capture the booking ID correctly from different possible response structures
      const newBookingId =
        res.data.bookingId ||
        res.data._id ||
        res.data.booking?._id ||
        res.data.data?._id;

      if (!newBookingId) {
        console.error("Booking ID missing in response:", res.data);
        toast.error(
          "Booking created but ID missing. Please check My Bookings."
        );
        nav("/dashboard/my-bookings");
        return;
      }

      toast.success("Booking completed! Redirecting to payment...");
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          bookingId: newBookingId,
          serviceName: service.service_name,
          amount: bookingData.finalAmount,
          ...finalBookingData,
        })
      );

      nav("/payment");
    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) return <Spinner />;

  if (!service)
    return (
      <div className="text-center py-10 text-red-500">
        Service details unavailable.
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 text-base-content py-8">
      <div className="container mx-auto px-4">
        {/* Header Section with Steps */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6 md:mb-8 max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">
            Booking For {service.service_name}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Booking Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="card bg-base-100 text-base-content shadow-xl border border-base-300">
              <div className="card-body">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-base-200 pb-4">
                  <FaCalendarCheck className="text-primary" />
                  Fill Booking Information
                </h3>
                <EnhancedBookingForm
                  service={{
                    ...service,
                    name: service.service_name,
                    price: service.cost,
                    category: service.service_category || service.category,
                  }}
                  initialValues={{
                    name: user?.name || "",
                    email: user?.email || "",
                  }}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
