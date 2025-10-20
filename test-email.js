// Test script to send a sample purchase email
const { Resend } = require('resend');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

// Serial generator (same as TypeScript version)
function generateChecksum(data) {
  const combined = data + "PhaseGarden";
  const md5Hash = crypto.createHash('md5').update(combined).digest('hex');
  return md5Hash.substring(0, 4).toUpperCase();
}

function generateRandomPart(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateSerial() {
  const part1 = generateRandomPart(4);
  const part2 = generateRandomPart(4);
  const part3 = generateRandomPart(4);
  const data = part1 + part2 + part3;
  const part4 = generateChecksum(data);
  return `${part1}-${part2}-${part3}-${part4}`;
}

async function sendTestEmail() {
  const serial = generateSerial();
  // Force production URL for test email
  const siteUrl = 'https://rnfaudio.space';
  const downloadUrl = `${siteUrl}/PhaseGarden_v1.0_Installer.pkg`;

  console.log('Sending test email to leonardostroka@gmail.com...');
  console.log('Generated serial:', serial);

  try {
    const result = await resend.emails.send({
      from: 'PhaseGarden <orders@rnfaudio.space>',
      to: 'leonardostroka@gmail.com',
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

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('\nCheck your inbox at leonardostroka@gmail.com');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendTestEmail();
