'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@/components/PaymentForm';
import MobileMenu from '@/components/MobileMenu';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleContinue = async () => {
    if (!email) return;

    try {
      // Create Stripe PaymentIntent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        alert('Error: ' + error);
        return;
      }

      setClientSecret(clientSecret);
      setShowPayment(true);
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="checkout-page">
        {/* Header */}
        <header className="checkout-header">
          <Link href="/" className="checkout-logo">
            RNF<br />AUDIO
          </Link>
          <nav className="checkout-nav">
            <Link href="/">home</Link>
            <Link href="/about">about</Link>
            <Link href="/download">downloads</Link>
          </nav>
          <MobileMenu />
        </header>

        {/* Main Content */}
        <main className="checkout-main">
          <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="cart-item">
                <span className="item-name">PhaseGarden</span>
                <span className="item-quantity">x1</span>
              </div>
              <div className="cart-format">
                VST3 • AU • AAX • macOS 10.13+ • Windows 10+
              </div>

              <div className="cart-pricing">
                <div className="price-line">
                  <span>Original Price:</span>
                  <span>$20.00</span>
                </div>
                <div className="price-line discount">
                  <span>Launch Discount:</span>
                  <span>-$8.00</span>
                </div>
                <div className="price-line total">
                  <span>Total:</span>
                  <span>$12.00 USD</span>
                </div>
              </div>
            </div>

            {!showPayment ? (
              /* Email Input */
              <div className="checkout-form">
                <label htmlFor="email" className="email-label">
                  Email
                  <span className="email-note">Double-check for serial number delivery</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />

                {/* Newsletter */}
                <label className="newsletter-checkbox">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                  />
                  <span>Subscribe to newsletter for updates and exclusive offers</span>
                </label>

                {/* Continue Button */}
                <button
                  className="checkout-btn"
                  onClick={handleContinue}
                  disabled={!email}
                >
                  Continue to Payment
                </button>
              </div>
            ) : (
              /* Payment Form */
              <div className="checkout-form">
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm />
                  </Elements>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="checkout-footer">
          <span>© RNF 2025 • <a href="https://instagram.com/rnfaudio" target="_blank" rel="noopener noreferrer">@rnfaudio</a></span>
        </footer>
      </div>
    </>
  );
}
