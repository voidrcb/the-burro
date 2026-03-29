# Post-Mortem: Sprint 15 (4.1) and Sprint 16 (Unified)

**Completed:** 2026-03-28  
**Scope:** Verification, defect correction, gap analysis, opportunity identification, documentation refresh, and quality-gate revalidation.

## Defects Found

| Severity | Defect | Evidence |
|----------|--------|----------|
| High | Public rentals were still hardcoded and not reading the new equipment CMS. | `website/frontend/app/rentals/page.tsx`, `website/frontend/lib/content/rentals.ts` |
| High | Kubota existed in both `website/cms/rentals/` and `website/cms/equipment/`. | duplicate records at audit time |
| Medium | Several Sprint 16 shop products referenced image paths that did not exist. | new shop JSON entries under `website/cms/shop/` |
| Medium | New shop categories rendered as raw keys in parts of the public UI. | `website/frontend/components/shop/ShopCatalogClient.tsx`, `website/frontend/app/shop/[slug]/page.tsx` |
| Medium | Lodging soft-launch statuses used a different convention from the canonical docs. | `website/cms/units/cottonwood-lookout.json`, `website/cms/units/ocotillo-lookout.json`, `website/frontend/lib/content/stay-types.ts` |
| Medium | `BOOKING_FRAMEWORK.md` referenced a non-existent CRM file. | `website/cms/BOOKING_FRAMEWORK.md` |
| Low | `/api/crm/history` emitted a dynamic server usage warning during build. | `website/frontend/app/api/crm/history/route.ts` |
| Medium | GPT knowledge files drifted from CMS for lodging, workshops, equipment, and shop. | `custom_gpt/metalminds/04-07` |

## Defects Fixed

| Fix | Files |
|-----|-------|
| Switched rental catalog and detail pages to the equipment CMS source of truth | `website/frontend/lib/content/rentals.ts`, `website/frontend/app/rentals/page.tsx`, `website/frontend/app/rentals/[slug]/page.tsx` |
| Removed duplicate Kubota rental record | `website/cms/rentals/kubota-excavator.json` |
| Expanded equipment schema and loader for Sprint 16 fields | `website/cms/equipment/schema.json`, `website/frontend/lib/content/equipment.ts`, `website/frontend/lib/content/types.ts`, `website/frontend/lib/rental/types.ts` |
| Repaired missing shop media and normalized new Sprint 16 product IDs | `website/cms/shop/desert-scene-tile.json`, `website/cms/shop/ocotillo-tile.json`, `website/cms/shop/custom-tile-set.json`, `website/cms/shop/desert-mug.json`, `website/cms/shop/succulent-planter.json`, `website/cms/shop/burro-tshirt.json`, `website/cms/shop/dark-sky-cap.json`, `website/cms/shop/burro-sticker-pack.json`, `website/cms/shop/night-sky-poster.json`, `website/cms/shop/private-tile-drop.json`, `website/cms/shop/schema.json` |
| Updated shop category labels in public UI | `website/frontend/lib/shop/helpers.ts`, `website/frontend/components/shop/ShopCatalogClient.tsx`, `website/frontend/components/shop/ShopCatalog.tsx`, `website/frontend/app/shop/[slug]/page.tsx` |
| Normalized lodging `coming-soon` status values | `website/cms/units/cottonwood-lookout.json`, `website/cms/units/ocotillo-lookout.json`, `website/frontend/lib/content/stay-types.ts` |
| Fixed CMS framework docs and broken references | `website/cms/CONTENT_REGISTRY.md`, `website/cms/BOOKING_FRAMEWORK.md`, `website/cms/SITE_ARCHITECTURE.md` |
| Removed build-time dynamic warning | `website/frontend/app/api/crm/history/route.ts` |
| Resynced GPT knowledge with CMS | `custom_gpt/metalminds/04_LODGING_STAYS.md`, `custom_gpt/metalminds/05_EXPERIENCES.md`, `custom_gpt/metalminds/06_EQUIPMENT_RENTAL.md`, `custom_gpt/metalminds/07_SHOP_ARTISAN.md` |
| Updated memory and handoff state | `memory/current_state.md`, `memory/session_log.md`, `memory/DECISIONS.md`, `Sprints/.sprint_handoff.json` |

## Gaps Identified

| Priority | Gap | Notes |
|----------|-----|-------|
| High | Legacy pre-Sprint-16 product IDs still use mixed historical formats. | New Sprint 16 items were normalized; older IDs need an explicit migration plan. |
| Medium | Dedicated product photography is still missing for several new shop items. | CMS now uses valid inspiration media instead of broken paths. |
| Medium | Public privacy and terms routes still do not exist. | Footer remains placeholder-only for legal links. |
| Medium | Newsletter infrastructure exists but the public lane is still unfinished. | Public architecture doc now marks this as a gap. |

## Opportunities

- Add weekly-rate or long-stay discount rules for equipment beyond Kubota if operator demand appears.
- Formalize product variants for apparel sizes and tile dimensions in the shop contract and checkout UI.
- Capture dedicated media for pottery, apparel, and giftables to replace inspiration imagery.
- Add partner references and richer operator notes for experience pages that depend on partner delivery.
- Expand workshop intake and follow-up flows once packages and bundles become active.
- Generate blog and newsletter content from new product and equipment launches once the content lane is ready.

## Quality Gate Results

| Gate | Result |
|------|--------|
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test -- --run` | PASS (3 tests) |
| `pnpm build` | PASS (86 routes generated) |

## Recommendations

1. Plan a deliberate migration for legacy shop product IDs instead of renaming them opportunistically.
2. Schedule a short media sprint to capture real product photography for the new shop items.
3. Finish public policy pages and the newsletter lane before calling the public site fully complete.
4. Keep `website/cms/equipment/` as the only rental inventory source going forward.
5. Re-run a smaller sync audit any time CMS pricing changes so the GPT knowledge base does not drift again.
