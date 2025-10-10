# Quick Start - Get Your Store Running in 5 Minutes

## Step 1: Get Resend API Key (2 min)

1. Go to: https://resend.com
2. Sign up (free, no credit card)
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with `re_`)
5. Paste in `.env.local`:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

**For now, use test email:** `from: 'PhaseGarden <onboarding@resend.dev>'`
(Later verify your domain to use `orders@rnfaudio.space`)

---

## Step 2: Set Up Stripe Webhook (2 min)

```bash
# Install Stripe CLI (only once)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Get webhook secret
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the signing secret (starts with `whsec_`) and add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

**Keep this terminal window open!**

---

## Step 3: Start Dev Server (1 min)

Open a NEW terminal:

```bash
cd /Users/leonardo/phasegarden-website
npm run dev
```

Go to: http://localhost:3000

---

## Step 4: Test Purchase (1 min)

1. Click "Buy Now"
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry, any CVC, any zip
4. Complete purchase
5. Should redirect to success page with serial!

---

## ✅ If Everything Works

You should see:
- ✅ Success page with serial number
- ✅ Download button for DMG
- ✅ Terminal shows: `✅ Order fulfilled for...`
- ✅ Email logged to console (in dev mode)

---

## 🚀 Deploy to Production

When ready to go live:

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create phasegarden-website --public --source=.
git push -u origin main

# Deploy to Vercel
# Go to vercel.com → Import Project → Add env vars
```

That's it! 🎉

See `SETUP_GUIDE.md` for detailed instructions.
