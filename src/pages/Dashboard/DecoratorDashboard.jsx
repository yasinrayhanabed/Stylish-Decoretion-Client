import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth"; 
import Forbidden from "../../components/Forbidden"; 
import { toast } from "react-toastify";

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
      if (response.data.success) {
        toast.success(`Project status updated to: ${newStatus}`);
        setReloadTrigger((prev) => prev + 1); // Refetch data
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed due to server error.");
      console.error("Status update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAssignedBookings = () => { 
      setLoading(true);
      // Fetch bookings assigned to the current logged-in decorator
      API.get('/bookings/assigned-to-me') 
        .then(r => setBookings(r.data || []))
        .catch(err => {
          console.error("Error fetching assigned bookings:", err);
          toast.error("Failed to fetch assigned projects.");
          setBookings([]);
        })
        .finally(() => setLoading(false));
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
    <div className="p-4">
      <h2 className="text-4xl text-blue-700 font-bold mb-8 border-b pb-3">
        Welcome, Decorator {user.name}!
      </h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-600">
            {bookings.length}
          </div>
          <div className="text-sm text-blue-500">Total Assigned Projects</div>
        </div>
        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status !== 'Completed').length}
          </div>
          <div className="text-sm text-yellow-500">In Progress</div>
        </div>
        <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'Completed').length}
          </div>
          <div className="text-sm text-green-500">Completed Projects</div>
        </div>
      </div>


      <section className="mt-8">
        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">
          My Assigned Projects
        </h3>

        {bookings.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg text-gray-600">
            No projects currently assigned to you. Enjoy the break!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="p-5 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500"
              >
                <div className="font-bold text-xl text-gray-800">
                  {b.serviceName || 'Service N/A'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Customer: {b.userName || 'Unknown User'}
                </div>
                <div className="text-sm text-gray-500">
                  Date: {new Date(b.date).toLocaleDateString()}
                </div>

                <div className={`mt-3 font-extrabold text-lg flex justify-between items-center`}>
                  Status:
                  <span
                    className={`ml-2 px-3 py-1 text-xs rounded-full text-white font-bold ${getStatusColor(b.status)}`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {/* Dropdown for status update */}
                  <label className="label">
                    <span className="label-text text-sm">Update Project Stage</span>
                  </label>
                  <select
                    className="select select-bordered select-sm w-full"
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
              </div> ))}
          </div>
        )}
      </section>
    </div>
  );
}