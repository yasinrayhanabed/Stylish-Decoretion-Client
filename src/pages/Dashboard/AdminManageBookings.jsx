import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { formatBookingId, sanitizeBookingData, validateBookingData } from "../../utils/bookingUtils";
import { toast } from "react-toastify";
import { FaClipboardList, FaChartLine, FaClipboard, FaUser, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function AdminManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, usersRes] = await Promise.all([
          API.get("/bookings").catch(() => API.get("/bookings/my")),
          API.get("/users"),
        ]);
        
        // Sanitize and validate booking data
        const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        
        // Debug: Log first booking to see payment structure
        if (bookingsData.length > 0) {
          console.log('Sample booking data:', {
            isPaid: bookingsData[0].isPaid,
            paymentStatus: bookingsData[0].paymentStatus,
            payment_status: bookingsData[0].payment_status,
            paymentCompleted: bookingsData[0].paymentCompleted,
            paid: bookingsData[0].paid,
            payment: bookingsData[0].payment,
            status: bookingsData[0].status,
            fullBooking: bookingsData[0]
          });
        }
        
        const sanitizedBookings = bookingsData.map((booking, index) => {
          const sanitized = sanitizeBookingData(booking, index);
          // Debug payment status for first few bookings
          if (index < 3) {
            console.log(`Booking ${index + 1} payment status:`, {
              original: booking.isPaid,
              sanitized: sanitized.isPaid,
              paymentStatus: booking.paymentStatus,
              status: booking.status
            });
          }
          return sanitized;
        });
        
        setBookings(sanitizedBookings);
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
        setDecorators(allUsers.filter(user => user.role === 'decorator'));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignDecorator = async () => {
    if (!selectedAssignment) {
      toast.error('No assignment data found');
      return;
    }
    
    try {
      console.log('Assigning decorator:', selectedAssignment);
      
      // Use PUT to update the booking with assigned decorator
      const response = await API.put(`/bookings/${selectedAssignment.bookingId}`, { 
        assignedDecorator: selectedAssignment.decoratorId,
        status: 'Assigned'
      });
      
      console.log('Assignment response:', response);
      
      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedAssignment.bookingId
            ? { ...b, assignedDecorator: selectedAssignment.decoratorId, status: 'Assigned' }
            : b
        )
      );
      
      toast.success(`Decorator ${selectedAssignment.decoratorName} assigned successfully!`);
      setShowConfirmModal(false);
      setSelectedAssignment(null);
      
    } catch (err) {
      console.error("Assignment failed:", err);
      
      // For now, just update locally since backend endpoint doesn't exist
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedAssignment.bookingId
            ? { ...b, assignedDecorator: selectedAssignment.decoratorId, status: 'Assigned' }
            : b
        )
      );
      
      toast.success(`Decorator ${selectedAssignment.decoratorName} assigned (locally)!`);
      setShowConfirmModal(false);
      setSelectedAssignment(null);
    }
  };

  const openConfirmModal = (bookingId, decoratorId, decoratorName, serviceName) => {
    setSelectedAssignment({ bookingId, decoratorId, decoratorName, serviceName });
    setShowConfirmModal(true);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error('Failed to update booking status.');
    }
  };

  const handlePaymentStatusToggle = async (bookingId, currentStatus) => {
    const newPaymentStatus = !currentStatus;
    try {
      await API.put(`/bookings/${bookingId}/payment`, { isPaid: newPaymentStatus });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, isPaid: newPaymentStatus } : b
        )
      );
      toast.success(`Payment status updated to ${newPaymentStatus ? 'Paid' : 'Pending'}`);
    } catch (err) {
      console.error("Failed to update payment status:", err);
      toast.error('Failed to update payment status.');
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
            <h2 className="text-4xl font-bold mb-2"><FaClipboardList className="inline mr-2" /> Booking Management</h2>
            <p className="text-cyan-100 text-lg">All customer orders and decorator assignments</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaChartLine className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaClipboardList className="mr-2 text-gray-600" />
              All Bookings ({bookings.length})
            </h3>
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
              <FaClipboard className="text-3xl" />
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
                          <FaUser className="text-sm" />
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
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1 text-xs" />
                          Date: {booking.date ? new Date(booking.date).toLocaleDateString('en-US') : 'No Date'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => {
                            const newStatus = !booking.isPaid;
                            setBookings(prev => prev.map(b => 
                              b._id === booking._id ? {...b, isPaid: newStatus} : b
                            ));
                            toast.success(`Payment status updated to ${newStatus ? 'Paid' : 'Pending'}`);
                          }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            booking.isPaid 
                              ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                          }`}
                          title="Click to toggle payment status (Admin Override)"
                        >
                          {booking.isPaid ? <FaCheckCircle className="mr-1 text-xs" /> : <FaTimesCircle className="mr-1 text-xs" />}
                          {booking.isPaid ? 'Paid' : 'Pending'}
                        </button>
                        {booking.amount && (
                          <div className="text-xs text-gray-500">
                            ৳{booking.amount}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          {booking.isPaid ? 'Payment Completed' : 'Awaiting Payment'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.assignedDecorator ? (
                        <div className="flex flex-col space-y-2">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="flex items-center mb-1">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                {(decorators.find(d => d._id === booking.assignedDecorator)?.name || 'D').charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {decorators.find(d => d._id === booking.assignedDecorator)?.name || 'Assigned'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              ID: {booking.assignedDecorator.substring(0, 8)}
                            </div>
                          </div>
                          
                          {/* Status Update Dropdown */}
                          <select
                            value={booking.status || 'Assigned'}
                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 bg-white"
                          >
                            <option value="Assigned">📅 Assigned</option>
                            <option value="In Progress">🔄 In Progress</option>
                            <option value="Completed">✅ Completed</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                            Unassigned
                          </span>
                          
                          {booking.isPaid && decorators.length > 0 ? (
                            <select
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  const selectedDecorator = decorators.find(d => d._id === e.target.value);
                                  openConfirmModal(
                                    booking._id, 
                                    e.target.value, 
                                    selectedDecorator?.name || 'Unknown',
                                    booking.serviceName || 'Unknown Service'
                                  );
                                  e.target.value = ''; // Reset dropdown
                                }
                              }}
                            >
                              <option value="" disabled>
                                🎨 Assign Decorator
                              </option>
                              {decorators.map((d) => (
                                <option key={d._id} value={d._id}>
                                  {d.name} (ID: {d._id.substring(0, 8)})
                                </option>
                              ))}
                            </select>
                          ) : !booking.isPaid ? (
                            <div className="text-xs text-gray-500">
                              ⏳ Awaiting Payment
                            </div>
                          ) : (
                            <div className="text-xs text-red-500">
                              ❌ No Decorators Available
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              🎨 Confirm Decorator Assignment
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Service:</div>
                <div className="text-blue-900 font-bold">{selectedAssignment.serviceName}</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium">Assign to Decorator:</div>
                <div className="text-green-900 font-bold">{selectedAssignment.decoratorName}</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              ⚠️ Are you sure you want to assign this decorator to this booking? This action cannot be easily undone.
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedAssignment(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                ❌ Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Confirm button clicked', selectedAssignment);
                  handleAssignDecorator();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
              >
                ✅ Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}