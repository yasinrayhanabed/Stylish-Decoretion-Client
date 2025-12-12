import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { formatBookingId, sanitizeBookingData, validateBookingData } from "../../utils/bookingUtils";
import { toast } from "react-toastify";

export default function AdminManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, decoratorsRes] = await Promise.all([
          API.get("/admin/bookings"),
          API.get("/admin/decorators"),
        ]);
        
        // Sanitize and validate booking data
        const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        const sanitizedBookings = bookingsData.map((booking, index) => {
          const validation = validateBookingData(booking);
          if (!validation.isValid) {
            console.warn(`Booking validation failed for index ${index}:`, validation.errors);
            toast.warn(`Booking data issue: ${validation.errors.join(', ')}`);
          }
          return sanitizeBookingData(booking, index);
        });
        
        setBookings(sanitizedBookings);
        setDecorators(decoratorsRes.data.filter(d => d.isActive)); // Only Active Decorators
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignDecorator = async (bookingId, decoratorId) => {
    try {
      await API.put(`/admin/bookings/${bookingId}/assign`, { decoratorId });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, assignedDecorator: decoratorId, status: 'Assigned' }
            : b
        )
      );
    } catch (err) {
      console.error("Failed to assign decorator:", err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading booking data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Booking Management 📋</h2>
            <p className="text-cyan-100 text-lg">All customer orders and decorator assignments</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">All Bookings ({bookings.length})</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Payment Completed</span>
              <span className="w-3 h-3 bg-red-500 rounded-full ml-4"></span>
              <span>Payment Pending</span>
            </div>
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No Bookings!</h4>
            <p className="text-gray-500">No customers have made bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <tr key={booking._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            {formatBookingId(booking._id, index)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking._id && booking._id.length >= 16 ? booking._id.substring(8, 16) : 'Generated ID'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {(booking.user?.name || booking.userName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.name || booking.userName || 'Unknown Customer'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.user?.email || booking.userEmail || 'No Email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.service?.service_name || booking.serviceName || 'No Service Name'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Date: {booking.date ? new Date(booking.date).toLocaleDateString('en-US') : 'No Date'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.isPaid 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {booking.isPaid ? 'Payment Completed' : 'Payment Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.assignedDecorator ? (
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {(decorators.find(d => d._id === booking.assignedDecorator)?.name || 'D').charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {decorators.find(d => d._id === booking.assignedDecorator)?.name || 'No Decorator Name'}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                          Not Assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.isPaid && !booking.assignedDecorator && decorators.length > 0 ? (
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignDecorator(booking._id, e.target.value);
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select Decorator
                          </option>
                          {decorators.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      ) : booking.isPaid && !booking.assignedDecorator ? (
                        <span className="text-xs text-red-500">No Decorators</span>
                      ) : !booking.isPaid ? (
                        <span className="text-xs text-gray-500">Waiting for Payment</span>
                      ) : (
                        <span className="text-xs text-green-600">Assignment Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}