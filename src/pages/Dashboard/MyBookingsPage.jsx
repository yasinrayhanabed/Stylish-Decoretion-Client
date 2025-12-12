import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import API from '../../api/axios'; 
import Spinner from '../../components/Spinner';

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

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            // নিশ্চিত করুন: /api/bookings/my রুটে কল করা হচ্ছে
            const res = await API.get('/bookings/my'); 
            setBookings(res.data);
            if (res.data.length === 0) {
                // টোস্ট বার্তা শুধুমাত্র একবার দেখানো উচিত, তাই এটি ঐচ্ছিক
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

    if (loading) return <Spinner />;

    if (error) {
        return (
            <div className="text-center py-20 min-h-[50vh]">
                <h2 className="text-3xl text-red-600 font-bold mb-4">Error</h2>
                <p className="text-lg text-gray-600">{error}</p>
                <button onClick={fetchBookings} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">
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
                        <h2 className="card-title text-3xl">📅 My Bookings</h2>
                        <button 
                            onClick={fetchBookings}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : '🔄 Refresh'}
                        </button>
                    </div>
                    
                    {bookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-xl font-semibold mb-2">No bookings found</p>
                            <p className="text-base-content/70 mb-4">You haven't booked any services yet</p>
                            <a href="/services" className="btn btn-primary">
                                Explore Services
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking, index) => (
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
                                            <div className={`badge ${getStatusColor(booking.status).replace('bg-', 'badge-').replace('-100', '').replace(' text-', ' badge-')}`}>
                                                {booking.status}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <span className="font-semibold">📅 Date:</span>
                                                <p>{new Date(booking.date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold">📍 Location:</span>
                                                <p>{booking.location}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold">💰 Cost:</span>
                                                <p className="text-lg font-bold text-success">BDT {booking.cost}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold">💳 Payment:</span>
                                                <p className={`font-semibold ${
                                                    booking.paymentStatus === 'completed' ? 'text-success' : 'text-warning'
                                                }`}>
                                                    {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold">📝 Booked:</span>
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
                                                    💳 Pay Now
                                                </button>
                                            )}
                                            
                                            {booking.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id, booking.status)}
                                                    className="btn btn-error btn-sm"
                                                >
                                                    ❌ Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    
                    {bookings.length > 0 && (
                        <div className="mt-6 p-4 bg-base-300 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
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