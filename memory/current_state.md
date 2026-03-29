# Current State - Big Bend Burro

## HARD BOUNDARY: PROJECT ISOLATION

The Burro operates only within `C:\handmaidens\The Burro\`.
Git and file operations must stay scoped to this workspace.

---

## Project Overview

**Project:** Big Bend Burro  
**Operators:** Chuck and Susan Bell  
**Domain:** `bigbendburro.vcetexas.com`  
**Primary Stack:** Next.js 14.2.33, React 18.3.1, Tailwind, pnpm 10.32.1

Mission remains the same: build a stewardship-first Big Bend venture that combines lodging, workshops, experiences, shop, equipment rental, and Chuck's steel-building consultation lane without outgrowing operator capacity.

---

## Program Status

**Status:** POST-MORTEM COMPLETE AFTER SPRINTS 15 AND 16  
**Current Phase:** Production hardening with aligned CMS, GPT, and documentation  
**Latest Milestone:** `SPRINT_16_POSTMORTEM_COMPLETE`

### Sprint Status
- Sprint 15 (4.1) Operator Onboarding: complete
- Sprint 16 Unified Alignment: complete
- Sprint 15/16 post-mortem: complete

---

## Post-Mortem Results (2026-03-28)

The post-mortem verified Sprint 15 and Sprint 16 deliverables, corrected defects, and updated the canonical docs.

### Key Fixes
- Public rentals now source from `website/cms/equipment/` instead of the retired `website/cms/rentals/` lane.
- Removed duplicate Kubota record from `website/cms/rentals/`.
- Repaired broken shop image paths for Sprint 16 products and aligned new product IDs.
- Updated shop UI labels so new categories render cleanly in the public catalog and product detail pages.
- Normalized lodging soft-launch status values to `coming-soon`.
- Added `dynamic = 'force-dynamic'` to `/api/crm/history` to eliminate the Next.js build warning.
- Resynced canonical CMS docs and GPT knowledge files with corrected lodging, experience, workshop, shop, and equipment data.

### Verified Quality Gates
- `pnpm lint`: PASS
- `pnpm typecheck`: PASS
- `pnpm test -- --run`: PASS (3 tests)
- `pnpm build`: PASS (86 routes generated)

---

## Active Product State

### Lodging
- Mesa Glow Cabin and Casa de la Luna are the only currently bookable public stays.
- Cottonwood Lookout and Ocotillo Lookout remain visible but non-bookable `coming-soon` inventory.
- Check-in is 4:00 PM Central across all public units.

### Shop
- Prints, tiles, pottery, apparel, giftables, and print-on-demand are all represented in CMS.
- Sprint 16 products are live in data and render correctly in the UI.
- Several new products still use inspiration media until dedicated product photography is captured.

### Equipment Rental
- The equipment directory is now the canonical source for both public rental pages and internal equipment views.
- Public rental routes now expose Kubota, Sony A7R, Star Tracker, and Tile Tool Pack from one shared source.

---

## Known Gaps

- Legacy pre-Sprint-16 shop product IDs still use mixed historical formats. Slugs remain the canonical route key until an explicit migration is planned.
- Dedicated product photography is still missing for several new Sprint 16 shop items.
- Policy pages and a finished newsletter lane still need public-facing completion.

---

## Active Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Cloudflared restart still pending for production tunnel verification | High | Restart service and rerun live checks |
| Production auth environment variables may still be missing | High | Set secure env vars before public launch |
| Legacy shop IDs remain mixed | Medium | Plan explicit migration instead of ad hoc renames |
| Product photography coverage incomplete | Medium | Schedule a dedicated content capture sprint |

---

## Key References

- `Sprints/Reviews/POSTMORTEM_SPRINT_15_16.md`
- `website/cms/CONTENT_REGISTRY.md`
- `website/cms/BOOKING_FRAMEWORK.md`
- `website/cms/SITE_ARCHITECTURE.md`
- `Sprints/.sprint_handoff.json`

*Last Updated: 2026-03-28 after Sprint 15/16 post-mortem*
