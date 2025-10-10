# PhaseGarden Website - Setup Guide

Your website is now **fully integrated** with automatic serial generation and delivery! 🎉

## ✅ What's Been Completed

1. **DMG Hosting** - PhaseGarden_v1.0_macOS.dmg (57MB) ready to download
2. **Serial Generator** - TypeScript version of your Python script
3. **Stripe Integration** - Checkout flow complete
4. **Webhook System** - Auto-detects payments
5. **Email Delivery** - Beautiful HTML emails with serial + download link
6. **Success Page** - Shows serial number and download button

---

## 🔑 Required API Keys

You need to set up these services (all have free tiers):

### 1. Resend (Email Delivery) - FREE

**Sign up:** https://resend.com

1. Create account (no credit card needed)
2. Verify your domain: `rnfaudio.space`
   - Add DNS records (they'll guide you)
   - Or use their test domain for now: `onboarding@resend.dev`
3. Generate API key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

**Free tier:** 100 emails/day, 3,000/month (perfect for starting)

---

### 2. Stripe Webhook

You already have Stripe test keys. Now you need to set up webhooks:

**For local testing:**

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`)

5. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

**For production (when deployed):**

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://rnfaudio.space/api/webhook`
4. Events: Select `checkout.session.completed`
5. Copy webhook signing secret
6. Add to production environment variables

---

## 🚀 Running Locally

### Terminal 1: Start Next.js dev server

```bash
cd /Users/leonardo/phasegarden-website
npm run dev
```

Website runs at: http://localhost:3000

### Terminal 2: Start Stripe webhook forwarding

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

This forwards Stripe events to your local machine.

---

## 🧪 Testing the Complete Flow

### Test Purchase (No Real Money)

1. **Start servers** (see above)

2. **Visit:** http://localhost:3000

3. **Click "Buy Now"** or navigate to checkout

4. **Enter test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Zip: Any 5 digits

5. **Complete checkout**

6. **Watch Terminal 2** - you'll see:
   ```
   ✅ Order fulfilled for test@example.com, Serial: XXXX-XXXX-XXXX-XXXX
   ```

7. **Check "email"** - In dev mode, Resend logs emails to console

8. **Visit success page** - Should show serial number and download button

---

## 📧 Email Preview

Your customers will receive:

```
Subject: Your PhaseGarden Serial Number & Download

🎵 PhaseGarden
Thank you for your purchase!

┌─────────────────────────────┐
│  Your Serial Number         │
│  XXXX-XXXX-XXXX-XXXX       │
│  (also sent to your email)  │
└─────────────────────────────┘

[Download PhaseGarden (macOS)]

Installation Instructions:
1. Download the DMG file
2. Drag plugins to /Library/Audio/Plug-Ins/
3. Rescan plugins in your DAW
4. Open PhaseGarden and click "License"
5. Enter your serial number
6. Enjoy! ✨

Keep this email safe! Your serial works forever.
```

---

## 🌍 Deploying to Production

### Option 1: Vercel (Recommended - FREE)

1. **Push to GitHub:**
   ```bash
   cd /Users/leonardo/phasegarden-website
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   gh repo create phasegarden-website --public --source=. --remote=origin
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to: https://vercel.com
   - Click "Import Project"
   - Connect your GitHub repo
   - Add environment variables:
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET` (production one from Stripe dashboard)
     - `RESEND_API_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `NEXT_PUBLIC_SITE_URL=https://rnfaudio.space`
   - Deploy!

3. **Update DNS:**
   - In your domain registrar (where you bought rnfaudio.space)
   - Point to Vercel:
     - A record: `76.76.21.21`
     - Or follow Vercel's custom domain guide

4. **Set up production webhook:**
   - Stripe Dashboard → Webhooks
   - Add endpoint: `https://rnfaudio.space/api/webhook`
   - Copy new signing secret
   - Update in Vercel environment variables

---

## 💰 Going Live with Real Payments

1. **Switch Stripe to live mode:**
   - Dashboard → Developers → API keys
   - Copy live keys (start with `pk_live_` and `sk_live_`)
   - Update `.env.local` or Vercel env vars

2. **Verify Resend domain:**
   - Must verify `rnfaudio.space` to send from `orders@rnfaudio.space`
   - Or use: `orders@resend.dev` for testing

3. **Update email "from" address:**
   - Edit `/app/api/webhook/route.ts`
   - Line 60: Change `from: 'PhaseGarden <orders@rnfaudio.space>'`
   - Use your verified domain

4. **Test with real card** (charge yourself $12, Stripe refunds it later)

5. **Go live!** 🚀

---

## 🎯 Complete Purchase Flow

Here's what happens when someone buys:

1. **Customer clicks "Buy Now"**
2. **Stripe Checkout opens** ($12 payment)
3. **Payment succeeds**
4. **Stripe webhook fires** → `/api/webhook`
5. **Server generates serial** via `serialGenerator.ts`
6. **Server stores serial** in Stripe session metadata
7. **Server sends email** via Resend:
   - Subject: "Your PhaseGarden Serial Number & Download"
   - Contains: Serial + Download link + Instructions
8. **Customer redirected** to `/success` page
9. **Success page fetches serial** from Stripe session
10. **Customer sees**:
    - Serial number (on page)
    - Download button (57MB DMG)
    - Installation instructions
11. **Customer receives email** (backup of everything)

---

## 📊 Tracking Sales

### In Stripe Dashboard

- See all payments
- Export customer emails
- View serial numbers in session metadata

### Add Analytics (Optional)

**Google Analytics:**
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`
3. Track purchases in success page

**Simple spreadsheet:**
```bash
# View all serials generated (from Stripe logs)
stripe logs tail --filter-field status=succeeded
```

---

## 🐛 Troubleshooting

### Serial not showing on success page?

**Check:**
1. Webhook is running (`stripe listen` in Terminal 2)
2. `.env.local` has correct `STRIPE_WEBHOOK_SECRET`
3. Look at Terminal 2 for webhook events
4. Check Stripe Dashboard → Webhooks → Event logs

### Email not sending?

**Check:**
1. `RESEND_API_KEY` is set in `.env.local`
2. "From" email matches verified domain
3. Resend dashboard → Logs for errors
4. In dev mode, emails are logged to console (not actually sent)

### Download button 404?

**Check:**
1. DMG exists: `ls /Users/leonardo/phasegarden-website/public/*.dmg`
2. Should be: `PhaseGarden_v1.0_macOS.dmg` (57MB)
3. Accessed via: `/PhaseGarden_v1.0_macOS.dmg`

---

## 📁 Project Structure

```
phasegarden-website/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts       # Create Stripe session
│   │   ├── webhook/route.ts        # Receive payments, send emails
│   │   └── session/route.ts        # Get serial from session
│   ├── success/page.tsx            # Thank you page with serial
│   └── page.tsx                    # Homepage
├── lib/
│   └── serialGenerator.ts          # Generate & validate serials
├── public/
│   └── PhaseGarden_v1.0_macOS.dmg # 57MB plugin installer
├── .env.local                      # API keys (DON'T COMMIT!)
└── SETUP_GUIDE.md                  # This file
```

---

## ✅ Pre-Launch Checklist

- [ ] Resend account created & API key added
- [ ] Domain verified in Resend (or using test domain)
- [ ] Stripe webhook secret added to `.env.local`
- [ ] Tested purchase with test card (4242 4242 4242 4242)
- [ ] Verified serial shows on success page
- [ ] Verified email sends (check console in dev mode)
- [ ] DMG downloads correctly
- [ ] Tested serial in actual PhaseGarden plugin
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Custom domain (rnfaudio.space) connected
- [ ] Production webhook configured in Stripe
- [ ] Switched to live Stripe keys
- [ ] Test purchase with real card ($12 → refund yourself)

---

## 🎉 You're Ready to Sell!

Once you complete the checklist above, your store is **100% automated**:

1. Customer pays → Stripe charges them
2. Webhook fires → Serial generated instantly
3. Email sends → Download link + serial delivered
4. You do nothing → Money in your bank account

**Per-sale cost:**
- Sale: $12.00
- Stripe fee: -$0.65 (2.9% + $0.30)
- Resend: -$0.00 (free tier)
- Vercel: -$0.00 (free tier)
- **Your profit: $11.35** 💰

**Time per sale: 0 seconds** (fully automated) ⚡

---

## 🆘 Need Help?

If you get stuck:

1. Check the troubleshooting section above
2. Look at Terminal output for errors
3. Check Stripe Dashboard → Webhooks → Logs
4. Check Resend Dashboard → Logs
5. Make sure all env vars are set

Good luck with your launch! 🚀
