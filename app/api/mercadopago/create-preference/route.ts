import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { email, newsletter } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    // Create preference
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preferenceData = {
      items: [
        {
          id: 'phasegarden',
          title: 'PhaseGarden',
          description: 'VST3 • AU • AAX • macOS 10.13+ • Windows 10+',
          quantity: 1,
          unit_price: 12.00,
          currency_id: 'USD',
        },
      ],
      payer: {
        email: email,
      },
      back_urls: {
        success: `${siteUrl}/success`,
        failure: `${siteUrl}/checkout`,
        pending: `${siteUrl}/checkout`,
      },
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      metadata: {
        customer_email: email,
        newsletter: newsletter,
      },
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      preference_id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error('Mercado Pago error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment preference' },
      { status: 500 }
    );
  }
}
