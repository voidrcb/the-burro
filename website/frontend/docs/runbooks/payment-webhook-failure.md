---
id: runbook_payment_webhook
slug: payment-webhook-failure
name: Payment Webhook Failure
systemArea: payment
incidentType: payment_webhook_failure
severity: high
detectionMethod: Stripe webhook delivery failure alert or customer reports of unconfirmed payment
alertSource: stripe_dashboard
drillSchedule: quarterly
---

# Payment Webhook Failure Runbook

## Symptoms

- Customer payment charged but booking not confirmed
- Stripe dashboard shows webhook delivery failures
- Missing confirmation emails for completed payments
- Customer service reports of "payment went through but no confirmation"

## Required Access

- Stripe Dashboard (webhook logs)
- Vercel/Deployment logs
- Application database (data/ directory)
- Postmark Dashboard (email logs)

## Response Steps

### Step 1: Confirm the Incident
**Time Estimate:** 5 minutes
**Requires Approval:** No

1. Check Stripe Dashboard > Developers > Webhooks
2. Look for failed delivery attempts (4xx or 5xx errors)
3. Note the time range of failures
4. Record affected event IDs

**Expected Outcome:** Clear understanding of failure scope and timing

---

### Step 2: Check Application Logs
**Time Estimate:** 10 minutes
**Requires Approval:** No

1. Access Vercel deployment logs
2. Filter for webhook endpoint errors
3. Identify error patterns (timeout, parsing, auth, etc.)
4. Check for recent deployments that may have caused regression

**Expected Outcome:** Root cause identified

---

### Step 3: Assess Impact
**Time Estimate:** 15 minutes
**Requires Approval:** No

1. Count affected transactions in Stripe
2. Cross-reference with successful bookings in data/
3. Calculate financial impact
4. Identify affected customers by email

**Expected Outcome:** Impact assessment documented

---

### Step 4: Resolve Root Cause
**Time Estimate:** Variable
**Requires Approval:** Yes (Developer)

Depending on root cause:

**If deployment issue:**
```bash
# Rollback to last working deployment
vercel rollback
```

**If webhook secret mismatch:**
1. Regenerate webhook signing secret in Stripe
2. Update STRIPE_WEBHOOK_SECRET in Vercel environment

**If endpoint timeout:**
1. Identify slow operations
2. Move processing to background queue

**Expected Outcome:** Webhook endpoint accepting events again

---

### Step 5: Replay Failed Events
**Time Estimate:** 30 minutes
**Requires Approval:** Yes (Operator)

1. In Stripe Dashboard > Webhooks > Failed events
2. For each failed event:
   - Click "Resend"
   - Verify 200 response
   - Confirm booking/payment processed

**Expected Outcome:** All missed events processed

---

### Step 6: Customer Communication
**Time Estimate:** 20 minutes
**Requires Approval:** No

For each affected customer:
1. Verify their booking is now confirmed
2. Send manual confirmation email if needed
3. Note any that require refunds or adjustments

**Expected Outcome:** All affected customers informed

---

### Step 7: Post-Incident

1. Update this runbook with lessons learned
2. Create incident record with timeline
3. Schedule post-mortem if severity warrants
4. Consider monitoring improvements

## Rollback Procedure

If fix introduces new issues:
1. Revert deployment: `vercel rollback`
2. Restore webhook secret if changed
3. Resume manual event replay after stabilization

## Escalation Path

1. **First Response:** On-call operator
2. **If deployment needed:** Developer
3. **If financial impact > $500:** Business owner

## Communication Templates

### Customer Notification
```
Subject: Your Booking Confirmation - [Property/Experience Name]

Hi [Name],

We apologize for the delay in your confirmation. Due to a brief technical issue, your confirmation email was delayed, but rest assured your booking is confirmed.

[Booking Details]

Thank you for your patience, and we look forward to hosting you.
```

### Status Page Update (if applicable)
```
Payment processing experienced intermittent delays. All transactions are being processed and customers will receive confirmations shortly.
```

---

## Drill History

| Date | Conductor | Outcome | Findings | Status |
|------|-----------|---------|----------|--------|
| - | - | - | - | - |

## Incident History

| Date | Duration | Root Cause | Affected | Resolution |
|------|----------|------------|----------|------------|
| - | - | - | - | - |

---

*Runbook Version: 1.0*
*Last Updated: 2026-03-19*
*Responsible Role: Operator*
