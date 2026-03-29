# Big Bend Burro - Unified Booking Framework

**Version:** 1.1.0
**Last Updated:** 2026-03-28
**Purpose:** Standardize the guest journey across public booking, inquiry, quote, and order flows.

---

## Booking Types

| Type | Primary Route | Payment Mode | Record Path | Follow-up |
|------|---------------|--------------|-------------|-----------|
| Lodging | `/stay/[slug]/book` | Lodgify handoff | `data/bookings/` | Pre-arrival email |
| Workshop | `/workshops/[slug]/register` | Manual now, Stripe-ready | `data/workshop-registrations/` | Confirmation + preparation notes |
| Experience | `/experiences/[slug]` | Manual inquiry | CRM + guest events | Operator follow-up |
| Rental | `/rentals/request` | Manual quote and approval | `data/rental-quotes/`, `data/rental-bookings/` | Deposit + contract |
| Shop | `/shop/checkout` | Manual follow-up | `data/shop-orders/` | Order confirmation |
| Planning / Packages | `/plan` | Custom quote | CRM + itinerary drafts | Operator follow-up |

---

## Guest Journey Stages

### 1. Discovery
- Guest lands on a public page.
- Pricing, status, and logistics are visible before they commit.
- CTAs route the guest into the correct lane instead of a generic contact loop.

### 2. Intent
- Guest clicks `Book`, `Register`, `Request Quote`, or `Checkout`.
- The form captures identity, timing, and the minimum operational details for the lane.
- Waiver and policy acknowledgements are collected where required.

### 3. Confirmation
- The system stores the request locally.
- The guest sees a clear confirmation state immediately.
- The operators get enough information to continue the handoff without re-asking the basics.

### 4. Pre-Arrival / Pre-Fulfillment
- Lodging and workshops send reminder logistics.
- Rentals confirm delivery, insurance, and inspection expectations.
- Shop orders confirm availability before payment is arranged.

### 5. Delivery / Experience
- The guest receives the service, stay, workshop, or product.
- Operator notes and guest-event history can be attached if follow-up is needed.

### 6. Post-Experience
- Thank-you, review, and related-offer follow-up happens after fulfillment.
- Cross-sell opportunities should only be triggered from actual completed experiences.

---

## Minimum Form Fields

### Shared Baseline
- `guestName`
- `guestEmail` (normalized lowercase)
- `guestPhone` when the lane needs live coordination
- `specialRequests` when relevant
- `waiverAccepted` where required

### Lodging
- `checkInDate`
- `checkOutDate`
- `adults`
- `children`
- `arrivalTime`

### Workshop
- `sessionId`
- `partySize`
- `experienceLevel`
- `intakeResponses`

### Rental
- `assetId`
- `requestedStartDate`
- `requestedEndDate`
- `deliveryRequired`
- `deliveryAddress` when delivery is requested
- `intendedUse`
- `previousRentalExperience`
- `insuranceConfirmed`
- `policyAcknowledged`

### Shop
- cart line items
- fulfillment contact info
- shipping address when parcel shipping applies
- notes for local pickup or fulfillment edge cases

### Planning / Package Inquiry
- trip window
- party size
- priority goals
- preferred mix of stay / workshop / experience components

---

## Reminder Schedule

| Timing | Lane | Message |
|--------|------|---------|
| Immediate | All | Confirmation state and next steps |
| 7 days before | Lodging, workshop | Logistics and preparation reminder |
| 1 day before | Lodging, workshop | Final reminder and weather check |
| Same day | Experience | Meeting-point reminder |
| After delivery | Shop | Fulfillment and tracking follow-up |
| After completion | All | Thank-you and review request |

---

## Bundle Rules

### Stay + Workshop
- Lodging is booked first.
- Workshop is attached manually or through operator follow-up.
- Discount logic belongs in `website/cms/pricing/package-rules.json`.

### Stay + Experience
- Use the planning lane or manual operator follow-up.
- No fixed public package price should be quoted unless it exists in CMS.

### Workshop + Shop
- Related product follow-up can be offered after a completed workshop.
- Do not promise made-to-order ceramic fulfillment windows outside the product CMS.

---

## System References

- CRM history and guest event lookups: `website/frontend/lib/crm/history.ts`
- CRM persistence: `website/frontend/lib/crm/store.ts`
- Rental lifecycle and quotes: `website/frontend/lib/rental/store.ts`
- Shop orders: `website/frontend/app/api/shop/orders/route.ts`

---

## Cancellation Guidance

| Lane | Policy Summary |
|------|----------------|
| Lodging | Full refund with 14 days notice; manual review for weather exceptions |
| Workshop | Deposit refundable up to 7 days before when a deposit exists |
| Rental | Full refund before delivery; after delivery handled manually |
| Shop | Full refund before shipping or pickup fulfillment |
| Packages | Manual operator review |

*Unified Booking Framework v1.1.0 - post-mortem aligned after Sprints 15 and 16*
