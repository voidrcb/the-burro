---
title: "Sprint 1.2 Proposal — Lodging Booking Flow"
project: "Big Bend Burro"
sprint_id: "1.2"
phase_id: "P1"
phase_name: "MVP Launch"
status: "enhanced_for_jekyll_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
hyde_enhanced: "2026-03-16"
---

# Sprint 1.2 Proposal — Lodging Booking Flow

## Proposal intent

Make it possible for a guest to understand the stay offer, see availability and pricing logic, complete a booking, and receive the right confirmations without the owners doing the whole process by hand.

## Proposal basis

- Blueprint P1 build scope includes the lodging booking flow and acceptance requires a guest to book a stay and receive a confirmation email.
- Booking engine requirements in the blueprint include calendar sync, seasonal pricing, promo codes, deposits, waivers, and confirmations.
- White paper Part III says the stay page must clearly explain units, policies, and booking handoff.
- White paper Part II says Burro’s first practical value is guest confirmations, reminders, welcome packets, and post-stay follow-ups.

## What

### In scope

- Build the public stay page and unit catalog.
- Integrate availability and pricing with the chosen lodging platform or fallback model.
- Build the guest checkout funnel for deposits and reservation data capture.
- Send automated confirmations and create the internal events the owners need to operate the booking.
- Launch the first FAQ-grade Burro support surface for stay questions if the team is ready.

### Deliverables

- Stay page with unit cards, policies, and pricing guidance.
- Booking funnel with date selection, guest details, deposit handling, and acknowledgement steps.
- Transactional email flow for booking confirmation.
- Operator booking view or notification trail.
- Seasonal pricing ruleset that can be updated without code deployment.

### Out of scope

- No group itinerary builder yet.
- No public equipment rental checkout.
- No attempt to automate every post-booking edge case in the first pass.

## How

### Implementation approach

1. Map the lodging_unit data model into the public UI, even if some inventory is still soft-launched or hidden.
2. Use the vendor integration first for source-of-truth availability, but preserve a local abstraction layer so pricing rules and policies are not scattered through vendor-specific code.
3. Design the funnel around remote-destination clarity. Guests need to understand access expectations, cancellation policy, weather realities, and what is and is not included.
4. Wire deposit collection and confirmation email through Stripe and the email provider with explicit logging and retry handling.
5. Capture waivers or acknowledgement events as structured data, not only as an email note.
6. If the FAQ Burro module ships in this sprint, limit it to approved stay questions and make it fail closed when a question requires human review.

### Data and system contracts touched

- `lodging_unit`
- `booking event and confirmation payloads`
- `rate ruleset`
- `waiver acknowledgement record`

## Why

- This is the first direct revenue sprint. It turns narrative interest into a transaction.
- It also tests the hardest hospitality truth in the project: clarity beats glamour when the destination is remote and expectations matter.
- Getting this flow stable early is what allows later workshop, itinerary, and follow-up automation to make sense.
- It is the smallest revenue engine with the highest immediate commercial leverage.

## Review

### Questions to resolve before commit

- Do you want full booking inside the site, or a site-to-provider handoff for the earliest release?
- How much of the operator communication flow should be automated on day one versus left manual until the first few stays are observed?
- Should the FAQ Burro release in the same sprint, or wait until the booking flow itself is stable?

### Dependencies

- Sprint 0.3 sandbox integrations
- Public site launch from Sprint 1.1
- Decision on stay inventory and policies

### Definition of done

- A guest can complete a booking and receive a correct confirmation email.
- At least one seasonal pricing rule can be changed by operators without deploying code.
- Operator notifications and booking records are consistent with the source system.
- The site clearly separates public stay inventory from the private home zone.

### What this sprint unlocks next

- Workshops and Equipment Operations Prep
- Shop, Activism, and Assistant Enhancements

---

## HYDE Enhancement — PHASE 1

**Enhanced:** 2026-03-16
**Status:** ENHANCED_FOR_JEKYLL_REVIEW

### Implementation Decisions (PRD-Style)

| ID | Decision | Rationale |
|----|----------|-----------|
| PRD-1.2.1 | Site-to-Lodgify handoff for MVP | Full in-site checkout requires deposit handling, payment processing, and availability sync; safer to use Lodgify's booking widget for first release, then migrate to full integration in P2 |
| PRD-1.2.2 | Local rate ruleset in `website/cms/rates/` | Operator-editable JSON for seasonal pricing; loader validates and surfaces in stay page without code deploy |
| PRD-1.2.3 | Waiver acknowledgement before booking redirect | Structured record in local store; confirmation includes waiver timestamp |
| PRD-1.2.4 | Confirmation email via Postmark (scaffold-mode if no credentials) | Uses Sprint 0.3 Postmark webhook scaffold; local capture if provider not activated |
| PRD-1.2.5 | Operator notification via internal dashboard and email | Booking events surface in `/assistant` and trigger Postmark notification to owners |

### Workstream Breakdown

#### Workstream 1.2.1 — Stay Page and Unit Catalog

| Deliverable | File/Path | Acceptance Criteria |
|-------------|-----------|---------------------|
| Stay landing page | `website/frontend/app/stay/page.tsx` | Renders unit cards, policies, and pricing guidance |
| Unit card component | `website/frontend/components/stay/UnitCard.tsx` | Displays unit photo, name, capacity, and seasonal price range |
| Unit detail page | `website/frontend/app/stay/[slug]/page.tsx` | Full unit description, amenities, policies, booking CTA |
| Policy display component | `website/frontend/components/stay/PolicyDisplay.tsx` | Cancellation, check-in/out, access expectations |
| Unit data loader | `website/frontend/lib/content/units.ts` | Loads from `website/cms/units/*.json` |
| Unit data files | `website/cms/units/*.json` | At least 2 unit definitions with LodgingUnit schema |

#### Workstream 1.2.2 — Rate Ruleset and Pricing

| Deliverable | File/Path | Acceptance Criteria |
|-------------|-----------|---------------------|
| Rate ruleset schema | `website/cms/rates/schema.json` | JSON schema for seasonal rules |
| Seasonal rate data | `website/cms/rates/seasonal.json` | At least 2 seasons defined (peak, off-peak) |
| Rate loader | `website/frontend/lib/content/rates.ts` | Validates and returns applicable rate for date range |
| Price display component | `website/frontend/components/stay/PriceDisplay.tsx` | Shows nightly rate, seasonal indicator, total estimate |

#### Workstream 1.2.3 — Booking Funnel

| Deliverable | File/Path | Acceptance Criteria |
|-------------|-----------|---------------------|
| Booking flow page | `website/frontend/app/stay/[slug]/book/page.tsx` | Date selection, guest details form, waiver acknowledgement |
| Date picker component | `website/frontend/components/stay/DatePicker.tsx` | Check-in/out selection with blackout dates |
| Guest details form | `website/frontend/components/stay/GuestForm.tsx` | Name, email, phone, party size, special requests |
| Waiver acknowledgement | `website/frontend/components/stay/WaiverAck.tsx` | Checkbox with policy summary; records timestamp |
| Waiver record API | `website/frontend/app/api/booking/waiver/route.ts` | Stores waiver acknowledgement locally |
| Lodgify redirect | `website/frontend/lib/booking/lodgify-redirect.ts` | Constructs Lodgify booking widget URL with prefilled data |

#### Workstream 1.2.4 — Confirmation and Notification

| Deliverable | File/Path | Acceptance Criteria |
|-------------|-----------|---------------------|
| Booking webhook handler | `website/frontend/app/api/webhooks/lodgify/booking/route.ts` | Receives Lodgify booking confirmation webhook |
| Confirmation email trigger | `website/frontend/lib/email/booking-confirmation.ts` | Sends confirmation via Postmark (or local capture) |
| Email template | `website/cms/emails/booking-confirmation.mjml` | MJML template for booking confirmation |
| Operator notification | `website/frontend/lib/notifications/operator-booking.ts` | Sends owner notification; logs to assistant dashboard |
| Booking log | `data/bookings/*.json` | Local booking record with Lodgify ID, guest info, waiver |

#### Workstream 1.2.5 — Operator View

| Deliverable | File/Path | Acceptance Criteria |
|-------------|-----------|---------------------|
| Booking list component | `website/frontend/components/assistant/BookingList.tsx` | Shows recent bookings in `/assistant` |
| Booking detail view | `website/frontend/components/assistant/BookingDetail.tsx` | Full booking info, waiver status, Lodgify link |

### Data Contracts

#### LodgingUnit (MIRRORS)

```typescript
interface LodgingUnit {
  id: string;
  slug: string;
  name: string;
  description: string;
  capacity: { adults: number; children: number };
  amenities: string[];
  photos: { url: string; alt: string }[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    pets: string;
    smoking: string;
  };
  lodgifyPropertyId?: string;
  status: 'available' | 'coming_soon' | 'private';
}
```

#### SeasonalRate (VIEW MODEL)

```typescript
interface SeasonalRate {
  seasonId: string;
  name: string;
  startDate: string; // MM-DD
  endDate: string;   // MM-DD
  rates: {
    unitId: string;
    nightly: number;
    weeklyDiscount?: number;
    cleaningFee: number;
  }[];
  blackoutDates?: string[]; // YYYY-MM-DD
}
```

#### WaiverAcknowledgement (MIRRORS)

```typescript
interface WaiverAcknowledgement {
  id: string;
  guestEmail: string;
  guestName: string;
  unitId: string;
  checkIn: string;
  checkOut: string;
  acknowledgedAt: string; // ISO timestamp
  policyVersion: string;
  ipAddress?: string;
}
```

#### BookingRecord (MIRRORS)

```typescript
interface BookingRecord {
  id: string;
  lodgifyBookingId?: string;
  unitId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  partySize: { adults: number; children: number };
  totalAmount?: number;
  depositAmount?: number;
  waiverId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
  operatorNotifiedAt?: string;
  guestNotifiedAt?: string;
}
```

### Risk Analysis

| Risk | Severity | Mitigation |
|------|----------|------------|
| Lodgify credentials not yet provisioned | HIGH | Implement scaffold-mode with mock availability; Lodgify redirect uses test URL pattern |
| Postmark credentials not yet provisioned | MEDIUM | Local email capture as in Sprint 1.1; operator notification falls back to dashboard-only |
| Availability sync complexity | MEDIUM | MVP uses Lodgify as availability source-of-truth via widget; no custom sync needed |
| Waiver legal review incomplete | LOW | Generic policy acknowledgement with version tracking; legal text can be updated |
| Rate ruleset validation errors | LOW | Schema validation in loader; fallback to default rate if parse fails |

### Dependencies

| Dependency | Source | Status |
|------------|--------|--------|
| Public website and navigation | Sprint 1.1 | COMPLETE |
| Lodgify webhook scaffold | Sprint 0.3 | COMPLETE (scaffold-mode) |
| Postmark webhook scaffold | Sprint 0.3 | COMPLETE (scaffold-mode) |
| Stripe webhook scaffold | Sprint 0.3 | COMPLETE (scaffold-mode, not used in MVP) |
| Content system (`website/cms/`) | Sprint 1.1 | COMPLETE |
| Design tokens and components | Sprint 0.2 | COMPLETE |

### Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1.2.1 | Guest can view stay page with at least 2 units | `pnpm build` includes `/stay` route; manual verification |
| AC-1.2.2 | Guest can view unit detail page with policies and pricing | `/stay/[slug]` renders with rate display |
| AC-1.2.3 | Seasonal pricing displays correct rate for selected dates | Rate loader returns peak/off-peak based on date |
| AC-1.2.4 | Guest can acknowledge waiver before booking | Waiver record created with timestamp |
| AC-1.2.5 | Guest redirected to Lodgify booking widget with prefilled data | Redirect URL includes unit ID, dates, guest email |
| AC-1.2.6 | Booking webhook stores confirmation locally | Webhook handler creates BookingRecord |
| AC-1.2.7 | Confirmation email sent (or captured locally) | Postmark trigger fires; local capture if scaffold-mode |
| AC-1.2.8 | Operator sees booking in assistant dashboard | BookingList component shows new bookings |
| AC-1.2.9 | Rate ruleset can be edited without code deploy | Modify `seasonal.json`; rebuild shows new rates |

### FAQ Burro Decision

**Decision:** Defer FAQ Burro to Sprint 1.4 or later.

**Rationale:** The booking flow is the first revenue system and should stabilize before adding conversational support. FAQ Burro for stay questions can ship after the booking funnel proves reliable.

### Out of Scope Clarifications

- **Full in-site checkout**: MVP uses Lodgify widget; Stripe deposit handling is P2
- **Automated post-booking sequences**: Welcome packets and reminders are Sprint 1.4+
- **Multi-unit itineraries**: Group booking is Sprint 2.1
- **Equipment bundle checkout**: Sprint 2.2

### Quality Gates

| Gate | Target |
|------|--------|
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS with stay routes |
| Unit data validation | All units pass LodgingUnit schema |
| Rate data validation | All rates pass SeasonalRate schema |
| Waiver API | Returns 200 with valid payload |
| Webhook handler | Returns 200 for valid Lodgify payload |

---

## HYDE PHASE 3 — Approval with Amendments

**Approved:** 2026-03-16
**Findings Reviewed:** `Sprints/Reviews/SPRINT_1_2_JEKYLL_FINDINGS.md`
**Status:** APPROVED with 7 amendments

### Findings Disposition

| Finding | Severity | Disposition |
|---------|----------|-------------|
| JF-501 | HIGH | ACCEPT - Language aligned to handoff MVP |
| JF-502 | HIGH | ACCEPT - Operator dashboard scope tightened |
| JF-503 | MEDIUM | ACCEPT - Three-stage booking lifecycle defined |
| JF-504 | MEDIUM | ACCEPT - Rate rules constrained to deterministic resolution |
| JF-505 | MEDIUM | ACCEPT - Confirmation language aligned to scaffold-mode |
| JF-506 | LOW | ACCEPT - Unit visibility rules made explicit |
| JF-507 | INFO | ACKNOWLEDGED - Sprint kept as handoff architecture |

### Amendments

#### A-501: Align Sprint Intent to Handoff MVP

**Addresses:** JF-501

**Original:** "Make it possible for a guest to understand the stay offer, see availability and pricing logic, complete a booking, and receive the right confirmations..."

**Amended:** Sprint 1.2 delivers a booking handoff flow where guests can understand the stay offer, see pricing guidance, acknowledge the waiver, and be redirected to Lodgify to complete their booking. Confirmation is received back via webhook and captured locally (or emailed in scaffold-mode).

**Impact:** Definition of done updated. "Complete a booking" means guest is successfully redirected with intent captured; "receive confirmation" means webhook-triggered local record or scaffold-mode email capture.

#### A-502: Constrain Operator Dashboard Scope

**Addresses:** JF-502

**Original:** Workstream 1.2.5 promised BookingList and BookingDetail components in `/assistant`.

**Amended:** Sprint 1.2 adds a minimal booking panel to the existing assistant shell, not a full operator dashboard. The panel reads from local `data/bookings/*.json` files and displays recent records. Notification triggers are scaffold-mode (local log or Postmark capture).

**New Deliverable:** `website/frontend/components/assistant/BookingPanel.tsx` (replaces BookingList + BookingDetail)

**Acceptance Criteria AC-1.2.8 Updated:** "Operator sees recent bookings in assistant shell" (reads from local booking records)

#### A-503: Define Three-Stage Booking Lifecycle

**Addresses:** JF-503

**Lifecycle Stages:**

1. **Waiver Acknowledgement** — Guest completes form and accepts policies
   - Creates `WaiverAcknowledgement` record
   - `BookingRecord` NOT created yet

2. **Booking Redirect Intent** — Guest clicks "Book Now" and is redirected to Lodgify
   - Creates `BookingRecord` with `status: 'pending'`
   - Links to `waiverId`
   - `lodgifyBookingId` is null at this stage

3. **Provider-Confirmed Booking** — Lodgify webhook received
   - Updates `BookingRecord` with `status: 'confirmed'` and `lodgifyBookingId`
   - Triggers confirmation email (or local capture)
   - Triggers operator notification

**Impact:** BookingRecord `status` semantics clarified. `pending` means redirect intent, not partial payment.

#### A-504: Constrain Rate Rule Resolution

**Addresses:** JF-504

**Constraints:**
- Seasons MUST NOT overlap. Loader rejects config with overlapping date ranges.
- Year-wrap handled by treating MM-DD ranges as recurring annually.
- Blackout dates are display hints that block the "Book Now" button; no complex conflict resolution.
- If no season matches a date, use a declared `defaultRate` or fail visibly.

**Impact:** Rate loader is deterministic. Edge cases do not expand into pricing engine.

#### A-505: Align Confirmation Language to Scaffold-Mode

**Addresses:** JF-505

**Updated Acceptance Criteria:**

| ID | Original | Amended |
|----|----------|---------|
| AC-1.2.7 | "Confirmation email sent (or captured locally)" | "Confirmation email rendered and sent via Postmark, OR captured locally in scaffold-mode with rendered payload stored in `data/email-captures/`" |

**Definition of Done Updated:** Verification accepts local email capture as proof when Postmark credentials are not configured.

#### A-506: Make Unit Visibility Rules Explicit

**Addresses:** JF-506

**Unit Status Rendering Rules:**
- `available`: Shown on stay page with active "Book Now" button
- `coming_soon`: Shown on stay page with "Coming Soon" badge; no booking redirect
- `private`: NOT shown on public stay page; only visible in operator assistant shell

**Unit Requirement Updated:** Sprint 1.2 requires at least 1 `available` unit and may include 1 `coming_soon` or `private` unit for testing visibility logic.

#### A-507: Confirm Handoff Architecture

**Addresses:** JF-507

**Confirmed Scope:**
- Public stay catalog with unit pages
- Local seasonal rate ruleset
- Structured waiver capture
- Lodgify redirect with intent tracking
- Webhook-backed confirmation flow
- Scaffold-mode operator notifications
- Minimal booking panel in assistant shell

**Out of Scope (Confirmed):**
- Full in-site checkout with Stripe
- FAQ Burro (deferred to 1.4+)
- Automated post-booking sequences
- Multi-unit group bookings

### Amended Deliverable Count

| Workstream | Original Deliverables | Amended |
|------------|----------------------|---------|
| 1.2.1 Stay Page | 6 | 6 (unchanged) |
| 1.2.2 Rate Ruleset | 4 | 4 (constraints added) |
| 1.2.3 Booking Funnel | 6 | 6 (lifecycle clarified) |
| 1.2.4 Confirmation | 5 | 5 (scaffold-mode explicit) |
| 1.2.5 Operator View | 2 | 1 (BookingPanel only) |
| **Total** | **23** | **22** |

### Approval Statement

Sprint 1.2 is **APPROVED** for JEKYLL implementation with the 7 amendments above. The sprint delivers a booking handoff flow, not full in-site checkout. All verification must accept scaffold-mode proof where external credentials are not provisioned.
