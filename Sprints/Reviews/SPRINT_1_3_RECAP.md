# Sprint 1.3 Recap — Workshops and Equipment Operations Prep

**Completed:** 2026-03-16
**Duration:** Same-day review and implementation cycle after Hyde approval

## Deliverables

### Workstream 1.3.1 — Workshop Catalog and Public Pages
- [x] Replaced the workshop route stub with a public workshop catalog at `website/frontend/app/workshops/page.tsx`
- [x] Added dynamic workshop detail routes at `website/frontend/app/workshops/[slug]/page.tsx`
- [x] Added workshop catalog, card, category filter, and list-first calendar components
- [x] Added workshop content loader backed by `website/cms/workshops/*.json`

### Workstream 1.3.2 — Workshop CMS Content
- [x] Wired the approved JSON-backed workshop program model and intake schema files already present in `website/cms/workshops/`
- [x] Preserved stable intake schema versioning and question IDs from CMS seeds
- [x] Preserved workshop waiver and confirmation template content under `website/cms/waivers/` and `website/cms/emails/`

### Workstream 1.3.3 — Registration Flow
- [x] Added workshop registration route at `website/frontend/app/workshops/[slug]/register/page.tsx`
- [x] Added dynamic intake form, workshop waiver, and registration submit components
- [x] Added workshop waiver API at `website/frontend/app/api/workshop/waiver/route.ts`
- [x] Added workshop registration API at `website/frontend/app/api/workshop/register/route.ts`
- [x] Implemented local single-writer capacity decrement through the registration store

### Workstream 1.3.4 — Registration Confirmation and Notifications
- [x] Added workshop registration store in `website/frontend/lib/workshop/store.ts`
- [x] Added scaffold-mode confirmation helper and operator registration logger
- [x] Added confirmation route at `website/frontend/app/workshops/[slug]/register/confirmation/page.tsx`
- [x] Stored local registration and waiver records under `data/workshop-registrations/` and `data/workshop-waivers/`

### Workstream 1.3.5 — Internal Equipment Scheduler
- [x] Added equipment loader and simple reservation store
- [x] Added internal equipment page at `website/frontend/app/assistant/equipment/page.tsx`
- [x] Added read-mostly availability and maintenance components
- [x] Preserved the constrained Sprint 1.3 boundary: visibility plus simple reservation logic only

### Workstream 1.3.6 — Operator Visibility
- [x] Added `WorkshopPanel` to show recent workshop registrations in the assistant shell
- [x] Updated `/assistant` to show both booking and workshop records plus a link to the equipment scheduler

## Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| pnpm lint | PASS | No ESLint warnings or errors |
| Type validation | PASS | Verified through `next build` type-validation step |
| Raw `tsc` invocation | INCONCLUSIVE | Direct CLI typecheck hit a Windows/.next route-type resolution false negative |
| pnpm test | N/A | No test suite configured for this sprint area |
| pnpm build | PASS | Workshop routes, workshop APIs, assistant updates, and internal equipment page compiled successfully |

## Evidence

- `Sprints/Reviews/evidence/sprint-1-3/validation_summary.md`

## Issues Encountered

- `apply_patch` failed again in the Windows sandbox, so file edits were completed via PowerShell writes.
- Raw `tsc` invocation reported missing `.next/types` route files even though those files existed and `next build` completed successfully; build output was treated as the authoritative validation signal.
- Several Sprint 1.3 CMS and schema seed files already existed before implementation; Jekyll preserved and wired them instead of replacing them.

## Deferred Items

- Live provider-backed workshop email delivery: deferred because scaffold-mode local capture remains the approved proof model.
- Public equipment rental checkout: deferred to Sprint 2.2/P2 scope.
- Rich equipment maintenance editing and advanced calendar interaction: deferred by approved Sprint 1.3 scope constraint.

## Notes for Next Sprint

- Hyde should synthesize that Sprint 1.3 now establishes a public workshop layer with list-first sessions, type-specific intake, local capacity decrement, scaffold-mode confirmation, and internal operator visibility.
- Future workshop or equipment expansion should preserve the single-writer local capacity model unless a later sprint explicitly replaces it with a provider-backed scheduler.
