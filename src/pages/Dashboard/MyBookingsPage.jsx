import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import API from '../../api/axios'; 
import Spinner from '../../components/Spinner';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { FaCalendarAlt, FaSync, FaClipboardList, FaPalette, FaMapMarkerAlt, FaDollarSign, FaCreditCard, FaCalendar, FaTimes, FaSearch, FaSort, FaFilter } from 'react-icons/fa';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'badge-warning';
        case 'Confirmed':
        case 'Planning Phase':
        case 'Assigned': return 'badge-info';
        case 'Completed': return 'badge-success';
        case 'Canceled': return 'badge-error';
        default: return 'badge-ghost';
    }
};

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hookError, setHookError] = useState(null);

    // Search and filter functionality with error handling
    let searchHookResult;
    try {
        searchHookResult = useSearch(bookings || [], ['serviceName', 'status', 'location']);
    } catch (err) {
        console.error('Search hook error:', err);
        setHookError('Search functionality error');
        searchHookResult = {
            searchTerm: '',
            setSearchTerm: () => {},
            sortBy: '',
            setSortBy: () => {},
            sortOrder: 'asc',
            setSortOrder: () => {},
            filters: {},
            updateFilter: () => {},
            clearFilters: () => {},
            filteredData: bookings || []
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
        filteredData: filteredBookings
    } = searchHookResult;

    // Pagination with error handling
    let paginationResult;
    try {
        paginationResult = usePagination(filteredBookings || [], 5);
    } catch (err) {
        console.error('Pagination hook error:', err);
        paginationResult = {
            currentPage: 1,
            totalPages: 1,
            paginatedData: filteredBookings || [],
            goToPage: () => {},
            totalItems: (filteredBookings || []).length,
            startIndex: 1,
            endIndex: (filteredBookings || []).length
        };
    }
    
    const {
        currentPage,
        totalPages,
        paginatedData: displayBookings,
        goToPage,
        totalItems,
        startIndex,
        endIndex
    } = paginationResult;

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            // Make sure: calling /api/bookings/my route
            const res = await API.get('/bookings/my'); 
            setBookings(res.data);
            if (res.data.length === 0) {
                // Toast message should only be shown once, so this is optional
                // toast.info("You currently have no active bookings."); 
            }
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
        if (status !== 'Pending') {
            toast.warning('Only bookings with "Pending" status can be canceled.');
            return;
        }

        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        try {
            await API.delete(`/bookings/${id}`);
            setBookings(prev => prev.filter(b => b._id !== id));
            toast.success('Booking canceled successfully!');
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            toast.error('Failed to cancel booking. Please try again.');
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
                <button onClick={() => {
                    setError(null);
                    setHookError(null);
                    fetchBookings();
                }} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="card-title text-3xl"><FaCalendarAlt className="mr-2" /> My Bookings</h2>
                        <button 
                            onClick={fetchBookings}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : <><FaSync className="mr-1" /> Refresh</>}
                        </button>
                    </div>

                    {/* Search and Filter Section */}
                    {bookings.length > 0 && (
                        <div className="bg-base-200 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="🔍 Search bookings..."
                                        value={searchTerm || ''}
                                        onChange={(e) => {
                                            try {
                                                setSearchTerm(e.target.value);
                                            } catch (err) {
                                                console.error('Search error:', err);
                                            }
                                        }}
                                        className="input input-bordered w-full pl-10"
                                    />
                                </div>
                                <select
                                    value={filters?.status || ''}
                                    onChange={(e) => {
                                        try {
                                            updateFilter('status', e.target.value === '' ? null : e.target.value);
                                        } catch (err) {
                                            console.error('Filter update error:', err);
                                        }
                                    }}
                                    className="select select-bordered"
                                >
                                    <option value="">🔍 All Status</option>
                                    <option value="Pending">⏳ Pending</option>
                                    <option value="Confirmed">✅ Confirmed</option>
                                    <option value="Planning Phase">📋 Planning Phase</option>
                                    <option value="Assigned">👤 Assigned</option>
                                    <option value="Completed">🎉 Completed</option>
                                    <option value="Canceled">❌ Canceled</option>
                                </select>
                                <select
                                    value={sortBy || ''}
                                    onChange={(e) => {
                                        try {
                                            setSortBy(e.target.value);
                                        } catch (err) {
                                            console.error('Sort error:', err);
                                        }
                                    }}
                                    className="select select-bordered"
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
                                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            } catch (err) {
                                                console.error('Sort order error:', err);
                                            }
                                        }}
                                        className="btn btn-outline btn-sm flex-1"
                                    >
                                        <FaSort className="mr-1" />
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            try {
                                                clearFilters();
                                            } catch (err) {
                                                console.error('Clear filters error:', err);
                                                // Fallback manual clear
                                                setSearchTerm('');
                                                setSortBy('');
                                                setSortOrder('asc');
                                            }
                                        }}
                                        className="btn btn-outline btn-error btn-sm"
                                    >
                                        <FaFilter className="mr-1" />
                                        Clear
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 text-sm opacity-70">
                                Showing {filteredBookings.length} of {bookings.length} bookings
                            </div>
                        </div>
                    )}
                    
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl flex items-center justify-center mb-4"><FaClipboardList /></div>
                            <p className="text-xl font-semibold mb-2">No bookings found</p>
                            <p className="text-base-content/70 mb-4">You haven't booked any services yet</p>
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
                                    className="card bg-base-200 shadow-md"
                                >
                                    <div className="card-body">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="card-title text-xl">{booking.serviceName}</h3>
                                                <p className="text-base-content/70">{booking.serviceCategory}</p>
                                            </div>
                                            <div className={`badge ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <span className="font-semibold"><FaCalendar className="inline mr-1" /> Date:</span>
                                                <p>{new Date(booking.date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold"><FaMapMarkerAlt className="inline mr-1" /> Location:</span>
                                                <p>{booking.location}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold"><FaDollarSign className="inline mr-1" /> Cost:</span>
                                                <p className="text-lg font-bold text-success">BDT {booking.cost}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold"><FaCreditCard className="inline mr-1" /> Payment:</span>
                                                <p className={`font-semibold ${
                                                    booking.paymentStatus === 'completed' ? 'text-success' : 'text-warning'
                                                }`}>
                                                    {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold"><FaCalendar className="inline mr-1" /> Booked:</span>
                                                <p>{new Date(booking.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="card-actions justify-end">
                                            {(booking.paymentStatus !== 'completed' && booking.status !== 'Completed' && booking.status !== 'Canceled') && (
                                                <button 
                                                    onClick={() => {
                                                        localStorage.setItem('pendingBooking', JSON.stringify({
                                                            bookingId: booking._id,
                                                            serviceName: booking.serviceName,
                                                            amount: booking.cost,
                                                            date: booking.date,
                                                            location: booking.location
                                                        }));
                                                        window.location.href = '/payment';
                                                    }}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    <FaCreditCard className="mr-1" /> Pay Now
                                                </button>
                                            )}
                                            
                                            {booking.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id, booking.status)}
                                                    className="btn btn-error btn-sm"
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
                        <div className="mt-6 p-4 bg-base-300 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-primary">{bookings.length}</div>
                                    <div className="text-sm opacity-70">Total Bookings</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-success">
                                        {bookings.filter(b => b.status === 'Completed').length}
                                    </div>
                                    <div className="text-sm opacity-70">Completed</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-info">
                                        {bookings.filter(b => b.status === 'Assigned' || b.status === 'In Progress').length}
                                    </div>
                                    <div className="text-sm opacity-70">Assigned</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-warning">
                                        {bookings.filter(b => b.status === 'Pending').length}
                                    </div>
                                    <div className="text-sm opacity-70">Pending</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}