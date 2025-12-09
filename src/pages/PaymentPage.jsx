import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../api/axios"; // axios কে API তে পরিবর্তন করা হয়েছে
import { toast } from 'react-toastify'; // Toast যোগ করা হলো

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Custom styling for CardElement
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

 const handleSubmit = async (e) => {
 e.preventDefault();
    if (!stripe || !elements) return; // Stripe not loaded yet

 setLoading(true);

 try {
        // 1. Create Payment Intent
        const { data } = await API.post('/create-payment-intent', { amount });
        const clientSecret = data.clientSecret;
        
        // 2. Confirm Card Payment
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
                
                // 3. Save Transaction Data to Your Server
                await API.post('/payments', {
                    bookingId,
                    transactionId: result.paymentIntent.id,
                    amount: amount,
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
        toast.error("A server error occurred during payment.");
    } finally {
     setLoading(false);
    }
 };

 return (
 <div className="p-6 bg-white rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-primary">
            Complete Payment for {serviceName}
        </h3>
        <p className="text-2xl font-bold mb-6">Total Payable: BDT {amount}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border p-3 rounded-lg bg-gray-50">
                <CardElement options={cardElementOptions} />
            </div>
            <button 
                disabled={!stripe || loading} 
                className={`btn w-full ${loading ? 'btn-disabled' : 'btn-primary'}`}
            >
     {loading ? 'Processing...' : `Pay BDT ${amount}`}
 </button>
 </form>
    </div>
 );
}

export default function PaymentPageWrapper({ bookingId, amount, serviceName }) {
    const nav = useNavigate(); 
    const handleSuccess = () => {
        
        nav('/dashboard/my-bookings', { replace: true });
    };

 return (
    <div className="max-w-md mx-auto py-10">
     <Elements stripe={stripePromise}>
         <CheckoutForm 
                bookingId={bookingId} 
                amount={amount} 
                serviceName={serviceName}
                onPaymentSuccess={handleSuccess}
              />
    </Elements>
    </div>
 );
}