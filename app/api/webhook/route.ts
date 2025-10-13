import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { generateSerial } from '@/lib/serialGenerator';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle payment_intent.succeeded event (for embedded checkout)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      // Generate serial number
      const serial = generateSerial();

      // Get customer email from metadata or receipt_email
      const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.email;

      if (!customerEmail) {
        console.error('No customer email found in payment intent');
        return NextResponse.json(
          { error: 'No customer email' },
          { status: 400 }
        );
      }

      // Store serial in PaymentIntent metadata (for your records)
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: {
          ...paymentIntent.metadata,
          serial_number: serial,
        },
      });

      // Send email with download link and serial
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const downloadUrl = `${siteUrl}/PhaseGarden_v1.0_Installer.pkg`;

      await resend.emails.send({
        from: 'PhaseGarden <orders@rnfaudio.space>',
        to: customerEmail,
        subject: 'Your PhaseGarden Serial Number & Download',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'DotGothic16', sans-serif;
      line-height: 1.8;
      color: #000;
      background: #fff;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    p {
      margin: 0 0 15px 0;
    }
    a {
      color: #000;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <p>PhaseGarden</p>
  <p>Thank you for your purchase.</p>

  <p>Your serial number:</p>
  <p>${serial}</p>

  <p>Download: <a href="${downloadUrl}">${downloadUrl}</a></p>

  <p>Installation:</p>
  <p>1. Download the installer package</p>
  <p>2. Double-click to run the installer</p>
  <p>3. Follow the installation prompts</p>
  <p>4. Rescan plugins in your DAW</p>
  <p>5. Open PhaseGarden and enter your serial number</p>

  <p>Your serial works on all your computers.</p>
  <p>Keep this email safe.</p>

  <p>— RNF Audio</p>
  <p>https://rnfaudio.space</p>
  <p>@rnf_audio</p>
</body>
</html>
        `,
      });

      console.log(`✅ Order fulfilled for ${customerEmail}, Serial: ${serial}`);

      return NextResponse.json({
        received: true,
        serial,
        email: customerEmail
      });
    } catch (error: any) {
      console.error('Error fulfilling order:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
