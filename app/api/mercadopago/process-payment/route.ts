import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';
import { generateSerial } from '@/lib/serialGenerator';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received payment request:', JSON.stringify(body, null, 2));

    // Extract data from the nested formData structure that Payment Brick sends
    const formData = body.formData || body;
    const email = body.email || formData.payer?.email;
    const newsletter = body.newsletter;

    const {
      token,
      payment_method_id,
      transaction_amount,
      installments,
      issuer_id,
      payer
    } = formData;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!payment_method_id) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);

    // Process the payment
    const paymentBody: any = {
      transaction_amount: transaction_amount || 12.00,
      description: 'PhaseGarden - VST3 • AU • AAX Audio Plugin',
      payment_method_id: payment_method_id,
      payer: {
        email: email,
      },
      metadata: {
        customer_email: email,
        newsletter: newsletter ? 'true' : 'false',
      },
    };

    // For credit card payments, token is required
    if (token) {
      paymentBody.token = token;
      paymentBody.installments = installments || 1;
    }

    // Add issuer_id if provided (required for some payment methods)
    if (issuer_id) {
      paymentBody.issuer_id = issuer_id;
    }

    // Add payer identification if provided
    if (payer?.identification) {
      paymentBody.payer.identification = payer.identification;
    }

    console.log('Creating payment...');

    const paymentResult = await payment.create({ body: paymentBody });

    console.log('Payment created:', paymentResult.status);
    console.log('Payment status detail:', paymentResult.status_detail);

    // If payment is approved, fulfill the order immediately
    if (paymentResult.status === 'approved') {
      const serial = generateSerial();

      // Send email with download link and serial
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const downloadUrl = `${siteUrl}/PhaseGarden_v1.0_Installer.pkg`;

      await resend.emails.send({
        from: 'PhaseGarden <orders@rnfaudio.space>',
        to: email,
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

      console.log(`✅ Order fulfilled via Mercado Pago for ${email}, Serial: ${serial}`);
    }

    // For PIX payments, include QR code and payment info
    const response: any = {
      status: paymentResult.status,
      status_detail: paymentResult.status_detail,
      id: paymentResult.id,
    };

    // If it's a PIX payment, include the transaction data
    if (payment_method_id === 'pix' && paymentResult.point_of_interaction) {
      response.qr_code = paymentResult.point_of_interaction.transaction_data?.qr_code;
      response.qr_code_base64 = paymentResult.point_of_interaction.transaction_data?.qr_code_base64;
      response.ticket_url = paymentResult.point_of_interaction.transaction_data?.ticket_url;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Mercado Pago payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}
