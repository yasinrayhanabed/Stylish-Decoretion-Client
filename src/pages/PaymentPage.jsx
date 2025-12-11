import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../api/axios"; 
import { toast } from 'react-toastify'; 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

function CheckoutForm({ bookingId, amount, serviceName, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  
  const finalAmount = Math.max(100, amount); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
   
        const { data } = await API.post('/create-payment-intent', { amount: finalAmount });
        const clientSecret = data.clientSecret;
        
        const paymentMethodReq = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (paymentMethodReq.error) {
            toast.error(paymentMethodReq.error.message);
            setLoading(false);
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethodReq.paymentMethod.id,
        });

        if (result.error) {
            toast.error(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                
                await API.post('/payments', {
                    bookingId,
                    transactionId: result.paymentIntent.id,
                    amount: finalAmount,
                    currency: 'BDT', 
                    serviceName: serviceName, 
                });
                
                toast.success('Payment successful! Booking updated.');
                onPaymentSuccess(result.paymentIntent.id);

            } else {
                toast.error(`Payment failed: ${result.paymentIntent.status}`);
            }
        }
    } catch (error) {
        console.error("Payment Process Error:", error);
        toast.error(error.response?.data?.message || "A server error occurred during payment.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Complete Payment for: <span className="text-blue-600">{serviceName}</span>
        </h3>
        <p className="text-2xl font-bold mb-6 text-green-600">Total Payable: BDT {finalAmount}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border p-3 rounded-lg bg-gray-50">
                <CardElement options={cardElementOptions} />
            </div>
            <button 
                disabled={!stripe || loading} 
                className={`btn w-full ${loading ? 'btn-disabled bg-gray-400' : 'btn-primary bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
                {loading ? 'Processing...' : `Pay BDT ${finalAmount}`}
            </button>
        </form>
    </div>
  );
}

export default function PaymentPage() {
    const { bookingId } = useParams(); 
    const nav = useNavigate(); 
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBookingData = async () => {
            // First try to get booking data from localStorage
            const pendingBooking = localStorage.getItem('pendingBooking');
            
            if (pendingBooking) {
                try {
                    const bookingInfo = JSON.parse(pendingBooking);
                    setBookingData({
                        _id: bookingInfo.bookingId,
                        cost: bookingInfo.amount,
                        serviceName: bookingInfo.serviceName,
                        date: bookingInfo.date,
                        location: bookingInfo.location
                    });
                    setLoading(false);
                    return;
                } catch (err) {
                    console.error('Failed to parse pending booking:', err);
                }
            }
            
            // Fallback: try URL parameter if available
            if (bookingId) {
                try {
                    const res = await API.get(`/bookings/${bookingId}`); 
                    setBookingData(res.data);
                } catch (error) {
                    console.error("Failed to fetch booking details:", error.response || error);
                    const errorMessage = error.response?.data?.message || "Failed to load booking details.";
                    toast.error(errorMessage);
                    setError(errorMessage);
                    nav('/dashboard/my-bookings', { replace: true }); 
                }
            } else {
                // No booking data available
                toast.error("No booking data found. Please select a booking to pay.");
                nav('/dashboard/my-bookings', { replace: true });
            }
            
            setLoading(false);
        };

        loadBookingData();
    }, [bookingId, nav]);

    const handlePaymentSuccess = () => {
        // Clear the pending booking data
        localStorage.removeItem('pendingBooking');
        nav('/dashboard/my-bookings', { replace: true }); 
    };

    if (loading) return <div className="text-center py-10">Loading Booking Details...</div>; 
    if (error || !bookingData || !bookingData.cost) {

        return <div className="text-center py-10 text-red-500">Redirecting to My Bookings...</div>;
    }

    return (
        <div className="max-w-md mx-auto py-10">
            <Elements stripe={stripePromise}>
                <CheckoutForm 
                    bookingId={bookingData._id} 
                    amount={bookingData.cost} 
                    serviceName={bookingData.serviceName || "Selected Service"} 
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </Elements>
        </div>
    );
}
