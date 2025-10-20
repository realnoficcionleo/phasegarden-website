import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';
import { generateSerial } from '@/lib/serialGenerator';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago sends notifications with different types
    // We're interested in "payment" notifications
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);

    // Fetch the payment details
    const paymentData = await payment.get({ id: paymentId });

    // Only process approved payments
    if (paymentData.status !== 'approved') {
      console.log(`Payment ${paymentId} status: ${paymentData.status}, skipping fulfillment`);
      return NextResponse.json({ received: true, status: paymentData.status });
    }

    // Check if we already processed this payment (to avoid duplicates)
    // In production, you should store processed payment IDs in a database
    // For now, we'll just log it
    console.log(`Processing approved payment: ${paymentId}`);

    // Generate serial number
    const serial = generateSerial();

    // Get customer email from metadata
    const customerEmail = paymentData.metadata?.customer_email;
    const newsletter = paymentData.metadata?.newsletter;

    if (!customerEmail) {
      console.error('No customer email found in payment metadata');
      return NextResponse.json(
        { error: 'No customer email' },
        { status: 400 }
      );
    }

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
  <p>@rnfaudio</p>
</body>
</html>
      `,
    });

    console.log(`✅ Order fulfilled via Mercado Pago for ${customerEmail}, Serial: ${serial}`);

    // TODO: Store the serial, payment ID, and email in your database
    // This prevents duplicate fulfillment and keeps records

    return NextResponse.json({
      received: true,
      fulfilled: true,
      serial,
      email: customerEmail,
    });
  } catch (error: any) {
    console.error('Mercado Pago webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
