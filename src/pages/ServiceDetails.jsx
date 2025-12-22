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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setService(null);
      return;
    }

    let mounted = true;

    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        const normalized = normalizeService(res.data);

        if (!normalized || !normalized._id) {
          throw new Error("Invalid service data");
        }

        if (mounted) setService(normalized);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Service not found or has been removed"
          );
          setService(null);
        }
      }
    };

    fetchService();
    return () => (mounted = false);
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.warn("Please login to book a service");
      navigate("/login");
      return;
    }
    navigate(`/booking/${service._id}`, { state: { service } });
  };

  if (service === undefined) return <Spinner />;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="card shadow-2xl rounded-xl overflow-hidden">
            <div className="relative h-96">
              <FallbackImage
                src={service.images?.[0]}
                alt={service.service_name}
                category={service.category}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 right-4 badge badge-primary badge-lg">
                {formatCurrency(service.cost, {
                  currency: "৳",
                  showCurrency: true,
                })}
              </div>
            </div>

            <div className="card-body p-8">
              <h1 className="text-4xl font-bold mb-4">
                {service.service_name}
              </h1>

              <div className="flex gap-2 mb-4">
                <span className="badge badge-secondary">
                  {service.category}
                </span>
                <span className="badge badge-outline">
                  {service.unit || "Per Service"}
                </span>
              </div>

              <p className="text-lg opacity-80 mb-6">{service.description}</p>

              <div className="divider"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Category</div>
                  <div className="stat-value text-lg">{service.category}</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Cost</div>
                  <div className="stat-value text-lg">
                    {formatCurrency(service.cost, {
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
                  className="btn btn-primary btn-lg px-10"
                >
                  📝 Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
