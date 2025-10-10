'use client';

import { useState, FormEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful - redirect to success with payment intent ID
      router.push(`/success?payment_intent=${paymentIntent.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement className="payment-element" />

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <button
        type="submit"
        className="checkout-btn"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Pay $12'}
      </button>
    </form>
  );
}
