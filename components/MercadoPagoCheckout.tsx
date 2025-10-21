'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface MercadoPagoCheckoutProps {
  email: string;
  newsletter: boolean;
}

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function MercadoPagoCheckout({ email, newsletter }: MercadoPagoCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const brickControllerRef = useRef<any>(null);

  useEffect(() => {
    console.log('MercadoPago component mounted', { sdkLoaded, hasMercadoPago: !!window.MercadoPago });

    if (!sdkLoaded || !window.MercadoPago) {
      console.log('Waiting for SDK to load...');
      return;
    }

    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
      locale: 'pt-BR',
    });

    const bricksBuilder = mp.bricks();

    const renderPaymentBrick = async () => {
      try {
        const settings = {
          initialization: {
            amount: 12.00,
            payer: {
              email: email,
            },
          },
          customization: {
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              minInstallments: 1,
              maxInstallments: 1,
            },
            visual: {
              style: {
                theme: 'default',
              },
              hidePaymentButton: false,
            },
          },
          callbacks: {
            onReady: () => {
              console.log('✅ Payment Brick ready');
            },
            onSubmit: async (formData: any) => {
              console.log('💳 Payment submitted:', formData);
              console.log('💳 Full formData structure:', JSON.stringify(formData, null, 2));
              setIsProcessing(true);

              try {
                const response = await fetch('/api/mercadopago/process-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...formData,
                    email,
                    newsletter,
                  }),
                });

                const result = await response.json();
                console.log('Payment result:', result);
                console.log('QR Code data:', {
                  has_qr_code: !!result.qr_code,
                  has_qr_code_base64: !!result.qr_code_base64,
                  qr_code_length: result.qr_code?.length,
                  qr_code_base64_length: result.qr_code_base64?.length
                });

                if (result.error) {
                  alert('Payment failed: ' + result.error);
                  setIsProcessing(false);
                  return;
                }

                if (result.status === 'approved') {
                  window.location.href = '/success';
                } else if (result.status === 'pending') {
                  // For PIX payments, show QR code
                  if (result.qr_code || result.qr_code_base64) {
                    console.log('Setting PIX data:', result);
                    setPixData(result);
                    setIsProcessing(false);
                  } else {
                    console.warn('No QR code in response, showing generic pending message');
                    alert('Payment pending. You will receive an email when approved.');
                    window.location.href = '/success';
                  }
                } else if (result.status === 'rejected') {
                  const rejectionMessage = result.status_detail || 'Payment was rejected';
                  alert(`Payment rejected: ${rejectionMessage}. Please check your card details and try again.`);
                  setIsProcessing(false);
                } else {
                  alert('Payment was not successful. Please try again.');
                  setIsProcessing(false);
                }
              } catch (error) {
                console.error('Payment error:', error);
                alert('An error occurred. Please try again.');
                setIsProcessing(false);
              }
            },
            onError: (error: any) => {
              console.error('❌ Brick error:', error);
              setIsProcessing(false);
            },
          },
        };

        brickControllerRef.current = await bricksBuilder.create(
          'payment',
          'payment-brick-container',
          settings
        );

        console.log('✅ Payment Brick created');
      } catch (error) {
        console.error('❌ Error creating brick:', error);
      }
    };

    renderPaymentBrick();

    return () => {
      if (brickControllerRef.current) {
        brickControllerRef.current.unmount();
      }
    };
  }, [sdkLoaded, email, newsletter]);

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => {
          console.log('✅ Mercado Pago SDK loaded');
          setSdkLoaded(true);
        }}
        onError={(e) => {
          console.error('❌ Failed to load Mercado Pago SDK:', e);
        }}
      />
      {!sdkLoaded && <div>Loading payment form...</div>}

      {pixData ? (
        <div className="pix-payment-container">
          <h3>Scan this QR Code to pay with PIX</h3>
          {pixData.qr_code_base64 && (
            <img
              src={`data:image/png;base64,${pixData.qr_code_base64}`}
              alt="PIX QR Code"
              style={{ maxWidth: '300px', margin: '20px auto', display: 'block' }}
            />
          )}
          {pixData.qr_code && (
            <div style={{ marginTop: '20px' }}>
              <p>Or copy and paste this PIX code:</p>
              <textarea
                readOnly
                value={pixData.qr_code}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  padding: '10px'
                }}
                onClick={(e) => {
                  e.currentTarget.select();
                  navigator.clipboard.writeText(pixData.qr_code);
                  alert('PIX code copied to clipboard!');
                }}
              />
            </div>
          )}
          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            After payment, you'll receive your serial number by email within a few minutes.
          </p>
        </div>
      ) : (
        <div id="payment-brick-container" className="mercadopago-payment-brick" />
      )}

      {isProcessing && (
        <div className="processing-overlay">
          Processing payment...
        </div>
      )}
    </>
  );
}
