import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent for embedded checkout
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1200, // $12.00 in cents
      currency: 'usd',
      receipt_email: email,
      metadata: {
        product: 'PhaseGarden',
        email: email,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always', // Enables all payment methods including Pix, PayPal, etc.
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
