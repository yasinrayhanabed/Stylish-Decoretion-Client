import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth"; 
import Forbidden from "../../components/Forbidden"; 
import BookingErrorBoundary from "../../components/BookingErrorBoundary";
import { toast } from "react-toastify";
import { formatBookingId, sanitizeBookingData, validateBookingData } from "../../utils/bookingUtils";
import { FaPalette, FaClipboardList, FaBolt, FaCheckCircle, FaUser, FaCalendar, FaIdCard, FaSleigh, FaBullseye } from "react-icons/fa";

const PROJECT_STATUSES = [
  "Assigned", 
  "Planning Phase", 
  "Materials Prepared", 
  "On the Way to Venue", 
  "Setup in Progress", 
  "Completed"
];



export default function DecoratorDashboard() {
  const { user, loading: authLoading } = useAuth(); 
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Role Check: If user is logged in but not a decorator, show Forbidden page
  if (!authLoading && user && user.role !== 'decorator') {
    return <Forbidden roleRequired="Decorator" />;
  }
  
  // Utility function to get status badge color
  const getStatusColor = (status) => {
    if (status === "Completed") return "bg-green-500";
    if (status === "Canceled") return "bg-red-500";
    if (status === "Assigned" || status === "Planning Phase") return "bg-blue-500";
    return "bg-orange-500";
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (
      !window.confirm(`Are you sure you want to change status to "${newStatus}"?`)
    )
      return;
    try {
      setLoading(true); 
      // Server endpoint to handle the status update
      const response = await API.put(`/bookings/${bookingId}`, { status: newStatus });
      
      if (response.data && (response.data.success || response.status === 200)) {
        toast.success(`Project status updated to: ${newStatus}`);
        setReloadTrigger((prev) => prev + 1); // Refetch data
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        toast.error("Access denied. You don't have permission to update this booking.");
      } else if (err.response?.status === 404) {
        toast.error("Booking not found.");
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        toast.error("Network error. Please check server connection.");
      } else {
        toast.error(err.response?.data?.message || "Status update failed due to server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAssignedBookings = async () => { 
      setLoading(true);
      try {
        // Fetch bookings assigned to the current logged-in decorator
        const response = await API.get('/bookings/assigned-to-me');
        
        // Check if response has data property
        let bookingsData = [];
        if (response.data && response.data.success) {
          bookingsData = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          bookingsData = response.data;
        }
        
        // Sanitize and validate booking data
        const sanitizedBookings = bookingsData.map((booking, index) => {
          return sanitizeBookingData(booking, index);
        });
        
        setBookings(sanitizedBookings);
      } catch (err) {
        console.error("Error fetching assigned bookings:", err);
        
        // More specific error messages
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
        } else if (err.response?.status === 403) {
          toast.error("Access denied. Decorator role required.");
        } else if (err.response?.status === 404) {
          toast.error("API endpoint not found. Please check server configuration.");
        } else if (err.code === 'NETWORK_ERROR' || !err.response) {
          toast.error("Network error. Please check if the server is running on http://localhost:5000");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch assigned projects.");
        }
        
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch only if user is logged in AND is a decorator
    if (user && user.role === 'decorator') {
      fetchAssignedBookings();
    } else if (!authLoading) {
      // If not a decorator/logged out, stop initial loading
      setLoading(false); 
      setBookings([]);
    }
  }, [user, reloadTrigger, authLoading]); 

  if (authLoading || loading || bookings === null) return <Spinner />;

  return (
    <BookingErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-gradient-to-r from-purple-500 to-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              <FaPalette className="inline mr-2" /> Welcome, Decorator {user.name}!
            </h1>
            <p className="text-gray-600 text-lg">Manage your projects and create beautiful decorations</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <FaPalette className="text-3xl text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {bookings.length}
              </div>
              <div className="text-sm text-purple-500 font-medium">Total Projects</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <FaClipboardList className="text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {bookings.filter(b => b.status !== 'Completed').length}
              </div>
              <div className="text-sm text-orange-500 font-medium">Ongoing Work</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <FaBolt className="text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {bookings.filter(b => b.status === 'Completed').length}
              </div>
              <div className="text-sm text-green-500 font-medium">Completed Projects</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FaCheckCircle className="text-2xl" />
            </div>
          </div>
        </div>
      </div>


      {/* Projects Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <FaBullseye className="inline mr-2" /> My Projects
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Active Projects</span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSleigh className="text-4xl" />
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No Projects!</h4>
            <p className="text-gray-500">Currently no projects are assigned to you. Take a rest!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b, index) => (
              <div
                key={b._id}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {b.serviceName || 'Service N/A'}
                    </h4>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>Client: {b.userName || 'Unknown User'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="mr-2" />
                        <span>Date: {new Date(b.date).toLocaleDateString('en-US')}</span>
                      </div>
                      <div className="flex items-center">
                        <FaIdCard className="mr-2" />
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {formatBookingId(b._id, index)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full text-white font-bold ${getStatusColor(b.status)} shadow-sm`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* Status Update Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Update Project Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    value={b.status}
                    onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                    disabled={b.status === 'Completed' || b.status === 'Canceled' || loading}
                  >
                    {PROJECT_STATUSES.map(s => (
                      <option key={s} value={s} disabled={PROJECT_STATUSES.indexOf(s) < PROJECT_STATUSES.indexOf(b.status)}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </BookingErrorBoundary>
  );
}