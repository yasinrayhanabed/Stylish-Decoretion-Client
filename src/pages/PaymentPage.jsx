import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import API from "../api/axios";
import { toast } from "react-toastify";
import { formatAmountFull } from "../utils/formatCurrency";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

function CheckoutForm({ bookingDetails, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { cost: amount } = bookingDetails;
  const finalAmount = Math.max(100, amount);

  const handleSubmit = async (e) => {
    const {
      _id: bookingId,
      cost: amount,
      serviceName,
      assignedDecorator,
    } = bookingDetails; // bookingDetails already has cost
    const finalAmount = Math.max(100, amount);

    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { data } = await API.post("/create-payment-intent", {
        amount: finalAmount,
      });
      const clientSecret = data.clientSecret;

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
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
        if (result.paymentIntent.status === "succeeded") {
          await API.post("/payments", {
            bookingId,
            transactionId: result.paymentIntent.id,
            amount: finalAmount / 100,
            currency: "BDT",
            serviceName: serviceName,
            decoratorId: assignedDecorator,
          });

          try {
            await API.put(`/bookings/${bookingId}`, {
              paymentStatus: "completed",
              isPaid: true,
            });
          } catch (updateErr) {
            console.error(
              "Failed to update booking payment status:",
              updateErr
            );
          }

          toast.success("Payment successful! Payment completed.");
          onPaymentSuccess(result.paymentIntent.id);
        } else {
          toast.error(`Payment failed: ${result.paymentIntent.status}`);
        }
      }
    } catch (error) {
      console.error("Payment Process Error:", error);
      toast.error(
        error.response?.data?.message ||
          "A server error occurred during payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Complete Payment for:{" "}
        <span className="text-blue-600">{bookingDetails.serviceName}</span>
      </h3>
      <p className="text-2xl font-bold mb-6 text-green-600">
        Total Payable: {formatAmountFull(finalAmount)}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border p-3 rounded-lg bg-gray-50">
          <CardElement options={cardElementOptions} />
        </div>
        <button
          disabled={!stripe || loading}
          className={`btn w-full ${
            loading
              ? "btn-disabled bg-gray-400"
              : "btn-primary bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Processing..." : `Pay ${formatAmountFull(finalAmount)}`}
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
      const pendingBooking = localStorage.getItem("pendingBooking");
      let localBookingInfo = null;

      if (pendingBooking) {
        try {
          localBookingInfo = JSON.parse(pendingBooking);
        } catch (err) {
          console.error("Failed to parse pending booking:", err);
        }
      }

      // Use bookingId from localStorage OR from URL params
      const targetBookingId = localBookingInfo?.bookingId || bookingId;

      if (targetBookingId) {
        try {
          const res = await API.get(`/bookings/details/${targetBookingId}`);
          setBookingData(res.data);
          setLoading(false);
          return;
        } catch (fetchErr) {
          console.error(
            "Failed to fetch latest booking data, using local data as fallback.",
            fetchErr
          );
          if (
            localBookingInfo &&
            localBookingInfo.bookingId === targetBookingId
          ) {
            const fallbackData = {
              ...localBookingInfo,
              _id: localBookingInfo.bookingId,
              cost: localBookingInfo.amount,
              assignedDecorator: localBookingInfo.decoratorId,
            };
            setBookingData(fallbackData);
            setLoading(false);
            return;
          }
        }
      }
      toast.error("No booking data found. Please select a booking to pay.");
      nav("/dashboard/my-bookings", { replace: true });
      setLoading(false);
    };

    loadBookingData();
  }, [bookingId, nav]);

  const handlePaymentSuccess = (transactionId) => {
    localStorage.removeItem("pendingBooking");
    nav(`/payment-success/${transactionId}`, { replace: true });
  };

  if (loading)
    return <div className="text-center py-10">Loading Booking Details...</div>;
  if (error || !bookingData || !bookingData.cost) {
    return (
      <div className="text-center py-10 text-red-500">
        Redirecting to My Bookings...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          bookingDetails={bookingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Elements>
    </div>
  );
}
