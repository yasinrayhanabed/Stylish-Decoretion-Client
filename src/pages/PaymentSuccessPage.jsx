import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios'; 
import { toast } from 'react-toastify';
import { FaCheckCircle, FaSpinner, FaHome, FaHistory, FaCalendarCheck } from 'react-icons/fa';

// PaymentSuccessPage কম্পোনেন্ট
export default function PaymentSuccessPage() {
    const { transactionId } = useParams(); // URL থেকে Transaction ID নেওয়া হচ্ছে
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (!transactionId) {
                setError("Transaction ID is missing.");
                setLoading(false);
                return;
            }

            try {
                // 1. সার্ভার থেকে পেমেন্ট এবং বুকিং ডেটা ফেচ করা
                // 💡 দ্রষ্টব্য: আপনাকে আপনার server.js-এ এই নতুন রুটটি (নিচে দেওয়া আছে) যোগ করতে হবে।
                const res = await API.get(`/payments/${transactionId}`); 
                setPaymentDetails(res.data);
                
                toast.success('Your payment was successfully confirmed!', {
                    autoClose: 5000,
                    position: "top-center"
                });

            } catch (err) {
                console.error("Error fetching payment details:", err);
                const errorMessage = err.response?.data?.message || "Failed to confirm payment details. Please check your bookings.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [transactionId]);

    // UI লজিক
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-700">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
                <p className="text-xl">Verifying Payment Details...</p>
            </div>
        );
    }

    if (error || !paymentDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-600 p-4">
                <h2 className="text-3xl font-bold mb-4">Payment Verification Failed</h2>
                <p className="text-lg mb-6">{error || "Could not retrieve transaction information."}</p>
                <Link to="/dashboard/my-bookings" className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2">
                    <FaHistory /> <span>Go to My Bookings</span>
                </Link>
            </div>
        );
    }

    // সফল UI
    const { transactionId: tId, amount, paymentDate, bookingDetails } = paymentDetails;
    const serviceName = bookingDetails?.serviceName || "Service";
    const bookingId = bookingDetails?._id; 
    const formattedDate = new Date(paymentDate).toLocaleString();

    return (
        <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-green-500">
            <div className="text-center mb-8">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-800">Payment Successful!</h1>
                <p className="text-gray-600 mt-2">Your booking has been confirmed and payment processed.</p>
            </div>
            
            <div className="space-y-4 text-gray-700">
                <h2 className="text-2xl font-semibold border-b pb-2 text-blue-600">Transaction Summary</h2>
                
                <p className="flex justify-between border-b pb-1">
                    <span className="font-medium">Service Name:</span>
                    <span className="font-bold text-lg">{serviceName}</span>
                </p>
                
                <p className="flex justify-between border-b pb-1">
                    <span className="font-medium">Amount Paid:</span>
                    <span className="font-bold text-green-600 text-xl">BDT {amount ? amount.toFixed(2) : 'N/A'}</span>
                </p>

                <p className="flex justify-between border-b pb-1">
                    <span className="font-medium">Transaction ID:</span>
                    <span className="text-sm break-all">{tId}</span>
                </p>

                <p className="flex justify-between border-b pb-1">
                    <span className="font-medium">Payment Date:</span>
                    <span>{formattedDate}</span>
                </p>

                {bookingId && (
                    <p className="flex justify-between border-b pb-1">
                        <span className="font-medium">Booking ID:</span>
                        <span className="text-sm break-all">{bookingId}</span>
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-3 mt-8">
                <Link 
                    to={`/dashboard/my-bookings`} 
                    className="btn bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-150"
                >
                    <FaCalendarCheck /> <span>View My Bookings</span>
                </Link>
                <Link 
                    to="/" 
                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-150"
                >
                    <FaHome /> <span>Back to Home</span>
                </Link>
            </div>
        </div>
    );
}