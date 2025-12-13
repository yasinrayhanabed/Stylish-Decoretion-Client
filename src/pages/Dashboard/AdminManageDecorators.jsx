import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { useSearch } from "../../hooks/useSearch";
import { FaUserTie, FaUsers, FaSearch, FaSort, FaFilter, FaChevronLeft, FaChevronRight, FaEye, FaUserMinus, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function AdminManageDecorators() {
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    filteredData: filteredDecorators,
    totalResults
  } = useSearch(decorators || [], ['name', 'email']);

  // Pagination logic
  const totalPages = Math.ceil(filteredDecorators.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDecorators = filteredDecorators.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  useEffect(() => {
    const fetchDecorators = async () => {
      try {
        const res = await API.get("/users");
        const allUsers = Array.isArray(res.data) ? res.data : [];
        const decoratorUsers = allUsers.filter(user => user.role === 'decorator');
        setDecorators(decoratorUsers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch decorators:", err);
        if (err.response?.status === 403) {
          setError("Access denied. Admin role required to manage decorators.");
        } else if (err.response?.status === 401) {
          setError("Authentication failed. Please login as admin.");
        } else {
          setError("Failed to load decorators. Please check server connection.");
        }
        setDecorators([]);
        setLoading(false);
      }
    };
    fetchDecorators();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await API.put(`/users/${id}/role`, { role: newStatus ? 'decorator' : 'user' });
      setDecorators((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isActive: newStatus } : d))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FaUserTie className="mr-3" />
              Manage Decorators
            </h1>
            <p className="text-blue-100 text-lg">Oversee and manage professional decorators</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaUsers className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaSearch className="mr-2 text-indigo-600" />
          Search & Filter Decorators
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div className="relative col-span-1 md:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
          >
            <option value="">📊 Sort By</option>
            <option value="name">👤 Name</option>
            <option value="email">📧 Email</option>
          </select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors flex items-center font-medium"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
            {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
          </button>
          
          {(searchTerm || sortBy) && (
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
        <div className="flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">
              📊 Showing <span className="text-indigo-600 font-bold">{totalResults}</span> of <span className="font-bold">{decorators.length}</span> decorators
            </span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                🔍 "{searchTerm}"
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorators List */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {filteredDecorators.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaUserTie className="text-4xl text-gray-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-700 mb-3">
              {searchTerm ? '🔍 No Matching Decorators Found' : '👥 No Decorators Available'}
            </h4>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms to find decorators.' 
                : 'Users with decorator role will appear here when available.'}
            </p>
            {searchTerm && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {paginatedDecorators.map((decorator, index) => (
                <div
                  key={decorator._id}
                  className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {decorator.name?.charAt(0)?.toUpperCase() || 'D'}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          👤 {decorator.name || 'Unknown Name'}
                        </h4>
                        <p className="text-gray-600 flex items-center">
                          📧 {decorator.email || 'No email provided'}
                        </p>
                        <p className="text-sm text-gray-500 font-mono mt-1">
                          🆔 ID: {decorator._id || 'No ID'}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            ✅ Active Decorator
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            Role: {decorator.role || 'decorator'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const details = `
🆔 Decorator ID: ${decorator._id}
👤 Name: ${decorator.name || 'N/A'}
📧 Email: ${decorator.email || 'N/A'}
🎭 Role: ${decorator.role || 'decorator'}
📅 Created: ${decorator.createdAt ? new Date(decorator.createdAt).toLocaleDateString() : 'N/A'}
📊 Status: Active
                            `;
                            alert(details.trim());
                          }}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center font-medium"
                          title="View Full Details"
                        >
                          <FaEye className="mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove decorator role from ${decorator.name}?`)) {
                              handleToggleStatus(decorator._id, true);
                            }
                          }}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center font-medium"
                          title="Remove Decorator Role"
                        >
                          <FaUserMinus className="mr-2" />
                          Remove Role
                        </button>
                      </div>
                      
                      {/* Quick ID Copy */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(decorator._id);
                          alert('Decorator ID copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                        title="Copy Decorator ID"
                      >
                        📋 Copy ID
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
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
    </div>
  );
}