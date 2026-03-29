# Current State - Big Bend Burro

## HARD BOUNDARY: PROJECT ISOLATION

The Burro operates only within `C:\handmaidens\The Burro\`.
Git commands must stay scoped to `The Burro/` paths.

---

## Project Overview

**Project:** Big Bend Burro
**Operators:** Chuck and Susan
**Location:** Big Bend / Terlingua, Texas
**Domain:** bigbendburro.com (planned), currently bigbendburro.vcetexas.com

**Mission:** Create a sustainable Big Bend eco-tourism and artisan project that starts small, teaches Chuck and Susan gradually, and expands into a durable local business with conservation value.

---

## Sprint Status

**Program Status:** DEPLOYMENT READY
**Current Phase:** Site Enhancement Complete
**Current Sprint:** None active
**Sprints Completed:** 0.1-3.3 (all 14) + SITE_COMPLETION + ENH-001 + ENH-002 (prepared) + ENH-003 (site overhaul)

**Site Completion Sprint (2026-03-28):**
- SC.1 Image Integration: COMPLETE
- SC.2 Footer & Navigation: COMPLETE
- SC.3 Content Cleanup: COMPLETE after post-mortem cleanup in public shop/stay flows
- SC.4 Visual Polish: COMPLETE
- SC.5 Build Verification: COMPLETE

**Post-Mortem Review (2026-03-28):**
- Verified `ImageWithFallback` usage across public catalog components
- Verified `SiteFooter` and Shop navigation are wired into the site shell
- Removed remaining public `Sprint` / `scaffold-mode` copy from checkout and booking surfaces
- Hardened authentication to require environment-backed credentials and session secret
- Re-ran quality gates and live auth/order smoke tests

**Quality Gates:**
- `pnpm lint`: PASS (livestream/rental capture views converted to next/image)
- `pnpm typecheck`: PASS
- `pnpm build`: PASS (84 pages generated)
- `pnpm test`: PASS (Vitest infrastructure added with initial shop tests)

**Live Smoke Validation:**
- `GET /login`: 200
- `GET /assistant` unauthenticated: 307 redirect to `/login`
- `POST /api/auth/login` valid credentials: 200
- `POST /api/auth/login` invalid credentials: 401
- Session cookie: `Secure`, `HttpOnly`, `SameSite=Lax`
- `GET /assistant` with issued session cookie: 200
- `POST /api/shop/orders` valid payload: 200
- `POST /api/shop/orders` invalid payload: 400

**Reviews:**
- `Sprints/Reviews/FINAL_SPRINT_REVIEW_2026-03-28.md`
- `Sprints/Reviews/POSTMORTEM_REVIEW.md`

---

## Authentication (ENH-001)

**Status:** IMPLEMENTED AND HARDENED

- Middleware protects `/assistant/*` routes
- Login page at `/login` with Suspense boundary
- Session cookie is daily-rotated, `httpOnly`, and `secure` in production
- Logout button in assistant layout
- No repo-baked fallback passwords or session secret remain in code
- Required environment variables:
  - `OPERATOR_SESSION_SECRET`
  - `OPERATOR_PASSWORD`
  - `CHUCK_PASSWORD`
  - `SUSAN_PASSWORD`
  - Optional: `OPERATOR_USERNAME` (defaults to `operator` if omitted)

---

## Payment Integration (ENH-002)

**Status:** PREPARED (manual payment handoff active)

- Shop checkout captures orders locally
- Public checkout copy now reflects the real manual-payment workflow
- Stripe activation guide: `Sprints/Reviews/ENH-002_PAYMENT_ACTIVATION.md`

---

## Site Overhaul (ENH-003)

**Status:** COMPLETE

Major site enhancement including:

### New Features
- **Coming Soon Badges**: All checkout forms clearly marked as "Coming Soon"
- **Payment Method Stubs**: PayPal, Venmo, Zelle, Credit Card UI (visual only, non-functional)
- **Steel Buildings Page** (`/steel-buildings`): Chuck's commercial steel building sales for ranches and businesses

### Pages Converted from Stubs
- **Dark Sky** (`/dark-sky`): Full page with seasonal guide, celestial events, viewing tips
- **Rentals** (`/rentals`): Equipment catalog with Kubota excavator, rental process

### Visual and Content Improvements
- Homepage updated with "Dark Sky Country" theme and guest-focused copy
- Stay page emphasizes dark sky lodging experience
- Shop page focuses on Susan's artisan collection
- All pages use warmer, more evocative marketing language
- Hero component enhanced with background image support and star animation

### Navigation
- Steel Buildings added to main navigation between Workshops and Shop
- Steel Buildings added to footer

### Quality Gates (ENH-003)
- `pnpm typecheck`: PASS
- `pnpm lint`: PASS (pre-existing warnings only)
- `pnpm build`: PASS (84 pages generated)

---

## Live Deployment Status (2026-03-28)

**Status:** CLOUDFLARED NEEDS RESTART - Config updated, pending service restart

### Tunnel Configuration Updated
- Changed protocol from QUIC to HTTP/2 in `C:\ProgramData\cloudflared\config.yml`
- Added origin request settings (connectTimeout: 30s, noHappyEyeballs: true)
- **Requires admin restart to take effect:**
```powershell
sc stop cloudflared
Start-Sleep -Seconds 5
sc start cloudflared
```

### Verification After Restart
```bash
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null -w "Test $i: %{http_code}\n" https://bigbendburro.vcetexas.com/; done
```
All 10 should return 200.

---

## Session 2026-03-28 Updates

### Susan's Photo Palette - Now Functional
- **What it is:** 7 Big Bend photographs by Susan that define the site's color palette
- **Photos added to** `/public/images/palette/`:
  - `chisos-road.jpg` - Road to Chisos Mountains
  - `casa-grande-cactus.jpg` - Casa Grande with cholla blooms
  - `santa-elena-canyon.jpg` - Santa Elena Canyon walls
  - `chisos-mountains.jpg` - Chisos at golden hour
  - `kayak-canyon.jpg` - Kayaking through canyon (featured on homepage)
  - `slot-canyon-hiker.jpg` - Slot canyon hiker
  - `rio-grande-bend.jpg` - Rio Grande bend at twilight

### Shop Products Added - Susan's Print Collection
7 new print products created in `website/cms/shop/`:
- `road-to-chisos-print.json` ($85)
- `casa-grande-bloom-print.json` ($95)
- `santa-elena-canyon-print.json` ($125)
- `chisos-golden-hour-print.json` ($95)
- `canyon-passage-print.json` ($110)
- `into-the-slot-print.json` ($95)
- `rio-grande-bend-print.json` ($85)

### Homepage Updates
- "Susan's photo palette" section now shows her actual kayak canyon photo
- Added "Shop Susan's prints" link to shop prints category
- Fixed text contrast (changed from light `text-nightSafe-glow/90` to dark `text-text-body`)

### Content Audit & Cleanup
Removed dev/blueprint language from experience descriptions:
- **terlingua-night-sky-drive.json** - Removed "Sprint 2.1 package proof"
- **boquillas-story-route.json** - Removed "status visibility rules" language
- **terlingua-tile-fire-circle.json** - Removed "operational complexity" language
- **rio-grande-daybreak-float.json** - Removed "manual partner handoff" internal language

All replaced with warm, guest-facing marketing copy.

## Next Actions

1. **Restart cloudflared** (admin required) to apply tunnel config changes
2. **Verify 502 errors resolve** after restart
3. **Set secure auth environment variables** before public launch
4. **Activate payment integration** when operators are ready

---

## Active Frontend Baseline

- Public shop lane is live with JSON-backed products, category filtering, product detail, local cart, and order capture
- `/activism` derives both the status feed and detail routes from the existing `website/cms/activism/updates.json` single-feed source
- Internal assistant attaches follow-up draft cards to booking and workshop records and shows thin guest-event history inline
- Shop orders, follow-up approvals, and guest events persist locally under `data/`

## Toolchain

- Node `v24.11.0`
- pnpm `10.32.1`
- Next.js `14.2.33`

---

## Phase Summary

| Phase | Status |
|-------|--------|
| Phase 1 (MVP Launch) | COMPLETE |
| Phase 2 (Experience Expansion) | COMPLETE |
| Phase 3 (Operations) | COMPLETE |
| Site Completion Sprint | COMPLETE |
| ENH-001 Authentication | COMPLETE |
| ENH-002 Payment | PREPARED |
| ENH-003 Site Overhaul | COMPLETE |
| Post-Mortem Review | COMPLETE |

---

## Active Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Water/wastewater infrastructure | HIGH | Solve before scaling lodging |
| Summer heat occupancy | HIGH | Premium night experiences, not daytime |
| Production auth env vars missing | HIGH | Deployment must set secure secrets before public launch |

---

## Documentation

- `Sprints/Reviews/FINAL_SPRINT_REVIEW_2026-03-28.md` - Final sprint review
- `Sprints/Reviews/POSTMORTEM_REVIEW.md` - Post-mortem findings and fixes
- `Sprints/Reviews/ENH-002_PAYMENT_ACTIVATION.md` - Payment activation guide
- `Sprints/Reviews/COMPREHENSIVE_WORKSPACE_REVIEW.md` - Full workspace review
- `Sprints/Reviews/WORKFLOW_RETROSPECT_FOR_MINERVA.md` - Workflow retrospective

---

*Last Updated: 2026-03-28 (ENH-003 site overhaul complete)*
