import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import {
  FaPalette,
  FaPlus,
  FaEye,
  FaTrash,
  FaDollarSign,
  FaSearch,
  FaSort,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaSms,
  FaGift,
  FaUsers,
  FaRobot,
  FaCog,
} from "react-icons/fa";
import { sendSMS, smsTemplates } from "../../utils/smsUtils";
import { getAvailableCoupons } from "../../utils/couponUtils";
import { subscriptionPlans } from "../../utils/subscriptionUtils";
import { serviceAddons } from "../../utils/serviceAddons";
import { getDecoratorRecommendations } from "../../utils/aiRecommendation";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminManageServices() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingService, setEditingService] = useState(null);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showAddonsModal, setShowAddonsModal] = useState(false);
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
    filteredData: filteredServices,
    totalResults,
  } = useSearch(services || [], ["service_name", "description", "cost"]);

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await API.get("/services");
      setServices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this service?"
      )
    )
      return;
    try {
      setDeletingId(id);
      const res = await API.delete(`/services/${id}`);
      if (res.data?.success) {
        toast.success("Service deleted");
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error("Delete service failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateService = async (serviceId, updates) => {
    try {
      const res = await API.put(`/services/${serviceId}`, updates);
      if (res.data?.success) {
        toast.success("Service updated successfully");
        setServices((prev) =>
          prev.map((s) => (s._id === serviceId ? { ...s, ...updates } : s))
        );
        setEditingService(null);
      }
    } catch (err) {
      toast.error("Failed to update service");
    }
  };

  const sendServiceNotification = async (serviceId, message) => {
    const adminPhoneNumber =
      process.env.REACT_APP_ADMIN_PHONE_NUMBER || "+8801234567890";
    try {
      await sendSMS(adminPhoneNumber, message, "service_update");
      toast.success("SMS notification sent!");
    } catch (err) {
      toast.error("Failed to send SMS");
    }
  };

  if (loading || services === null) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 md:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center md:justify-start">
              <FaPalette className="mr-3" />
              Manage Services
            </h1>
            <p className="text-purple-100 text-lg">
              Oversee and manage decoration services
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center font-medium shadow-lg"
            >
              <FaGift className="mr-2" /> Coupons
            </button>
            <button
              onClick={() => setShowAddonsModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center font-medium shadow-lg"
            >
              <FaCog className="mr-2" /> Add-ons
            </button>
            <Link
              to="/dashboard/admin/add-service"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center font-medium shadow-lg"
            >
              <FaPlus className="mr-2" /> Add New Service
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaSearch className="mr-2 text-indigo-600" />
          Search & Filter Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
          >
            <option value="">📊 Sort By</option>
            <option value="service_name">🎨 Service Name</option>
            <option value="cost">💰 Price</option>
          </select>

          {/* Price Filter */}
          <select
            value={filters.priceRange || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const [min, max] = value.split("-").map(Number);
                updateFilter("cost", { min, max });
              } else {
                updateFilter("cost", "");
              }
            }}
            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
          >
            <option value="">💰 All Prices</option>
            <option value="0-5000">Under ৳5,000</option>
            <option value="5000-15000">৳5,000 - ৳15,000</option>
            <option value="15000-30000">৳15,000 - ৳30,000</option>
            <option value="30000-999999">Above ৳30,000</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors flex items-center font-medium"
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "asc" ? (
              <FaArrowUp className="mr-2" />
            ) : (
              <FaArrowDown className="mr-2" />
            )}
            {sortOrder === "asc" ? "Low to High" : "High to Low"}
          </button>

          {(searchTerm || Object.keys(filters).length > 0 || sortBy) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center font-medium"
              title="Clear all filters and search"
            >
              <FaFilter className="mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600 font-medium">
              📊 Showing{" "}
              <span className="text-indigo-600 font-bold">{totalResults}</span>{" "}
              of <span className="font-bold">{services?.length || 0}</span>{" "}
              services
            </span>
          </div>
          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium inline-block">
              🔍 "{searchTerm}"
            </span>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaPalette className="text-4xl text-gray-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-700 mb-3">
              {searchTerm || Object.keys(filters).length > 0
                ? "🔍 No Matching Services Found"
                : "🎨 No Services Available"}
            </h4>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              {searchTerm || Object.keys(filters).length > 0
                ? "Try adjusting your search terms or filters to find services."
                : "Start by adding your first decoration service."}
            </p>
            {searchTerm || Object.keys(filters).length > 0 ? (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/dashboard/admin/add-service"
                className="mt-4 inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                <FaPlus className="mr-2" /> Add First Service
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.map((s) => (
                <div
                  key={s._id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group"
                >
                  <div className="relative">
                    <img
                      src={
                        (s.images && s.images[0]) ||
                        s.photo ||
                        "/uploads/default-service.png"
                      }
                      alt={s.service_name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-green-600 shadow-lg">
                        {formatCurrency(s.cost, {
                          currency: "৳",
                          showCurrency: true,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      🎨 {s.service_name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {s.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/services/${s._id}`}
                          className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center justify-center"
                          title="View Service"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => setEditingService(s)}
                          className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center justify-center"
                          title="Edit Service"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            sendServiceNotification(
                              s._id,
                              smsTemplates.serviceUpdate(s.service_name)
                            )
                          }
                          className="w-10 h-10 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center justify-center"
                          title="Send SMS Update"
                        >
                          <FaSms />
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(s._id)}
                        className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center"
                        disabled={deletingId === s._id}
                        title={
                          deletingId === s._id
                            ? "Deleting..."
                            : "Delete Service"
                        }
                      >
                        {deletingId === s._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <FaChevronLeft className="mr-1" /> Previous
                </button>

                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  Next <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 sm:w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Edit Service</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingService.service_name}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    service_name: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
                placeholder="Service Name"
              />
              <textarea
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg h-24"
                placeholder="Description"
              />
              <input
                type="number"
                value={editingService.cost}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    cost: Number(e.target.value),
                  })
                }
                className="w-full p-3 border rounded-lg"
                placeholder="Cost"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() =>
                  handleUpdateService(editingService._id, editingService)
                }
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => setEditingService(null)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaGift className="mr-2 text-yellow-500" /> Available Coupons
            </h3>
            <div className="grid gap-4">
              {getAvailableCoupons().map((coupon) => (
                <div
                  key={coupon.code}
                  className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{coupon.title}</h4>
                      <p className="text-gray-600">{coupon.description}</p>
                      <p className="text-sm text-gray-500">
                        Min:{" "}
                        {formatCurrency(coupon.minAmount, {
                          currency: "৳",
                          showCurrency: true,
                        })}{" "}
                        | Expires: {coupon.expiry}
                      </p>
                    </div>
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold">
                      {coupon.code}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowCouponModal(false)}
              className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add-ons Modal */}
      {showAddonsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 md:w-full max-w-lg lg:max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaCog className="mr-2 text-green-500" /> Service Add-ons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceAddons.map((addon) => (
                <div
                  key={addon.id}
                  className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{addon.image}</div>
                    <h4 className="font-bold">{addon.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {addon.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-green-600">
                        {formatCurrency(addon.price, {
                          currency: "৳",
                          showCurrency: true,
                        })}
                      </span>
                      <span className="text-gray-500">{addon.duration}</span>
                    </div>
                    {addon.popular && (
                      <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddonsModal(false)}
              className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
