# Stripe Integration Setup Guide

> **Setup Template:** Complete guide for integrating Stripe payments and subscriptions into your application

---

## Overview

This guide walks you through setting up Stripe from scratch, including account creation, product configuration, webhook setup, and local development environment. By the end, you'll have a fully functional Stripe integration ready for development and testing.

**What you'll accomplish:**
- ✅ Create and configure your Stripe account
- ✅ Set up subscription products and pricing
- ✅ Configure Customer Portal for billing management
- ✅ Install and configure Stripe CLI
- ✅ Set up local webhook forwarding
- ✅ Collect all necessary environment variables
- ✅ Test your integration with sample data

**Time Required:** ~30-45 minutes

---

## Phase 1: Stripe Account Setup

### Step 1.1: Create Your Stripe Account

1. **Go to Stripe Registration**
   - Visit [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - Sign up with your email address
   - Verify your email when prompted

2. **Complete Account Setup**
   - Add your business information
   - **Important:** Start in **Test Mode** (toggle in top-left of dashboard)
   - You can activate your account later when ready for production

### Step 1.2: Navigate the Dashboard

**Key Dashboard Sections:**
- **Products** - Where you'll create subscription plans
- **Customers** - View and manage customer data
- **Payments** - Transaction history and details
- **Webhooks** - Configure event notifications
- **Developers** - API keys and webhook endpoints

---

## Phase 2: Product and Pricing Setup

### Step 2.1: Create Subscription Products

**For a typical SaaS with Basic and Pro tiers:**

1. **Navigate to Products**
   - Go to **Products** in the left sidebar
   - Click **+ Add product**

2. **Create Basic Plan**
   ```
   Product Name: Basic Plan
   Description: Perfect for individuals and small teams
   
   Pricing:
   - Price: $9.99
   - Billing period: Monthly
   - Currency: USD
   ```
   - Click **Save product**
   - **Copy the Price ID** (starts with `price_`) - you'll need this later

3. **Create Pro Plan**
   ```
   Product Name: Pro Plan  
   Description: Advanced features for growing businesses
   
   Pricing:
   - Price: $19.99
   - Billing period: Monthly
   - Currency: USD
   ```
   - Click **Save product**
   - **Copy the Price ID** (starts with `price_`) - you'll need this later

### Step 2.2: Configure Customer Portal

1. **Go to Customer Portal Settings**
   - Navigate to **Settings** → **Customer portal**
   - Click **Activate test link** if not already active

2. **Configure Portal Features**
   ```
   ✅ Update payment methods
   ✅ View invoice history
   ✅ Download invoices
   ✅ Update billing information
   ✅ Cancel subscriptions (optional - you decide)
   ✅ Pause subscriptions (optional)
   ```

3. **Set Business Information**
   - Add your business name, support email, and terms of service
   - Customize colors to match your branding (optional)

4. **Test the Portal**
   - Click **Preview** to see how it looks
   - **Copy the portal URL** - you'll configure this in your app

---

## Phase 3: API Keys and Webhook Configuration

### Step 3.1: Collect API Keys

1. **Navigate to API Keys**
   - Go to **Developers** → **API keys**
   - Make sure you're in **Test mode** (toggle at top)

2. **Copy Your Keys**
   ```bash
   # Test Mode Keys (for development)
   Publishable key: pk_test_...
   Secret key: sk_test_...
   
   # Live Mode Keys (for production - get these later)
   Publishable key: pk_live_...
   Secret key: sk_live_...
   ```

**🔐 Security Note:** Never commit secret keys to version control!

### Step 3.2: Create Webhook Endpoint

1. **Go to Webhooks**
   - Navigate to **Developers** → **Webhooks**
   - Click **+ Add endpoint**

2. **Configure Webhook for Local Development**
   ```
   Endpoint URL: http://localhost:3000/api/webhooks/stripe
   Description: Local development webhook
   
   Events to send:
   ✅ customer.subscription.created
   ✅ customer.subscription.updated  
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed
   ✅ customer.created
   ```

3. **Get Webhook Secret**
   - After creating, click on your webhook endpoint
   - Click **Reveal** next to "Signing secret"
   - **Copy the webhook secret** (starts with `whsec_`)

---

## Phase 4: Stripe CLI Installation

### Step 4.1: Install Stripe CLI

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows (Scoop):**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux (Direct Download):**
```bash
# Download latest release from GitHub
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz
tar -xvf stripe_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

**Verify Installation:**
```bash
stripe --version
```

### Step 4.2: Authenticate CLI

1. **Login to Stripe**
   ```bash
   stripe login
   ```
   - This will open your browser
   - Log in to your Stripe account  
   - Authorize the CLI

2. **Verify Authentication**
   ```bash
   stripe config --list
   ```

---

## Phase 5: Local Development Setup

### Step 5.1: Environment Variables

Create a `.env.local` file in your project root:

```bash
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Product Price IDs
STRIPE_BASIC_PRICE_ID=price_YOUR_BASIC_PRICE_ID
STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID

# Add to your existing environment variables
```

**🔐 Security Checklist:**
- [ ] Added `.env.local` to `.gitignore`
- [ ] Using test keys for development
- [ ] Never shared secret keys in chat/email
- [ ] Stored production keys separately

### Step 5.2: Start Webhook Forwarding

1. **Start Your Local Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Forward Webhooks (New Terminal)**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   
   You should see:
   ```
   Ready! Your webhook signing secret is whsec_... (use this in your code)
   ```

3. **Keep Both Running**
   - Keep your dev server running in one terminal
   - Keep webhook forwarding running in another terminal

---

## Phase 6: Testing Your Integration

### Step 6.1: Test with Stripe CLI

**Trigger Test Events:**
```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test subscription creation
stripe trigger customer.subscription.created

# Test failed payment
stripe trigger invoice.payment_failed
```

### Step 6.2: Test with Sample Cards

**Test Card Numbers:**
```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
⚠️  Requires Auth: 4000 0025 0000 3155
💳 Insufficient Funds: 4000 0000 0000 9995

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Step 6.3: Test Customer Portal

1. **Create a Test Customer**
   - In Stripe Dashboard → **Customers** → **Add customer**
   - Add test email: `test@example.com`

2. **Create Test Subscription**
   - Click on the customer
   - Click **Add subscription**
   - Select your Basic or Pro product
   - Use test card: `4242 4242 4242 4242`

3. **Test Customer Portal**
   - Go to **Settings** → **Customer portal**
   - Click **Preview** to test the portal experience

---

## Phase 7: Production Setup (When Ready)

### Step 7.1: Activate Live Mode

1. **Complete Account Verification**
   - Stripe will request business verification
   - Provide required documents and information

2. **Switch to Live Mode**
   - Toggle to **Live mode** in dashboard
   - Repeat product creation for live environment

### Step 7.2: Production Environment Variables

```bash
# Production Environment (.env.production)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# Production Price IDs
STRIPE_BASIC_PRICE_ID=price_YOUR_LIVE_BASIC_PRICE_ID
STRIPE_PRO_PRICE_ID=price_YOUR_LIVE_PRO_PRICE_ID
```

### Step 7.3: Production Webhook Endpoint

1. **Create Live Webhook**
   - Go to **Developers** → **Webhooks** (in Live mode)
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select same events as test mode
   - Update `STRIPE_WEBHOOK_SECRET` with live secret

---

## Phase 8: Integration Checklist

### Step 8.1: Development Checklist

**Environment Setup:**
- [ ] Stripe CLI installed and authenticated
- [ ] All environment variables configured
- [ ] Webhook forwarding working
- [ ] Test events triggering successfully

**Stripe Dashboard:**
- [ ] Products created with correct pricing
- [ ] Customer portal configured
- [ ] Webhook endpoints created
- [ ] API keys copied securely

**Code Integration:**
- [ ] Stripe SDK installed (`stripe`, `@stripe/stripe-js`)
- [ ] Environment variables imported correctly
- [ ] Webhook handler implemented
- [ ] Customer portal integration working

### Step 8.2: Testing Checklist

**Subscription Flow:**
- [ ] Can create checkout sessions
- [ ] Can complete test payments
- [ ] Webhooks received and processed
- [ ] Customer portal accessible
- [ ] Subscription management working

**Error Handling:**
- [ ] Failed payments handled gracefully
- [ ] Webhook signature verification working
- [ ] Rate limiting implemented
- [ ] Error messages user-friendly

---

## Troubleshooting

### Common Issues

**"No such price" error:**
- Check that price IDs are correct
- Ensure you're using the right mode (test vs live)

**Webhook signature verification fails:**
- Check webhook secret is correct
- Ensure raw request body is used for verification

**CLI authentication fails:**
- Run `stripe login` again
- Check internet connection
- Verify Stripe account access

**Webhook events not received:**
- Check webhook forwarding is running
- Verify endpoint URL is correct
- Check firewall settings

### Getting Help

**Resources:**
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI Reference](https://stripe.com/docs/cli)
- [Stripe Discord Community](https://discord.gg/stripe)
- [Stripe Support](https://support.stripe.com)

**Debug Commands:**
```bash
# Check CLI status
stripe config --list

# View webhook events
stripe events list

# Test webhook forwarding
stripe listen --print-json
```

---

## Summary

You now have a complete Stripe integration setup with:

✅ **Stripe Account** - Configured with products and pricing  
✅ **Customer Portal** - Self-service billing management  
✅ **Webhook Integration** - Real-time event handling  
✅ **Local Development** - CLI forwarding and testing  
✅ **Environment Variables** - Secure key management  
✅ **Testing Tools** - Sample cards and CLI triggers  

**Next Steps:**
1. Implement subscription logic in your application
2. Add usage tracking and limits
3. Test thoroughly with various scenarios
4. Deploy to staging environment
5. Complete production setup when ready

**Remember:** Always test thoroughly in test mode before going live!

---

*Guide Version: 1.0*  
*Last Updated: 12/28/2024*  
*Compatible with: Stripe API 2023-10-16* 
