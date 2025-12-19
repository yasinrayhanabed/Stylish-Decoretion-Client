import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import FallbackImage from "../components/FallbackImage";
import { toast } from "react-toastify";
import { normalizeService } from "../utils/serviceUtils";
import { formatCurrency } from "../utils/formatCurrency";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(undefined);
  const [fetchError, setFetchError] = useState("");
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
        setFetchError("");
        const res = await API.get(`/services/${id}`);
        // Handle both object and array responses from API
        const rawData = res.data?.data ?? res.data ?? null;
        const raw = Array.isArray(rawData) ? rawData[0] : rawData;

        // If API returns a wrapper with success:false or message, surface it
        if (!raw || (raw && raw.success === false)) {
          const msg = raw?.message || "Service not found";
          console.warn("Service fetch returned no data or error:", raw);
          setFetchError(msg);
          setService(null);
          return;
        }

        // Validate shape
        if (!raw._id && !raw.id && !raw.service_name && !raw.name) {
          console.warn("Unexpected service response shape:", raw);
          setFetchError(
            "Unexpected service response from server. See console for details."
          );
          setService(null);
          return;
        }

        setService(normalizeService(raw));
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setFetchError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch service"
        );
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
    nav(`/booking/${id}`);
  };

  if (service === undefined) return <Spinner />;
  if (service === null)
    return (
      <div className="text-center py-10 text-red-500">
        {fetchError ? fetchError : "Service not found"}
      </div>
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
            <div className="card bg-base-100 shadow-2xl overflow-hidden rounded-xl">
              <div className="relative h-96">
                <FallbackImage
                  src={service.photo}
                  alt={service.service_name}
                  category={service.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 badge badge-primary badge-lg font-bold">
                  {formatCurrency(Number(service.cost) || 0, {
                    currency: "৳",
                    showCurrency: true,
                  })}
                </div>
              </div>

              <div className="card-body p-8">
                <h1 className="card-title text-4xl mb-4">
                  {service.service_name}
                </h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="badge badge-secondary">
                    {service.category}
                  </div>
                  {service.unit && (
                    <div className="badge badge-outline">{service.unit}</div>
                  )}
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
                    <div className="stat-value text-lg">
                      {formatCurrency(Number(service.cost) || 0, {
                        currency: "৳",
                        showCurrency: true,
                      })}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Unit</div>
                    <div className="stat-value text-lg">
                      {service.unit || "Per Service"}
                    </div>
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
    </>
  );
}
