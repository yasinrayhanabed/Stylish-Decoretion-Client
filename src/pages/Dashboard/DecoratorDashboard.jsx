import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth"; 
import Forbidden from "../../components/Forbidden"; 
import BookingErrorBoundary from "../../components/BookingErrorBoundary";
import { toast } from "react-toastify";
import { formatBookingId, sanitizeBookingData } from "../../utils/bookingUtils";
import { useSearch } from "../../hooks/useSearch";
import { FaPalette, FaClipboardList, FaBolt, FaCheckCircle, FaUser, FaCalendar, FaIdCard, FaSleigh, FaBullseye, FaSearch, FaFilter, FaDollarSign, FaClock, FaMapMarkerAlt, FaPhone, FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Search and filter functionality
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    updateFilter,
    clearFilters,
    filteredData: filteredBookings,
    totalResults
  } = useSearch(bookings || [], ['serviceName', 'userName', 'status', 'date']);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  // Role Check
  if (!authLoading && user && user.role !== 'decorator') {
    return <Forbidden roleRequired="Decorator" />;
  }
  
  // Utility function to get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      "Assigned": { color: "bg-blue-500", icon: FaClipboardList, text: "New Assignment" },
      "Planning Phase": { color: "bg-indigo-500", icon: FaClock, text: "Planning" },
      "Materials Prepared": { color: "bg-purple-500", icon: FaCheckCircle, text: "Materials Ready" },
      "On the Way to Venue": { color: "bg-yellow-500", icon: FaMapMarkerAlt, text: "En Route" },
      "Setup in Progress": { color: "bg-orange-500", icon: FaBolt, text: "Setting Up" },
      "Completed": { color: "bg-green-500", icon: FaCheckCircle, text: "Completed" },
      "Canceled": { color: "bg-red-500", icon: FaUser, text: "Canceled" }
    };
    return statusMap[status] || { color: "bg-gray-500", icon: FaClock, text: status };
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;
    
    try {
      setLoading(true); 
      const response = await API.put(`/bookings/${bookingId}`, { status: newStatus });
      
      if (response.data && (response.data.success || response.status === 200)) {
        toast.success(`Project status updated to: ${newStatus}`);
        setReloadTrigger((prev) => prev + 1);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error(err.response?.data?.message || "Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await API.get('/payments/decorator-history');
      setPaymentHistory(response.data || []);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };

  useEffect(() => {
    const fetchAssignedBookings = async () => { 
      setLoading(true);
      try {
        const response = await API.get('/bookings/assigned');
        
        let bookingsData = [];
        if (response.data && response.data.success) {
          bookingsData = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          bookingsData = response.data;
        }
        
        const sanitizedBookings = bookingsData.map((booking, index) => {
          return sanitizeBookingData(booking, index);
        });
        
        setBookings(sanitizedBookings);
        fetchPaymentHistory();
      } catch (err) {
        console.error("Error fetching assigned bookings:", err);
        toast.error("Failed to fetch assigned projects.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === 'decorator') {
      fetchAssignedBookings();
    } else if (!authLoading) {
      setLoading(false); 
      setBookings([]);
    }
  }, [user, reloadTrigger, authLoading]); 

  if (authLoading || loading || bookings === null) return <Spinner />;

  return (
    <BookingErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <FaPalette className="mr-3" /> 
                Welcome, Decorator {user?.name || 'User'}!
              </h1>
              <p className="text-purple-100 text-lg">Manage your decoration projects and create beautiful experiences</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaPalette className="text-3xl" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 group hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {bookings?.length || 0}
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
                  {bookings?.filter(b => b.status !== 'Completed').length || 0}
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
                  {bookings?.filter(b => b.status === 'Completed').length || 0}
                </div>
                <div className="text-sm text-green-500 font-medium">Completed Projects</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FaCheckCircle className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 group hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0)}
                </div>
                <div className="text-sm text-blue-500 font-medium">Total Earnings</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaDollarSign className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaSearch className="mr-2 text-indigo-600" />
            Search & Filter Projects
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative col-span-1 md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by service name, client name, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            <select
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            >
              <option value="">🔍 All Statuses</option>
              {PROJECT_STATUSES.map(status => {
                const statusInfo = getStatusInfo(status);
                return (
                  <option key={status} value={status}>
                    {statusInfo.text}
                  </option>
                );
              })}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            >
              <option value="">📊 Sort By</option>
              <option value="date">📅 Project Date</option>
              <option value="serviceName">🎨 Service Name</option>
              <option value="status">📋 Status</option>
              <option value="userName">👤 Client Name</option>
            </select>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors flex items-center font-medium"
            >
              {sortOrder === 'asc' ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
              {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
            
            {(searchTerm || Object.keys(filters).length > 0 || sortBy) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center font-medium"
              >
                <FaFilter className="mr-2" />
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">
              📊 Showing <span className="text-indigo-600 font-bold">{totalResults}</span> of <span className="font-bold">{bookings?.length || 0}</span> projects
            </span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                🔍 "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              <FaBullseye className="inline mr-2" /> My Projects
            </h3>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaSleigh className="text-4xl text-gray-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-700 mb-3">
                {searchTerm || Object.values(filters).some(f => f) ? '🔍 No Matching Projects Found' : '📋 No Projects Assigned Yet'}
              </h4>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? 'Try adjusting your search terms or filters to find the projects you\'re looking for.' 
                  : 'You don\'t have any projects assigned right now. New assignments will appear here!'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedBookings.map((b, index) => {
                  const globalIndex = startIndex + index;
                  const statusInfo = getStatusInfo(b.status);
                  const StatusIcon = statusInfo.icon;
                  const isCompleted = b.status === 'Completed';
                  const isCanceled = b.status === 'Canceled';
                  const canUpdate = !isCompleted && !isCanceled;
                  
                  return (
                    <div
                      key={b._id}
                      className={`bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-300 group relative overflow-hidden ${
                        isCompleted ? 'border-green-200' : isCanceled ? 'border-red-200' : 'border-gray-100'
                      }`}
                    >
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          #{globalIndex + 1}
                        </div>
                      </div>
                      
                      <div className="mb-4 pr-12">
                        <h4 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                          🎨 {b.serviceName || 'Service N/A'}
                        </h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaUser className="mr-2 text-indigo-500" />
                            <span className="font-medium">Client:</span>
                            <span className="ml-1 font-semibold text-gray-800">{b.userName || 'Unknown User'}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaCalendar className="mr-2 text-green-500" />
                            <span className="font-medium">Date:</span>
                            <span className="ml-1 font-semibold text-gray-800">
                              {new Date(b.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaIdCard className="mr-2 text-purple-500" />
                            <span className="font-medium">ID:</span>
                            <span className="ml-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded font-bold">
                              {formatBookingId(b._id, globalIndex)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className={`flex items-center p-3 rounded-xl ${statusInfo.color} text-white shadow-md`}>
                          <StatusIcon className="mr-3 text-lg" />
                          <div>
                            <div className="font-bold text-sm">{statusInfo.text}</div>
                            <div className="text-xs opacity-90">{b.status}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <FaBolt className="mr-2 text-orange-500" />
                          Update Project Status
                        </label>
                        
                        {canUpdate ? (
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium bg-white shadow-sm"
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                            disabled={loading}
                          >
                            {PROJECT_STATUSES.map(s => {
                              const optionInfo = getStatusInfo(s);
                              const isDisabled = PROJECT_STATUSES.indexOf(s) < PROJECT_STATUSES.indexOf(b.status);
                              return (
                                <option key={s} value={s} disabled={isDisabled}>
                                  {optionInfo.text} {isDisabled ? '(Already Passed)' : ''}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <div className={`p-3 rounded-xl text-center font-medium ${
                            isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCompleted ? '✅ Project Completed' : '❌ Project Canceled'}
                            <div className="text-xs mt-1 opacity-75">
                              {isCompleted ? 'No further updates needed' : 'Cannot be updated'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <FaChevronLeft className="mr-1" /> Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center"
                  >
                    Next <FaChevronRight className="ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Payment History Section */}
        {paymentHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              <FaDollarSign className="inline mr-2" /> Recent Payments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Project Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount Earned</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.slice(0, 5).map((payment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{payment.serviceName}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">৳{payment.amount?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </BookingErrorBoundary>
  );
}