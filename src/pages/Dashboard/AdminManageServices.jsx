import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
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
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { sendSMS, smsTemplates } from "../../utils/smsUtils";
import FallbackImage from "../../components/FallbackImage";
import { getAvailableCoupons } from "../../utils/couponUtils";
import { serviceAddons } from "../../utils/serviceAddons";
import { formatCurrency } from "../../utils/formatCurrency";
import { normalizeService as normalizeServiceUtil } from "../../utils/serviceUtils";

export default function AdminManageServices() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingService, setEditingService] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [lastUpdateError, setLastUpdateError] = useState(null);
  // Track updates that applied locally but failed to sync to server
  const [pendingFailures, setPendingFailures] = useState({});
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
  } = useSearch(services || [], [
    "service_name",
    "description",
    "category",
    "cost",
  ]);

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

  // Deduplicate services by _id
  const dedupeServices = (arr) => {
    if (!Array.isArray(arr)) return [];
    const map = new Map();
    arr.forEach((s) => {
      if (s && s._id) map.set(s._id, s);
    });
    return Array.from(map.values());
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/services");
      // Normalize response: accept either array or { services: [...] } or { data: [...] }
      const data = res.data?.services ?? res.data?.data ?? res.data ?? [];
      const normalized = (Array.isArray(data) ? data : [])
        .map(normalizeServiceUtil)
        .filter(Boolean);
      const unique = dedupeServices(normalized);
      setServices(unique); // Set the normalized and deduped services
      return unique;
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
      toast.error("Failed to load services");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (id) => {
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
      setServiceToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const handleUpdateService = async (serviceId, updates) => {
    // Prevent duplicate concurrent updates for the same service
    if (updatingId === serviceId) return;

    setUpdatingId(serviceId);
    setLastUpdateError(null);

    // Prepare the updated service object for both optimistic update and API call
    setServices((prev) =>
      dedupeServices(
        prev.map((s) =>
          s._id === serviceId ?
          normalizeServiceUtil({
                ...s,
                service_name: updates.service_name ?? s.service_name,
                description: updates.description ?? s.description,
                cost: Number(updates.cost ?? s.cost),
                category: updates.category ?? s.category,
                unit: updates.unit ?? s.unit,
                photo: updates.photo instanceof File ?
                  URL.createObjectURL(updates.photo) :
                  s.photo,
              })
            : s
        )
      )
    );

    // Close the editor so the user sees the updated card immediately
    setEditingService(null);

    const formData = new FormData();

    // Append only fields that have actually changed to avoid overwriting with undefined
    const originalService = services.find(s => s._id === serviceId);

    Object.keys(updates).forEach(key => {
      // Also check if originalService is found to prevent errors
      if (originalService && (updates[key] !== originalService[key] || updates[key] instanceof File)) {
        // The backend expects 'service_name' for updates.
        // Ensure we send the correct key.
        const backendKey = key;
        formData.append(backendKey, updates[key] ?? "");
      }
    });


    if (updates.photo && updates.photo instanceof File) {
      formData.append("photo", updates.photo);
    }

    const toastId = toast.loading("Saving changes to server...");

    try { // Simplified update logic
      const res = await API.put(`/services/${serviceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        // Remove pending failure if any — we successfully synced
        setPendingFailures((prev) => {
          const copy = { ...prev };
          delete copy[serviceId];
          return copy;
        });

        toast.update(toastId, {
          render: "Service updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Instead of refetching all, just update the single item with server response if available
        const updatedServiceFromServer = res.data?.service || res.data?.data;
        if (updatedServiceFromServer) {
          setServices((prev) => {
            const updatedList = prev.map((s) =>
              s._id === serviceId ? normalizeServiceUtil(updatedServiceFromServer) : s
            );
            return dedupeServices(updatedList);
          });
        }
        // If no service is returned, the optimistic update remains.

        setLastUpdateError(null);
        setEditingService(null);
        return;
      } else {
        // If the server responds with success: false but no error
        throw new Error(res.data?.message || "Update failed with an unknown server error.");
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update service.";

      console.error("Service update failed:", err.response || err);

      toast.update(toastId, {
        render: serverMessage +
          " Changes are applied locally.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      // Keep a record that this service changed locally but failed to sync
      setPendingFailures((prev) => ({
        ...prev,
        [serviceId]: {
          updates,
          message: serverMessage || "Failed to update service",
        },
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const sendServiceNotification = async (serviceName) => {
    // Use import.meta.env for Vite environment variables
    const adminPhoneNumber =
      import.meta.env.VITE_ADMIN_PHONE_NUMBER || "+8801234567890";

    const message = smsTemplates.serviceUpdate(serviceName);

    const toastId = toast.loading("Sending SMS notification...");

    try {
      await sendSMS(adminPhoneNumber, message, "service_update");
      toast.update(toastId, {
        render: "SMS notification sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("SMS sending failed:", err);
      toast.update(toastId, {
        render: "Failed to send SMS. Check console for details.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  // Retry syncing a previously failed update
  const handleRetry = async (serviceId) => {
    const entry = pendingFailures[serviceId];
    if (!entry) return;
    toast.info("Retrying sync for service...");
    await handleUpdateService(serviceId, entry.updates);
  };

  // Revert a previously applied local change by refetching from server
  const handleRevert = async (serviceId) => {
    try {
      await fetchServices();
      setPendingFailures((prev) => {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      });
      toast.success("Reverted local changes from server data.");
    } catch (err) {
      toast.error("Failed to revert. Check console for details.");
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
            <p className="text-blue-100 text-lg">
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

      {Object.keys(pendingFailures).length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start justify-between gap-4">
          <div>
            <strong className="text-yellow-800">Sync issues:</strong> Some
            changes were applied locally but failed to sync.
            <div className="mt-2 space-y-2 text-sm">
              {Object.entries(pendingFailures).map(([id, info]) => {
                const svc = services?.find((s) => s._id === id);
                return (
                  <div key={id} className="flex items-center gap-2">
                    <span className="font-medium">
                      {svc?.service_name ?? id}
                    </span>
                    <span className="text-gray-600"> - {info.message}</span>
                    <button
                      onClick={() => handleRetry(id)}
                      className="ml-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded text-sm"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => handleRevert(id)}
                      className="ml-2 px-3 py-1 text-yellow-800 underline text-sm"
                    >
                      Revert
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <button
              onClick={() => setPendingFailures({})}
              className="text-yellow-800 underline"
            >
              Dismiss all
            </button>
          </div>
        </div>
      )}

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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-gray-900 placeholder-gray-500"
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
            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-gray-900"
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
            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-gray-900"
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
              <span className="text-indigo-600 font-bold">{totalResults}</span>
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
                    <FallbackImage
                      src={s.photo}
                      alt={s.service_name}
                      category={s.category}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-green-600 shadow-lg flex items-center">
                        <FaDollarSign
                          className="mr-1 text-xs"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-bold">
                          {formatCurrency(s.cost, {
                            currency: "৳",
                            showCurrency: false,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      🎨 {s.service_name}
                    </h3>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4 leading-relaxed">
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
                            sendServiceNotification(s.service_name)
                          }
                          className="w-10 h-10 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center justify-center"
                          title="Send SMS Update"
                        >
                          <FaSms />
                        </button>
                      </div>

                      <button
                        onClick={() => openDeleteModal(s)}
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
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center justify-center"
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
                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
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
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Next <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && serviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-3xl text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete the service "
                <strong>{serviceToDelete.service_name}</strong>"? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(serviceToDelete._id)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaEdit className="mr-3 text-indigo-600" />
                Edit Service
              </h3>
              <button
                onClick={() => {
                  setEditingService(null);
                  setLastUpdateError(null);
                }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-6">
              {lastUpdateError && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg flex items-center justify-between">
                  <div className="text-sm">{lastUpdateError}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Apply locally
                        setServices((prev) =>
                          dedupeServices(
                            prev.map((s) =>
                              s._id === editingService._id
                                ? {
                                    ...s,
                                    service_name: editingService.service_name,
                                    description: editingService.description,
                                    cost: editingService.cost,
                                    category: editingService.category,
                                    unit: editingService.unit,
                                  }
                                : s
                            )
                          )
                        );
                        toast.success("Changes applied locally");
                        setEditingService(null);
                        setLastUpdateError(null);
                      }}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded text-sm font-medium"
                    >
                      Apply Locally
                    </button>
                    <button
                      onClick={() => setLastUpdateError(null)}
                      className="px-3 py-1 bg-transparent rounded text-sm text-yellow-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService.service_name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      service_name: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg h-28 focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter a detailed description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (৳)
                </label>
                <input
                  type="number"
                  value={editingService.cost}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      cost: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter service cost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingService.category}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Select Category</option>
                  <option value="wedding">Wedding</option>
                  <option value="home">Home</option>
                  <option value="corporate">Corporate</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={editingService.unit}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      unit: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., per event, per hour"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      photo: e.target.files[0],
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setEditingService(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateService(editingService._id, editingService)
                }
                disabled={updatingId === editingService._id}
                className={`flex-1 px-4 py-3 bg-green-600 text-white rounded-lg transition-colors font-medium shadow-lg ${
                  updatingId === editingService._id
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-green-700"
                }`}
              >
                {updatingId === editingService._id
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaGift className="mr-2 text-yellow-500" /> Available Coupons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAvailableCoupons().map((coupon) => (
                <div
                  key={coupon.code}
                  className="border rounded-xl p-4 bg-yellow-50 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-yellow-800">
                        {coupon.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {coupon.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum:{" "}
                        {formatCurrency(coupon.minAmount, {
                          currency: "৳",
                          showCurrency: true,
                        })}{" "}
                        |{" "}
                        <span className="font-semibold">
                          Expires: {coupon.expiry}
                        </span>
                      </p>
                    </div>
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-mono font-bold text-sm shadow">
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
                  className="border rounded-xl p-4 bg-green-50 shadow-sm"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{addon.image}</div>
                    <h4 className="font-bold text-gray-800">{addon.name}</h4>
                    <p className="text-xs text-gray-600 mb-2 h-8">
                      {addon.description}
                    </p>
                    <div className="flex justify-between items-center text-sm mt-3">
                      <span className="font-bold text-green-600">
                        {formatCurrency(addon.price, {
                          currency: "৳",
                          showCurrency: true,
                        })}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {addon.duration}
                      </span>
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
