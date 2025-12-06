import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ bookingId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data } = await axios.post('/create-payment-intent', { amount });
    const clientSecret = data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        await axios.patch(`/bookings/${bookingId}`, { status: 'paid' });
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || loading} className="btn btn-primary mt-4">
        Pay {amount} BDT
      </button>
    </form>
  );
}

export default function PaymentPage({ bookingId, amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm bookingId={bookingId} amount={amount} />
    </Elements>
  );
}
