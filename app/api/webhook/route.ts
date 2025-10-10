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
      const downloadUrl = `${siteUrl}/PhaseGarden_v1.0_macOS.dmg`;

      await resend.emails.send({
        from: 'PhaseGarden <orders@rnfaudio.space>',
        to: customerEmail,
        subject: 'Your PhaseGarden Serial Number & Download',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #000;
      color: #fff;
      padding: 30px 20px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 20px;
    }
    .serial-box {
      background: #f5f5f5;
      border: 2px dashed #333;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
      font-family: 'Courier New', monospace;
    }
    .serial-box .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .serial-box .serial {
      font-size: 24px;
      font-weight: bold;
      color: #000;
      letter-spacing: 2px;
    }
    .download-btn {
      display: inline-block;
      background: #000;
      color: #fff;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: 600;
    }
    .instructions {
      background: #fffbf0;
      border-left: 4px solid #ffcc00;
      padding: 15px 20px;
      margin: 25px 0;
    }
    .instructions h3 {
      margin-top: 0;
      color: #333;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #000;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎵 PhaseGarden</h1>
    <p>Thank you for your purchase!</p>
  </div>

  <div class="content">
    <p>Hi there,</p>

    <p>Your PhaseGarden plugin is ready to download! Below you'll find your unique serial number and installation instructions.</p>

    <div class="serial-box">
      <div class="label">Your Serial Number</div>
      <div class="serial">${serial}</div>
    </div>

    <p style="text-align: center;">
      <a href="${downloadUrl}" class="download-btn">Download PhaseGarden (macOS)</a>
    </p>

    <div class="instructions">
      <h3>Installation Instructions</h3>
      <ol>
        <li><strong>Download</strong> the DMG file using the button above</li>
        <li><strong>Open</strong> the DMG and drag the plugins to:
          <ul>
            <li>AU: <code>/Library/Audio/Plug-Ins/Components/</code></li>
            <li>VST3: <code>/Library/Audio/Plug-Ins/VST3/</code></li>
          </ul>
        </li>
        <li><strong>Rescan</strong> plugins in your DAW</li>
        <li><strong>Open</strong> PhaseGarden in your DAW</li>
        <li><strong>Click</strong> the "License" button (top-right corner)</li>
        <li><strong>Enter</strong> your serial number: <code>${serial}</code></li>
        <li><strong>Enjoy!</strong> Your plugin is now activated forever ✨</li>
      </ol>
    </div>

    <p><strong>Keep this email safe!</strong> Your serial number is unique and can be used to activate PhaseGarden on all your computers.</p>

    <h3>Need Help?</h3>
    <p>If you have any issues with installation or activation:</p>
    <ul>
      <li>Email: <a href="mailto:support@rnfaudio.space">support@rnfaudio.space</a></li>
      <li>Instagram: <a href="https://instagram.com/rnf_audio">@rnf_audio</a></li>
    </ul>

    <p style="margin-top: 30px;">Happy sound designing! 🎛️</p>
    <p><strong>— RNF Audio</strong></p>
  </div>

  <div class="footer">
    <p>
      © 2025 RNF Audio<br>
      <a href="https://rnfaudio.space">rnfaudio.space</a> •
      <a href="https://instagram.com/rnf_audio">@rnf_audio</a>
    </p>
  </div>
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
