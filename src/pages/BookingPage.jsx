import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

export default function BookingPage() {
  const { id } = useParams(); 
  const nav = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (!id) {
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
  }, [id, nav]);

  const [formData, setFormData] = useState({
    date: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        serviceCost: service.cost,
        date: formData.date,
        location: formData.location,
        cost: service.cost 
    };

    try {
      const res = await API.post("/bookings", bookingData);
      
      toast.success("Booking created successfully! Proceeding to payment.");
      nav(`/payment/${res.data.bookingId}`); 

    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error(err.response?.data?.message || "Failed to create booking. Please try again.");
    }
  };

  if (loading) return <Spinner />;

  if (!service) return <div className="text-center py-10 text-red-500">Service details unavailable.</div>;
  if (!userData) return <div className="text-center py-10 text-red-500">User data is missing. Please log in again.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-base-200 shadow-2xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Book Service: {service.service_name}</h1>
      
      <div className="mb-6 p-4 border rounded-lg bg-blue-50">
        <p className="font-semibold text-gray-700 text-lg">Service: {service.service_name}</p>
        <p className="text-gray-700">Cost: BDT {service.cost}</p>
        <p className="text-sm text-gray-500 mt-2">ID: {service._id}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-200">Your Details</h2>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="label">
                    <span className="label-text">Name</span>
                </label>
                <input 
                    type="text" 
                    value={userData.name || 'N/A'} 
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
                    value={userData.email || 'N/A'} 
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
            className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none text-white mt-6"
        >
            Confirm Booking (BDT {service.cost})
        </button>
      </form>
    </div>
  );
}