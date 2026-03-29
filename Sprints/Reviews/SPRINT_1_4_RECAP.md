# Sprint 1.4 Recap — Shop, Activism, and Assistant Enhancements

**Completed:** 2026-03-16T11:38:52.6737492-05:00
**Duration:** From 2026-03-16T13:15:00-05:00 approval handoff to 2026-03-16T11:38:52.6737492-05:00 implementation completion

## Deliverables

### Workstream 1.4.1 — Shop Catalog and Product Pages
- [x] Public `/shop` catalog with category filtering and explicit product visibility rules
- [x] Product detail route at `/shop/[slug]`
- [x] JSON-backed product loader under `website/cms/shop/`
- [x] Shipping profile and status display helpers aligned to approved constraints

### Workstream 1.4.2 — Checkout Flow with Shipping Enforcement
- [x] Client cart and checkout flow under `/shop/checkout`
- [x] Single shipping-profile enforcement for Sprint 1.4 carts
- [x] Local scaffold-mode order capture API at `/api/shop/orders`
- [x] Confirmation route and local confirmation capture artifacts

### Workstream 1.4.3 — Activism Update Feed
- [x] Enhanced `/activism` landing route using the existing single `updates.json` feed
- [x] Action center with external-link pattern for donations/contact/share actions
- [x] Detail route at `/activism/updates/[slug]`
- [x] Expanded activism CMS entries with source refs, actions, content, and categories

### Workstream 1.4.4 — Burro Follow-Up Drafts
- [x] CMS templates under `website/cms/burro/templates/`
- [x] Local Burro follow-up draft store and approval capture path
- [x] Inline draft cards attached to `BookingPanel` and `WorkshopPanel`
- [x] Approval API at `/api/assistant/followups/approve`

### Workstream 1.4.5 — CRM Event History Foundation
- [x] `GuestEvent` schema and local append-only event store
- [x] Booking, registration, purchase, and follow-up event capture
- [x] Thin guest-activity display embedded in assistant panels
- [ ] Unified guest CRM view (deferred: Sprint 3.2 scope)

## Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| pnpm lint | PASS | `next lint` clean |
| pnpm typecheck | PASS | `tsc --noEmit` clean |
| pnpm test | N/A | No targeted test suite exists for Sprint 1.4 flows |
| pnpm build | PASS | Next.js production build succeeded |

## Evidence

- `Sprints/Reviews/evidence/sprint-1-4/validation_summary.md`

## Issues Encountered

- Sandbox command execution intermittently failed with `windows sandbox: setup refresh failed`; verification commands were rerun with approved escalation.
- Existing unfinished shop components in `components/shop/` used an older cart/type shape; they were normalized to the Sprint 1.4 contracts to keep the repo type-clean.

## Deferred Items

- Unified guest profile and richer CRM UI: deferred to Sprint 3.2.
- Live payment collection: deferred; local scaffold-mode order capture remains the proof path.
- Fragile/freight artisan shipping: deferred beyond Sprint 1.4.

## Notes for Next Sprint

- Hyde should synthesize lessons around the coexistence of new shop code and pre-existing incomplete shop scaffolding.
- The activism model is now explicitly single-feed. Future content changes should extend `website/cms/activism/updates.json`, not create a parallel per-file pattern.
- Assistant follow-up approvals now create local capture artifacts and guest events, which provides a thin base for later CRM work without introducing a separate operator queue.
