'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

interface MercadoPagoPaymentProps {
  email: string;
  newsletter: boolean;
}

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function MercadoPagoPayment({ email, newsletter }: MercadoPagoPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const brickControllerRef = useRef<any>(null);

  useEffect(() => {
    if (!sdkLoaded || !window.MercadoPago) {
      console.log('SDK not ready:', { sdkLoaded, hasMercadoPago: !!window.MercadoPago });
      return;
    }

    console.log('Initializing Mercado Pago with public key:', process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);

    try {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
        locale: 'pt-BR',
      });

      const bricksBuilder = mp.bricks();

      const renderPaymentBrick = async () => {
        try {
          const settings = {
            initialization: {
              amount: 70.00,
            },
            customization: {
              paymentMethods: {
                maxInstallments: 1,
              },
            },
            callbacks: {
              onReady: () => {
                console.log('✅ Payment Brick is ready');
              },
              onSubmit: async (formData: any) => {
                console.log('Payment submitted:', formData);
                setIsProcessing(true);

                try {
                  const response = await fetch('/api/mercadopago/process-payment', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ...formData,
                      email,
                      newsletter,
                    }),
                  });

                  const result = await response.json();
                  console.log('Payment result:', result);

                  if (result.error) {
                    alert('Payment failed: ' + result.error);
                    setIsProcessing(false);
                    return;
                  }

                  if (result.status === 'approved') {
                    window.location.href = '/success';
                  } else if (result.status === 'pending') {
                    alert('Payment pending. You will receive an email when approved.');
                    window.location.href = '/success';
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
                console.error('❌ Brick callback error:', error);
                setIsProcessing(false);
              },
            },
          };

          console.log('Creating Payment Brick with settings:', settings);
          brickControllerRef.current = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
          console.log('✅ Payment Brick created successfully');
        } catch (error) {
          console.error('❌ Error creating Payment Brick:', error);
        }
      };

      renderPaymentBrick();

      return () => {
        if (brickControllerRef.current) {
          console.log('Unmounting Payment Brick');
          brickControllerRef.current.unmount();
        }
      };
    } catch (error) {
      console.error('❌ Error initializing Mercado Pago:', error);
    }
  }, [sdkLoaded, email, newsletter]);

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => {
          console.log('Mercado Pago SDK loaded');
          setSdkLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load Mercado Pago SDK:', e);
        }}
      />
      <div className="mercadopago-payment">
        <div id="paymentBrick_container"></div>
        {isProcessing && (
          <div className="processing-overlay">
            Processing payment...
          </div>
        )}
      </div>
    </>
  );
}
