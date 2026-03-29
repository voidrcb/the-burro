# Sprint 1.2 Recap — Lodging Booking Flow

**Completed:** 2026-03-16
**Duration:** Same-day review and implementation cycle after Hyde approval

## Deliverables

### Workstream 1.2.1 — Stay Page and Unit Catalog
- [x] Public stay landing page at `website/frontend/app/stay/page.tsx`
- [x] Unit detail route at `website/frontend/app/stay/[slug]/page.tsx`
- [x] Stay UI components for cards, policy display, and pricing
- [x] Unit loader backed by `website/cms/units/*.json`
- [x] Public/private/coming-soon visibility logic enforced in loaders and routes

### Workstream 1.2.2 — Rate Ruleset and Pricing
- [x] Seasonal rate schema at `website/cms/rates/schema.json`
- [x] Seasonal rate seed data at `website/cms/rates/seasonal.json`
- [x] Deterministic rate loader with overlap validation and blackout hints
- [x] Quote API at `website/frontend/app/api/booking/quote/route.ts`

### Workstream 1.2.3 — Booking Funnel
- [x] Booking handoff route at `website/frontend/app/stay/[slug]/book/page.tsx`
- [x] Date picker, guest form, waiver acknowledgement, and booking handoff form components
- [x] Waiver API at `website/frontend/app/api/booking/waiver/route.ts`
- [x] Redirect-intent API at `website/frontend/app/api/booking/intent/route.ts`
- [x] Lodgify redirect helper at `website/frontend/lib/booking/lodgify-redirect.ts`

### Workstream 1.2.4 — Confirmation and Notification
- [x] Lodgify booking webhook route at `website/frontend/app/api/webhooks/lodgify/booking/route.ts`
- [x] Local booking store and waiver store under `data/bookings/`
- [x] Scaffold-mode confirmation capture under `data/email-captures/`
- [x] Confirmation email helper and operator notification logger
- [x] Booking confirmation template at `website/cms/emails/booking-confirmation.mjml`

### Workstream 1.2.5 — Operator View
- [x] Minimal booking panel at `website/frontend/components/assistant/BookingPanel.tsx`
- [x] Assistant route updated to show recent local booking records alongside the feasibility shell

## Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| pnpm lint | PASS | No ESLint warnings or errors |
| pnpm typecheck | PASS | `pnpm typecheck` passed after the production build regenerated route types |
| pnpm test | N/A | No test suite configured for this sprint area |
| pnpm build | PASS | Stay routes and booking APIs compiled successfully |

## Evidence

- `Sprints/Reviews/evidence/sprint-1-2/validation_summary.md`

## Issues Encountered

- Partial Sprint 1.2 implementation files already existed with mismatched helper names and assumptions; these were normalized to one booking store and one pricing path.
- `pnpm typecheck` initially stalled until the production build regenerated the expected Next route types.
- Existing unit files in `website/cms/units/` extended the public stay catalog beyond the two new seed files; implementation preserved and validated them rather than removing them.

## Deferred Items

- Live Lodgify checkout verification: deferred because Sprint 1.2 remains a scaffold-mode handoff implementation.
- Live Postmark delivery verification: deferred because scaffold-mode local capture is the approved proof model.
- Full in-site checkout and Stripe deposit handling: deferred to P2 per sprint scope.

## Notes for Next Sprint

- Hyde should synthesize that the stay stack now supports public unit discovery, local rate editing, structured waiver capture, redirect intent tracking, webhook-backed confirmation, and operator visibility from local booking records.
- Any future provider activation sprint should keep the three-stage booking lifecycle intact rather than collapsing waiver, redirect, and confirmation into one state.
