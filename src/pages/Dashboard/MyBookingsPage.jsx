import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { useSearch } from "../../hooks/useSearch";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import {
  FaCalendarAlt,
  FaSync,
  FaClipboardList,
  FaPalette,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCreditCard,
  FaCalendar,
  FaTimes,
  FaSearch,
  FaSort,
  FaFilter,
} from "react-icons/fa";
import { isPaymentCompleted } from "../../utils/bookingUtils";
import { formatCurrency } from "../../utils/formatCurrency";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "badge-warning";
    case "Confirmed":
    case "Planning Phase":
    case "In Progress":
    case "Assigned":
      return "badge-info";
    case "Completed":
      return "badge-success";
    case "Canceled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const getDisplayStatus = (booking) => {
  // If decorator is assigned, show 'Assigned'
  if (booking.assignedDecorator) {
    return booking.status || "Assigned";
  }
  // If paid but no decorator assigned, show 'In Progress'
  if (isPaymentCompleted(booking) && !booking.assignedDecorator) {
    return "In Progress";
  }
  // Otherwise show the actual status
  return booking.status || "Pending";
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hookError, setHookError] = useState(null);
  const navigate = useNavigate();

  // Search and filter functionality with error handling
  let searchHookResult;
  try {
    searchHookResult = useSearch(bookings || [], [
      "serviceName",
      "status",
      "location",
    ]);
  } catch (err) {
    console.error("Search hook error:", err);
    setHookError("Search functionality error");
    searchHookResult = {
      searchTerm: "",
      setSearchTerm: () => {},
      sortBy: "",
      setSortBy: () => {},
      sortOrder: "asc",
      setSortOrder: () => {},
      filters: {},
      updateFilter: () => {},
      clearFilters: () => {},
      filteredData: bookings || [],
    };
  }

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
  } = searchHookResult;

  // Pagination with error handling
  let paginationResult;
  try {
    paginationResult = usePagination(filteredBookings || [], 5);
  } catch (err) {
    console.error("Pagination hook error:", err);
    paginationResult = {
      currentPage: 1,
      totalPages: 1,
      paginatedData: filteredBookings || [],
      goToPage: () => {},
      totalItems: (filteredBookings || []).length,
      startIndex: 1,
      endIndex: (filteredBookings || []).length,
    };
  }

  const {
    currentPage,
    totalPages,
    paginatedData: displayBookings,
    goToPage,
    totalItems,
    startIndex,
    endIndex,
  } = paginationResult;

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/bookings/my");
      // Fix: Map backend fields to ensure assignedDecorator is detected
      const rawData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const mappedData = rawData.map((booking) => ({
        ...booking,
        assignedDecorator:
          booking.assignedDecorator ||
          booking.decoratorId ||
          (typeof booking.decorator === "object"
            ? booking.decorator?._id
            : booking.decorator),
      }));
      setBookings(mappedData);
    } catch (err) {
      console.error("Failed to fetch bookings:", err.response || err);

      let errorMessage = "Failed to fetch bookings. Server or network issue.";
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id, status) => {
    if (status !== "Pending") {
      toast.warning('Only bookings with "Pending" status can be canceled.');
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await API.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking canceled successfully!");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    goToPage(1);
  }, [searchTerm, filters, sortBy, sortOrder]);

  if (loading) return <Spinner />;

  if (error || hookError) {
    return (
      <div className="text-center py-20 min-h-[50vh]">
        <h2 className="text-3xl text-red-600 font-bold mb-4">Error</h2>
        <p className="text-lg text-gray-600">{error || hookError}</p>
        <button
          onClick={() => {
            setError(null);
            setHookError(null);
            fetchBookings();
          }}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-base-200 p-4 md:p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
                <FaCalendarAlt className="mr-3" /> My Bookings
              </h1>
              <p className="text-blue-100 text-lg">
                Track and manage your service appointments
              </p>
            </div>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center backdrop-blur-sm font-medium"
              disabled={loading}
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <FaSync className="mr-2" /> Refresh List
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl p-6">
          {/* Search and Filter Section */}
          {bookings.length > 0 && (
            <div className="bg-base-200 border border-base-300 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="🔍 Search bookings..."
                    value={searchTerm || ""}
                    onChange={(e) => {
                      try {
                        setSearchTerm(e.target.value);
                      } catch (err) {
                        console.error("Search error:", err);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base-content bg-base-100"
                  />
                </div>
                <select
                  value={filters?.status || ""}
                  onChange={(e) => {
                    try {
                      updateFilter(
                        "status",
                        e.target.value === "" ? null : e.target.value
                      );
                    } catch (err) {
                      console.error("Filter update error:", err);
                    }
                  }}
                  className="px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base-content bg-base-100"
                >
                  <option value="">🔍 All Status</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Assigned">👤 Assigned</option>
                  <option value="Completed">🎉 Completed</option>
                  <option value="Canceled">❌ Canceled</option>
                </select>
                <select
                  value={sortBy || ""}
                  onChange={(e) => {
                    try {
                      setSortBy(e.target.value);
                    } catch (err) {
                      console.error("Sort error:", err);
                    }
                  }}
                  className="px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base-content bg-base-100"
                >
                  <option value="">📈 Sort by</option>
                  <option value="date">📅 Date</option>
                  <option value="serviceName">🎨 Service</option>
                  <option value="status">📊 Status</option>
                  <option value="cost">💰 Cost</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      try {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } catch (err) {
                        console.error("Sort order error:", err);
                      }
                    }}
                    className="px-3 py-2 border border-base-300 rounded-lg hover:bg-base-200 text-base-content flex-1 flex items-center justify-center"
                  >
                    <FaSort className="mr-1" />
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                  <button
                    onClick={() => {
                      try {
                        clearFilters();
                      } catch (err) {
                        console.error("Clear filters error:", err);
                        // Fallback manual clear
                        setSearchTerm("");
                        setSortBy("");
                        setSortOrder("asc");
                      }
                    }}
                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                  >
                    <FaFilter className="mr-1" />
                    Clear
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-base-content/70 font-medium">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>
          )}

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl flex items-center justify-center mb-4 text-base-content/30">
                <FaClipboardList />
              </div>
              <p className="text-xl font-semibold mb-2 text-base-content">
                No bookings found
              </p>
              <p className="text-base-content/70 mb-6">
                You haven't booked any services yet
              </p>
              <a href="/services" className="btn btn-primary">
                Explore Services
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {displayBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-base-content">
                          {booking.serviceName}
                        </h3>
                        <p className="text-sm text-base-content/70 font-medium">
                          {booking.serviceCategory}
                        </p>
                      </div>
                      <div
                        className={`badge ${getStatusColor(
                          getDisplayStatus(booking)
                        )}`}
                      >
                        {getDisplayStatus(booking)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="font-semibold text-base-content flex items-center">
                          <FaCalendar className="mr-2 text-blue-500" /> Date:
                        </span>
                        <p className="text-base-content/80 ml-6">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-base-content flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-red-500" />{" "}
                          Location:
                        </span>
                        <p className="text-base-content/80 ml-6">
                          {booking.location}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-base-content flex items-center">
                          <FaDollarSign className="mr-2 text-green-500" /> Cost:
                        </span>
                        <p className="text-lg font-bold text-green-600 ml-6">
                          {formatCurrency(booking.cost, {
                            currency: "৳",
                            showCurrency: true,
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-base-content flex items-center">
                          <FaCreditCard className="mr-2 text-purple-500" />{" "}
                          Payment:
                        </span>
                        <p
                          className={`font-semibold ml-6 ${
                            isPaymentCompleted(booking)
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {isPaymentCompleted(booking) ? "Paid" : "Pending"}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-base-content flex items-center">
                          <FaCalendar className="mr-2 text-base-content/40" />{" "}
                          Booked On:
                        </span>
                        <p className="text-base-content/80 ml-6">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-base-200">
                      {!isPaymentCompleted(booking) &&
                        booking.status !== "Completed" &&
                        booking.status !== "Canceled" && (
                          <button
                            onClick={() => {
                              localStorage.setItem(
                                "pendingBooking",
                                JSON.stringify({
                                  bookingId: booking._id,
                                  serviceName: booking.serviceName,
                                  amount: booking.cost,
                                  date: booking.date,
                                  location: booking.location,
                                })
                              );
                              navigate("/payment");
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center transition-colors"
                          >
                            <FaCreditCard className="mr-1" /> Pay Now
                          </button>
                        )}

                      {booking.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleCancelBooking(booking._id, booking.status)
                          }
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center transition-colors"
                        >
                          <FaTimes className="mr-1" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredBookings.length > 5 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          )}

          {bookings.length > 0 && (
            <div className="mt-6 p-6 bg-base-200 rounded-xl border border-base-300">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {bookings.length}
                  </div>
                  <div className="text-sm text-base-content/70 font-medium">
                    Total Bookings
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "Completed").length}
                  </div>
                  <div className="text-sm text-base-content/70 font-medium">
                    Completed
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {
                      bookings.filter(
                        (b) => getDisplayStatus(b) === "In Progress"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-base-content/70 font-medium">
                    In Progress
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      bookings.filter((b) => getDisplayStatus(b) === "Assigned")
                        .length
                    }
                  </div>
                  <div className="text-sm text-base-content/70 font-medium">
                    Assigned
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {bookings.filter((b) => b.status === "Pending").length}
                  </div>
                  <div className="text-sm text-base-content/70 font-medium">
                    Pending
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
