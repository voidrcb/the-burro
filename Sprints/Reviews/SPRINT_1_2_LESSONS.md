# Sprint 1.2 Lessons Learned

**Sprint:** 1.2 — Lodging Booking Flow
**Synthesized:** 2026-03-16
**Author:** HYDE
**Milestone:** P1 MVP LAUNCH — Stay Catalog and Booking Handoff Live

---

## Summary

Sprint 1.2 successfully delivered the lodging booking handoff flow: public stay pages, seasonal rate rules, three-stage booking lifecycle (waiver, redirect, confirmation), webhook-backed confirmation capture, and operator visibility through a minimal booking panel. This sprint established the booking architecture for MVP without requiring full in-site checkout.

**Duration:** Same-day review and implementation cycle
**Findings reviewed:** 7 (0 CRITICAL, 2 HIGH, 3 MEDIUM, 1 LOW, 1 INFO)
**All findings:** ACCEPTED with amendments
**Phase Status:** P1 MVP LAUNCH — Sprint 2 of 4 complete

---

## What Worked Well

### 1. Amendment-Based Scope Alignment
The 7 amendments from HYDE's PHASE 3 review addressed proposal language drift before implementation. JF-501 (handoff vs full checkout language) caught MVP scope creep before it became implementation confusion.

### 2. Three-Stage Booking Lifecycle
The JF-503 amendment (defining waiver acknowledgement → redirect intent → provider confirmation as distinct stages) created a clean data model. JEKYLL implemented separate stores for waivers, intents, and confirmed bookings without conflation.

### 3. Deterministic Rate Resolution
The JF-504 amendment (constraining rate rules to deterministic resolution with no overlapping seasons) kept the pricing system simple. Sprint 1.2 shipped working rate logic without becoming a pricing engine.

### 4. Scaffold-Mode Confirmation Pattern
The JF-505 amendment (scaffold-mode as valid verification) proved the booking confirmation flow exists without requiring live Lodgify/Postmark credentials. Email payloads are captured locally, matching the Sprint 0.3 and 1.1 patterns.

### 5. Minimal Operator Dashboard
The JF-502 amendment (tightening scope to BookingPanel vs full operator dashboard) kept the assistant shell cohesive. Operators see local booking records alongside the existing feasibility shell.

### 6. Unit Visibility Rules
The JF-506 amendment (explicit public/private/coming_soon rendering rules) ensured the stay catalog only exposes bookable inventory. Private units are hidden; coming_soon units are visible but not bookable.

---

## What Caused Friction

### 1. apply_patch Failure in Windows Sandbox
JEKYLL reported `apply_patch` failed again in the Windows sandbox. File edits required PowerShell writes instead.

**Lesson:** Windows sandbox tooling for file patches remains unreliable. JEKYLL should expect PowerShell fallback and not block on patch tooling.

### 2. pnpm typecheck Wrapper Timeout
The `pnpm typecheck` script timed out in sandbox, but direct `tsc --noEmit` invocation passed.

**Lesson:** Direct tool invocation can bypass wrapper issues. Quality gates should allow direct CLI fallback when scripts hang.

### 3. Pre-Existing Unit Files
JEKYLL found existing unit files in `website/cms/units/` beyond the seed files. Implementation preserved and validated them rather than treating Sprint 1.2 as greenfield.

**Lesson:** CMS content accumulates across sprints. Loaders should validate all content files, not assume only sprint-specific files exist.

### 4. Proposal Language Drift (Addressed)
The original proposal mixed full-booking language with approved MVP handoff model. JF-501 caught this before implementation.

**Lesson:** HYDE enhancement phase should rewrite proposal language to match decisions, not just add decisions that contradict earlier sections.

---

## Patterns to Carry Forward

| Pattern | Description | Apply In |
|---------|-------------|----------|
| Site-to-provider handoff | MVP captures intent, provider handles payment | All MVP booking flows |
| Three-stage booking lifecycle | Waiver → redirect intent → provider confirmation | All booking features |
| Deterministic rate rules | No overlapping seasons, simple resolution | All pricing logic |
| Scaffold-mode proof | Local capture validates flow without credentials | All external integrations |
| Unit visibility governance | Status field controls public exposure | All catalog features |
| CMS schema validation | Loaders filter to valid content | All content loading |

---

## Patterns to Avoid

| Anti-Pattern | Problem | Alternative |
|--------------|---------|-------------|
| Full checkout language in MVP | Overstates repo capability | Use "handoff" language consistently |
| Single booking record for all stages | Conflates intent with confirmation | Separate stores per lifecycle stage |
| Complex rate overlap resolution | Scope sprawl risk | Constrain to deterministic rules |
| Assuming clean CMS state | Content accumulates across sprints | Validate all files, not just new ones |
| Wrapper scripts without timeout | Can hang in sandbox | Allow direct CLI fallback |

---

## Carryover Items

| Item | Status | Target Sprint |
|------|--------|---------------|
| Live Lodgify checkout verification | DEFERRED | When credentials provisioned |
| Live Postmark delivery verification | DEFERRED | When credentials provisioned |
| Full in-site checkout | OUT OF SCOPE | P2 |
| Stripe deposit handling | OUT OF SCOPE | P2 |
| FAQ Burro conversational layer | DEFERRED | Sprint 1.4+ |

---

## Decisions Recorded

| Decision | Rationale | Impact |
|----------|-----------|--------|
| D-1.2.1: Site-to-Lodgify handoff for MVP | Safer scope; Lodgify handles payment and sync | No deposit handling until P2 |
| D-1.2.2: Three-stage booking lifecycle | Clean data model; prevents state conflation | All future booking work preserves stages |
| D-1.2.3: Rate rules in `cms/rates/` | Operator-editable without deploy | Rate changes don't require code |
| D-1.2.4: Scaffold-mode confirmation proof | Validates flow without live providers | Local capture is valid evidence |
| D-1.2.5: BookingPanel vs full dashboard | Keeps assistant shell minimal | Future dashboard work is additive |
| D-1.2.6: Unit visibility by status field | Explicit control over public exposure | Private inventory stays hidden |

---

## Sprint 1.2 Artifacts Index

| Artifact | Location | Purpose |
|----------|----------|---------|
| Proposal | `Sprints/Proposals/05_sprint_1_2_lodging_booking_flow.md` | Sprint definition |
| Jekyll findings | `Sprints/Reviews/SPRINT_1_2_JEKYLL_FINDINGS.md` | Review feedback |
| Jekyll recap | `Sprints/Reviews/SPRINT_1_2_RECAP.md` | Implementation summary |
| Validation summary | `Sprints/Reviews/evidence/sprint-1-2/validation_summary.md` | Build evidence |
| Lessons (this file) | `Sprints/Reviews/SPRINT_1_2_LESSONS.md` | Synthesis |
| Stay catalog | `website/frontend/app/stay/page.tsx` | Public stay listing |
| Unit detail | `website/frontend/app/stay/[slug]/page.tsx` | Unit pages |
| Booking handoff | `website/frontend/app/stay/[slug]/book/page.tsx` | Booking flow |
| Quote API | `website/frontend/app/api/booking/quote/route.ts` | Price calculation |
| Waiver API | `website/frontend/app/api/booking/waiver/route.ts` | Waiver capture |
| Intent API | `website/frontend/app/api/booking/intent/route.ts` | Redirect tracking |
| Webhook | `website/frontend/app/api/webhooks/lodgify/booking/route.ts` | Confirmation capture |
| Booking panel | `website/frontend/components/assistant/BookingPanel.tsx` | Operator visibility |
| Rate rules | `website/cms/rates/seasonal.json` | Seasonal pricing |
| Unit content | `website/cms/units/*.json` | Stay inventory |
| Email template | `website/cms/emails/booking-confirmation.mjml` | Confirmation email |

---

## Quality Gate Status After Sprint 1.2

| Gate | Status | Notes |
|------|--------|-------|
| `pnpm lint` | PASS | Clean lint |
| `pnpm typecheck` | PASS | Direct tsc passed |
| `pnpm build` | PASS | All routes built |
| `pnpm test` | N/A | No test suite for booking |
| Accessibility | NOT RUN | Deferred |
| Responsive | NOT RUN | Deferred |

---

## Transition to Sprint 1.3

Sprint 1.2 established the booking handoff flow. The next sprint builds workshops and prepares equipment operations:

| Sprint | Focus | Foundation Used |
|--------|-------|-----------------|
| 1.3 Workshops & Equipment Prep | Workshop catalog, registration, internal rental scheduler | Public site, CMS patterns, waiver capture |

**Key dependencies for 1.3:**
- Stay catalog and booking patterns proven
- Waiver capture pattern reusable for workshop registration
- Content root established at `website/cms/`
- Three-stage lifecycle pattern available for workshop registration

**Operator Readiness:**
- P1 Sprint 1.2: R1_ASSISTED (operators can view bookings, edit rate rules)

---

## P1 MVP Launch Progress

| Sprint | Status | Key Outputs |
|--------|--------|-------------|
| 1.1 Public Website | CLOSED | Trust layer, blog, activism hub, capture seams |
| 1.2 Lodging Booking | CLOSED | Stay catalog, booking handoff, rate rules, confirmation |
| 1.3 Workshops | PENDING | Workshop catalog, registration, equipment prep |
| 1.4 Shop/Activism | PENDING | Store, activism enhancements |

**Sprint 1.2: CLOSED**
