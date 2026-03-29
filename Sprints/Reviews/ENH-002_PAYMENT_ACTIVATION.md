# ENH-002: Payment Integration Activation Guide

**Status:** Prepared (scaffold-mode active)
**Prepared Date:** 2026-03-28
**Activation:** Post-deployment, when operators are ready

---

## Current State

The shop checkout flow captures orders locally without live payment processing:

- Guest submits order with contact info and shipping details
- Order is captured to `data/shop-orders.json`
- Operators receive order and contact guest to arrange payment
- This "human handoff" model is intentional for the launch phase

---

## Prerequisites for Activation

Before activating live payment processing:

1. **Production Deployment**
   - Site deployed to bigbendburro.com
   - HTTPS/TLS properly configured

2. **Stripe Account Setup**
   - Stripe account created and verified
   - Business information completed
   - Bank account linked for payouts

3. **Environment Variables**
   - `STRIPE_SECRET_KEY` - Stripe secret API key
   - `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET` - Webhook signing secret

4. **Operator Training**
   - Stripe Dashboard orientation
   - Refund processing workflow
   - Dispute handling procedures

---

## Activation Steps

### Step 1: Install Stripe Package

```bash
cd website/frontend
pnpm add stripe @stripe/stripe-js
```

### Step 2: Create Stripe Checkout Session API

Create `app/api/shop/checkout-session/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const { items, customerEmail } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout`,
  });

  return NextResponse.json({ sessionId: session.id, url: session.url });
}
```

### Step 3: Update CheckoutClient

Modify the checkout flow to redirect to Stripe:

```typescript
// In CheckoutClient.tsx submitOrder function
const result = await fetch('/api/shop/checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: items.map(item => ({
      title: item.title,
      price: item.priceAtOrder,
      quantity: item.quantity,
    })),
    customerEmail: guestEmail,
  }),
});

const { url } = await result.json();
window.location.href = url;
```

### Step 4: Configure Webhook

Update `app/api/webhooks/stripe/route.ts` to process real events:

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      // Mark order as paid, trigger fulfillment
      break;
    case 'payment_intent.payment_failed':
      // Notify operators
      break;
  }

  return NextResponse.json({ received: true });
}
```

### Step 5: Configure Stripe Dashboard

1. Add webhook endpoint: `https://bigbendburro.com/api/webhooks/stripe`
2. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
3. Copy webhook signing secret to environment

---

## Testing Checklist

- [ ] Test with Stripe test mode keys first
- [ ] Verify checkout flow with test cards
- [ ] Confirm webhook receives events
- [ ] Test successful payment completion
- [ ] Test payment failure handling
- [ ] Test refund from dashboard
- [ ] Switch to live mode keys
- [ ] Process one live test transaction

---

## Rollback Plan

If issues occur after activation:

1. Revert `CheckoutClient.tsx` to scaffold mode
2. Remove Stripe API keys from environment
3. Orders fall back to manual capture

---

## Notes

- Scaffold mode remains valid for artisan/custom orders
- Consider keeping manual option for high-value items
- Workshop and lodging bookings have separate payment flows

---

*ENH-002 Prepared - 2026-03-28*
