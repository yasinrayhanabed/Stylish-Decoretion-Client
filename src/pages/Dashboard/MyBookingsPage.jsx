// src/pages/Dashboard/MyBookingsPage.jsx (FINAL FILE)

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaCalendarCheck, FaTags, FaMapMarkerAlt, FaClock, FaDollarSign, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../../api/axios'; 
import Swal from 'sweetalert2';
import moment from 'moment';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Confirmed':
        case 'Planning Phase':
        case 'Assigned': return 'bg-blue-100 text-blue-800';
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Canceled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
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

    const handleDeleteBooking = async (id, status) => {
        if (status !== 'Pending') {
            Swal.fire({
                icon: 'warning',
                title: 'Cannot Cancel',
                text: 'Only bookings with "Pending" status can be canceled.',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this booking!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                // নিশ্চিত করুন: DELETE /api/bookings/:id রুটে কল করা হচ্ছে
                await API.delete(`/bookings/${id}`); 
                
                setBookings(prev => prev.filter(b => b._id !== id)); 
                Swal.fire('Canceled!', 'Your booking has been successfully canceled.', 'success');
            } catch (err) {
                console.error("Failed to delete booking:", err);
                Swal.fire('Error!', 'Failed to cancel the booking. Please contact support.', 'error');
            }
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <FaSpinner className="animate-spin text-5xl text-blue-500 mb-4" />
                <p className="text-xl text-gray-700">Loading Your Bookings...</p>
            </div>
        );
    }

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
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-2 flex items-center space-x-3">
                <FaCalendarCheck className="text-blue-600"/>
                <span>My Service Bookings</span>
            </h1>

            {bookings.length === 0 && (
                <div className="text-center bg-gray-50 p-10 rounded-lg border border-dashed border-gray-300">
                    <p className="text-2xl text-gray-600 font-semibold mb-4">No Bookings Found</p>
                    <p className="text-gray-500">It looks like you haven't booked any services yet. Start exploring our offerings!</p>
                    <a href="/services" className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200">
                        Explore Services
                    </a>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking) => (
                    <div 
                        key={booking._id} 
                        className="bg-white p-6 border-l-4 shadow-lg rounded-lg transition duration-300 hover:shadow-xl"
                        style={{ borderLeftColor: getStatusColor(booking.status).split(' ')[1].replace('text-', '#').replace('800', '600') }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
                                <FaTags className="text-blue-500 text-xl"/>
                                <span>{booking.serviceName || "Service Details Missing"}</span>
                            </h2>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 border-t pt-4">
                            <p className="flex items-center space-x-2">
                                <FaClock className="text-indigo-500"/>
                                <span className="font-medium">Date:</span>
                                <span>{moment(booking.date).format('LL')}</span>
                            </p>
                            
                            <p className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-indigo-500"/>
                                <span className="font-medium">Location:</span>
                                <span>{booking.location}</span>
                            </p>
                            
                            <p className="flex items-center space-x-2">
                                <FaDollarSign className="text-indigo-500"/>
                                <span className="font-medium">Cost:</span>
                                <span className="font-bold text-lg text-green-700">BDT {parseFloat(booking.cost).toFixed(2)}</span>
                            </p>
                            
                            <p className="flex items-center space-x-2">
                                <span className="font-medium text-gray-500">Booked On:</span>
                                <span>{moment(booking.createdAt).format('MMM D, YY')}</span>
                            </p>
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                            
                            {(booking.paymentStatus === 'pending' || booking.status === 'Pending') && (
                                <a 
                                    href={`/payment/${booking._id}`}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Proceed to Pay
                                </a>
                            )}

                            {booking.status === 'Pending' && (
                                <button
                                    onClick={() => handleDeleteBooking(booking._id, booking.status)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-1"
                                >
                                    <FaTrash />
                                    <span>Cancel Booking</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}