'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FloatingKaomoji from '@/components/FloatingKaomoji';

// Force dynamic rendering since we use useSearchParams
export const dynamic = 'force-dynamic';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent') || searchParams.get('payment_intent_client_secret')?.split('_secret_')[0];

    if (!paymentIntentId) {
      setError('No payment information found');
      setLoading(false);
      return;
    }

    // Fetch payment intent data including serial number
    const fetchSerial = async () => {
      try {
        const res = await fetch(`/api/payment-intent?payment_intent=${paymentIntentId}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          // Serial might not be available immediately if webhook hasn't processed yet
          if (!data.serialNumber) {
            // Retry after 2 seconds
            setTimeout(async () => {
              const retryRes = await fetch(`/api/payment-intent?payment_intent=${paymentIntentId}`);
              const retryData = await retryRes.json();
              setSerialNumber(retryData.serialNumber || 'Check your email');
              setLoading(false);
            }, 2000);
          } else {
            setSerialNumber(data.serialNumber);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching payment intent:', err);
        setError('Error loading your order details');
        setLoading(false);
      }
    };

    fetchSerial();
  }, [searchParams]);

  return (
    <>
      <FloatingKaomoji />
      <div className="download-page">
        <header className="download-header">
          <Link href="/" className="download-logo">
            RNF<br />AUDIO
          </Link>
          <nav className="download-nav">
            <Link href="/">home</Link>
            <Link href="/about">about</Link>
            <Link href="/download">downloads</Link>
          </nav>
        </header>

        <main className="download-main">
          <div className="download-container">
            <h1 className="download-title">// Thank You! 🎉</h1>

            <p className="download-info-line">
              Your purchase was successful! Check your email for download instructions and your serial number.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Loading your order details...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
                {error}
              </div>
            ) : (
              <>
                {serialNumber && (
                  <div style={{
                    background: '#f5f5f5',
                    border: '2px dashed #333',
                    padding: '20px',
                    margin: '30px 0',
                    textAlign: 'center',
                    fontFamily: 'monospace'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '10px'
                    }}>
                      Your Serial Number
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#000',
                      letterSpacing: '2px'
                    }}>
                      {serialNumber}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      marginTop: '10px'
                    }}>
                      (also sent to your email)
                    </div>
                  </div>
                )}

                <div className="download-section-secondary">
                  <p className="download-subtitle">Download PhaseGarden</p>
                  <div className="download-buttons">
                    <a
                      href="/PhaseGarden_v1.0_macOS.dmg"
                      download
                      className="download-btn"
                      style={{ textDecoration: 'none', display: 'inline-block' }}
                    >
                      Mac (57MB)
                    </a>
                    <button
                      className="download-btn"
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      disabled
                    >
                      Windows (Coming Soon)
                    </button>
                  </div>
                </div>

                <div style={{
                  background: '#fffbf0',
                  borderLeft: '4px solid #ffcc00',
                  padding: '15px 20px',
                  margin: '25px 0'
                }}>
                  <h3 style={{ marginTop: 0, color: '#333' }}>Quick Start</h3>
                  <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li>Download the DMG file above</li>
                    <li>Drag plugins to <code>/Library/Audio/Plug-Ins/</code></li>
                    <li>Rescan plugins in your DAW</li>
                    <li>Open PhaseGarden and click "License"</li>
                    <li>Enter your serial number</li>
                    <li>Enjoy! ✨</li>
                  </ol>
                </div>
              </>
            )}

            <div className="download-links">
              <a href="mailto:support@rnfaudio.space">Support</a>
              <span>•</span>
              <a href="https://instagram.com/rnf_audio" target="_blank" rel="noopener noreferrer">@rnf_audio</a>
            </div>
          </div>
        </main>

        <footer className="download-footer">
          <span>© RNF 2025 • <a href="https://instagram.com/rnf_audio" target="_blank" rel="noopener noreferrer">@rnf_audio</a> • <a href="mailto:leonardo@rnfaudio.com">contact</a></span>
        </footer>
      </div>
    </>
  );
}
