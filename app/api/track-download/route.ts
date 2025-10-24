import { NextRequest, NextResponse } from 'next/server';

// Simple download tracking endpoint
// Logs downloads in a searchable format for Vercel logs

export async function POST(req: NextRequest) {
  try {
    const { type, source } = await req.json();

    const timestamp = new Date().toISOString();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Log in a searchable format
    console.log('🎯 DOWNLOAD_TRACKED', JSON.stringify({
      timestamp,
      type, // 'demo' or 'purchase'
      source, // 'download_page' or 'success_page'
      ip: ip.split(',')[0], // First IP in case of proxy chain
      userAgent: userAgent.substring(0, 100), // Truncate for readability
    }));

    return NextResponse.json({
      success: true,
      message: 'Download tracked'
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json({
      success: false
    }, {
      status: 500
    });
  }
}
