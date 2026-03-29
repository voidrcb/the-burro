# Architectural Decisions - Big Bend Burro

This file records all significant architectural and design decisions for the Big Bend Burro project.

---

## Decision Log

### DEC-001: Project Workspace Structure (2026-03-15)

**Context:** Setting up workspace following Minerva handmaiden patterns.

**Decision:** Use standard Omega_Trader project structure:
- `memory/` for project memory and Custom GPT knowledge
- `Docs/` for canonical documents and research
- `Sprints/` for proposals and reviews
- `source/` for raw source materials
- `assets/` for images and design resources

**Rationale:** Consistency with Scout, Clark, Ed, Stitch patterns enables Minerva oversight and cross-project tooling.

---

### DEC-002: Custom GPT Knowledge Location (2026-03-15)

**Context:** The Burro needs knowledge files for Custom GPT like TG does.

**Decision:** Place knowledge files in `memory/Burro Knowledge/` folder.

**Rationale:**
- Mirrors TG's TGMEM pattern
- Keeps knowledge co-located with project memory
- Clear separation from canonical Docs

---

### DEC-003: Sprint Numbering Convention (2026-03-15)

**Context:** Blueprint uses phase.sprint notation (0.1, 1.2, etc.) across 4 phases.

**Decision:** Preserve phase.sprint notation in proposals but use sequential file numbering (01, 02, ...) for file system ordering.

**Files:**
- `01_sprint_0_1_...` → Sprint 0.1
- `04_sprint_1_1_...` → Sprint 1.1
- etc.

**Rationale:** Human-readable ordering while preserving semantic phase structure.

---

### DEC-004: Jekyll/Hyde Workflow Model (2026-03-15)

**Context:** Codex doesn't poll - it processes and exits.

**Decision:** Use "Check-Work-Exit" model for Jekyll instead of polling:
1. Jekyll checks handoff state on load
2. If it's Jekyll's turn → do work → update handoff → exit
3. If NOT Jekyll's turn → exit immediately with status

**Rationale:** Matches Codex's behavioral model. Hyde (Claude) continues to poll since it maintains sessions.

---

### DEC-005: Design Palette Strategy (2026-03-15)

**Context:** 7 Susan photos contain color palettes for the entire design system.

**Decision:** Extract hex colors from photos during Sprint 0.2 (Design System). Store palette definitions in design system config, not as metadata on images.

**Palettes (from Blueprint):**
1. night_sky_blue - Hero, assistant, night mode
2. desert_gold - Landing, artisan, retreats
3. sage_stone - Content pages, booking UI
4. canyon_ember - Activism, storytelling, footer
5. ocotillo_olive - Sustainability, trails
6. storm_sage - Legal, assistant dashboard, blog

---

### DEC-006: Machine-First Blueprint (2026-03-15)

**Context:** Blueprint is JSON format with detailed schema.

**Decision:** Keep blueprint as canonical JSON. Generate human-readable extracts as needed but don't duplicate the source of truth.

**Rationale:** JSON is parseable, versionable, and supports programmatic access. White Paper Suite covers human narrative needs.

---

### DEC-007: MDX Rendering Strategy (2026-03-15, Sprint 1.1)

**Context:** Sprint 1.1 needed to render MDX blog content in Next.js App Router.

**Decision:** Use `next-mdx-remote` for MDX rendering.

**Rationale:** Works with App Router server components; provides server-side rendering; already compatible with `gray-matter` for frontmatter parsing.

---

### DEC-008: Canonical Content Root (2026-03-15, Sprint 1.1)

**Context:** Sprint 0.2 created `website/cms/` but Sprint 1.1 proposal mentioned `website/frontend/content/`.

**Decision:** Use `website/cms/` as the single canonical content root for P1.

**Rationale:** Prevents content fragmentation; aligns with existing structure; simplifies future CMS migration.

---

### DEC-009: Site-to-Lodgify Handoff for MVP Booking (2026-03-16, Sprint 1.2)

**Context:** Full in-site checkout requires deposit handling, payment processing, and availability sync.

**Decision:** MVP uses site-to-Lodgify handoff. Guest completes waiver and captures intent on site, then redirects to Lodgify booking widget. Confirmation comes back via webhook.

**Rationale:** Safer MVP scope; Lodgify handles availability sync and payment; full in-site checkout deferred to P2.

---

### DEC-010: FAQ Burro Deferral (2026-03-16, Sprint 1.2)

**Context:** Sprint 1.2 already carries stay pages, booking funnel, webhooks, and notifications.

**Decision:** Defer FAQ Burro (conversational stay support) to Sprint 1.4 or later.

**Rationale:** Booking flow should stabilize before adding conversational layer; reduces Sprint 1.2 scope risk.

---

### DEC-011: Local Rate Ruleset Location (2026-03-16, Sprint 1.2)

**Context:** Seasonal pricing rules need to be operator-editable without code deployment.

**Decision:** Store rate rulesets in `website/cms/rates/seasonal.json` with JSON schema validation.

**Rationale:** Follows content root pattern; operator can edit JSON; loader validates before use.

---

### DEC-012: Three-Stage Booking Lifecycle (2026-03-16, Sprint 1.2)

**Context:** Sprint 1.2 needed to track booking progress from waiver through redirect to confirmation.

**Decision:** Define three distinct event stages:
1. **Waiver acknowledgement** - Guest accepts terms, stored locally
2. **Booking redirect intent** - Guest proceeds to Lodgify, timestamp captured
3. **Provider-confirmed booking** - Webhook returns confirmed booking

**Rationale:** Clean data model; prevents conflating intent with confirmation; each stage has its own store and lifecycle.

---

### DEC-013: Scaffold-Mode Confirmation Proof (2026-03-16, Sprint 1.2)

**Context:** Confirmation email delivery requires live Postmark credentials.

**Decision:** Scaffold-mode local capture is valid verification for booking confirmation flow.

**Rationale:** Validates flow exists without external provider activation; local capture shows payload structure; live delivery verification deferred to activation sprint.

---

### DEC-014: BookingPanel vs Full Dashboard (2026-03-16, Sprint 1.2)

**Context:** Operators need visibility into booking activity.

**Decision:** Add minimal BookingPanel to existing assistant shell rather than building separate operator dashboard.

**Rationale:** Keeps assistant surface cohesive; operators see local booking records alongside feasibility shell; full dashboard scope deferred.

---

### DEC-015: Unit Visibility by Status Field (2026-03-16, Sprint 1.2)

**Context:** Not all lodging units should be publicly visible.

**Decision:** Unit `status` field controls visibility:
- `available` - Publicly visible and bookable
- `coming_soon` - Visible but not bookable
- `private` - Hidden from public catalog

**Rationale:** Explicit control over inventory exposure; prevents accidental public listing of private units; loaders and routes enforce visibility rules.

---

### DEC-016: Workshop Content Model Supersession (2026-03-16, Sprint 1.3)

**Context:** Sprint 1.3 introduces `WorkshopProgram` and `WorkshopSession` contracts, but the repo already has an older `Workshop` type in `lib/content/types.ts`.

**Decision:** Sprint 1.3 explicitly supersedes the old workshop shell model. The old `Workshop` type will be replaced by JSON-backed `WorkshopProgram` structure.

**Rationale:** Prevents content contract drift; single canonical workshop model for P1; MDX shell replaced by JSON program files.

---

### DEC-017: Workshop Capacity Source-of-Truth (2026-03-16, Sprint 1.3)

**Context:** Workshop registration needs to enforce capacity limits with a clear single-writer model.

**Decision:** Use CMS-authored with local decrement model:
- `capacity.max` is CMS-authored and immutable during session
- `spotsAvailable` initialized from `capacity.max`
- Only registration API (`/api/workshop/register/route.ts`) may decrement `spotsAvailable`
- Operators may manually adjust via CMS edit for corrections

**Rationale:** Single-writer model suitable for scaffold-mode MVP; repo-verifiable capacity enforcement; not concurrency-safe production scheduler.

---

### DEC-018: Calendar MVP List-First (2026-03-16, Sprint 1.3)

**Context:** Calendar UI could be list view, month grid, or both.

**Decision:** Sprint 1.3 commits to list-first calendar view. Month-grid is optional polish if core registration flow is stable.

**Rationale:** Reduces frontend scope; list view satisfies acceptance criteria; grid becomes carryover if not delivered.

---

### DEC-019: Intake Schema Versioning (2026-03-16, Sprint 1.3)

**Context:** Workshop intake forms are workshop-type specific, but stored answers need to be interpretable later.

**Decision:** Intake schemas require:
- `schemaVersion` field (e.g., "1.0.0")
- Stable `questionId` for each question
- `WorkshopRegistration` stores `intakeSchemaRef` and `intakeSchemaVersion` alongside responses

**Rationale:** Ensures stored answers can be matched to schema version that generated them; supports future migration to provider-backed registration.

---

### DEC-020: Equipment Scheduler Scope Constraint (2026-03-16, Sprint 1.3)

**Context:** Equipment scheduler is internal-only in P1 but proposal bundled multiple operator tools.

**Decision:** Constrain Sprint 1.3 equipment scope to:
- Asset listing with status display
- Basic availability calendar (read-only)
- Simple reservation create/cancel
- Maintenance log viewing (read-only)

Deferred to later sprint: rich maintenance editing, drag-drop calendar, reservation modification.

**Rationale:** Keeps equipment side as "internal prep" not full operator tool; reduces scope if workshop registration runs long.

---

### DEC-021: Session State Public Labels (2026-03-16, Sprint 1.3)

**Context:** Workshop sessions can be `open`, `full`, or `cancelled` but acceptance criteria only mentioned "Registration closed".

**Decision:** Use distinct public labels for each state:
- `open` → "Register Now"
- `full` → "Registration Full"
- `cancelled` → "Session Cancelled"

**Rationale:** Operational clarity for guests; prevents collapsing different states into one message; cancelled sessions show strikethrough.

---

### DEC-022: Local Shop Order Source-of-Truth (2026-03-16, Sprint 1.4)

**Context:** Sprint 1.4 introduces shop checkout without live payment processing.

**Decision:** Local order store follows scaffold-mode proof pattern established in Sprint 1.2 (booking) and Sprint 1.3 (workshop).

**Rationale:** Consistent proof pattern across all transaction types in P1; validates flow without external provider activation; live Stripe checkout deferred to P2 activation sprint.

---

### DEC-023: Activism Single-Feed Content Pattern (2026-03-16, Sprint 1.4)

**Context:** Activism content could migrate to per-file pattern or stay single-feed.

**Decision:** Keep activism content in `website/cms/activism/updates.json`. Detail routes derive content from single feed via loader.

**Rationale:** Avoids content fragmentation; maintains pattern established in earlier sprints; per-file migration unnecessary for current content volume.

---

### DEC-024: Single Shipping Profile Per Order (2026-03-16, Sprint 1.4)

**Context:** Mixed-profile carts (combining parcel and pickup-only items) create validation complexity.

**Decision:** Sprint 1.4 (and P1) enforces single shipping profile per order. Mixed-profile carts blocked at checkout.

**Rationale:** Keeps cart validation narrow and repo-verifiable; complex multi-profile logic deferred until operationally justified.

---

### DEC-025: Guest Identity by Normalized Email (2026-03-16, Sprint 1.4)

**Context:** Guest event history needs identity resolution across bookings, registrations, and purchases.

**Decision:** Guest identity resolved by normalized (lowercased, trimmed) email only. No merged customer profile across multiple contact channels.

**Rationale:** Simple, deterministic identity model for P1; full guest consolidation deferred to Sprint 3.2 CRM work.

---

### DEC-026: Product Status Visibility Rules (2026-03-16, Sprint 1.4)

**Context:** Shop catalog needs clear rules for how product status affects public visibility.

**Decision:** Explicit visibility rules:
- `available`: Visible, purchase enabled
- `sold-out`: Visible (social proof), purchase disabled
- `coming-soon`: Visible with badge, purchase disabled
- `private`: Hidden from public catalog

**Rationale:** Prevents ambiguous merchandising; extends pattern from DEC-015 (lodging unit visibility).

---

### DEC-027: Follow-Up Draft Panel Attachment (2026-03-16, Sprint 1.4)

**Context:** Burro follow-up drafts could appear in separate queue or attached to existing panels.

**Decision:** Draft cards attach inline to BookingPanel and WorkshopPanel. No separate operator queue.

**Rationale:** Follows panel consolidation pattern from earlier sprints; keeps assistant surface cohesive; reduces operator context-switching.

---

### DEC-028: ExperienceProduct Contract Supersession (2026-03-16, Sprint 2.1)

**Context:** Sprint 2.1 introduces `ExperienceProduct` for experience catalog, but generic `Experience` type already exists in `lib/content/types.ts`.

**Decision:** `ExperienceProduct` supersedes the generic `Experience` type as the canonical experience content contract. Canonical path: `website/frontend/lib/experience/types.ts`.

**Rationale:** Follows Sprint 1.3 workshop supersession pattern (DEC-016); prevents type drift; single canonical experience model for P2.

---

### DEC-029: Itinerary Contract Canonical Paths (2026-03-16, Sprint 2.1)

**Context:** Sprint 2.1 introduces multiple new contracts: `ItineraryDraft`, `GroupBooking`, `PackagePricingRule`, `CapacityHold`.

**Decision:** All itinerary-related contracts live in `website/frontend/lib/itinerary/types.ts`. Experience contracts live separately in `website/frontend/lib/experience/types.ts`.

**Rationale:** Clear module boundaries; itinerary module owns composition, hold, and pricing logic; experience module owns catalog content.

---

### DEC-030: CapacityHold Expiry Model (2026-03-16, Sprint 2.1)

**Context:** Package holds need to expire without a background scheduler.

**Decision:** Use expiry-on-read/write model:
- `expiresAt` field on each hold
- On any read/write to hold store, check `expiresAt` and mark expired holds as `expired`
- No background job or cron required

**Rationale:** Matches scaffold-mode MVP pattern; deterministic hold lifecycle; complexity-appropriate for P2.

---

### DEC-031: Internal-First Itinerary Builder (2026-03-16, Sprint 2.1)

**Context:** Itinerary builder could ship as internal-only operator tool or public guest-facing immediately.

**Decision:** Sprint 2.1 itinerary builder is internal-only. Public guest-facing version deferred to Sprint 2.3 or later.

**Rationale:** Follows R1_ASSISTED pattern; operators learn composition tool before guests use it; reduces scope risk; matches follow-up draft approval pattern from Sprint 1.4.

---

### DEC-032: Shareable Draft Output Strategy (2026-03-16, Sprint 2.1)

**Context:** Proposal mentioned PDF export for shareable drafts, but no rendering/export pipeline exists.

**Decision:** Shareable draft output is permalink or printable HTML summary first. PDF generation is optional polish.

**Rationale:** Avoids new rendering pipeline dependency; HTML/print achieves the same guest-review goal; PDF can be added later if operationally required.

---

### DEC-033: Retreats as Package Subtype (2026-03-16, Sprint 2.1)

**Context:** Retreats could be a separate booking domain or a special package type.

**Decision:** Retreats are packages with group metadata (facilitator, participant count, deposit rules), not a separate booking domain.

**Rationale:** Single composition model; reduces migration risk; retreat-specific fields attached to package; coherent implementation.

---

## Future Decisions (Pending)

- Infrastructure: Standalone domain vs vcetexas.com subdomain
- CMS: Sanity vs alternative headless CMS
- Full In-Site Checkout: Stripe integration for deposits (P2)
### DEC-034: Auth Credentials Must Be Environment-Backed (2026-03-28, Post-Mortem)

**Context:** The initial authentication implementation still included fallback passwords and a fallback session secret in code, which contradicted production-safe deployment requirements.

**Decision:** Operator authentication must require environment-backed credentials and session secret. No repo-baked fallback passwords or fallback secret are allowed. Session cookies use signed daily tokens and remain `httpOnly` and `secure` in production.

**Rationale:** Prevents accidental launch with known credentials; aligns auth behavior with the deployment checklist; reduces the gap between local validation and production posture.

---


### DEC-035: Equipment CMS Is the Canonical Rental Source (2026-03-28, Sprint 15/16 Post-Mortem)

**Context:** Sprint 16 added `website/cms/equipment/` as the richer equipment contract, but the public rental catalog was still reading from the older `website/cms/rentals/` lane and the Kubota asset existed in both places.

**Decision:** `website/cms/equipment/` is the canonical source for public rental pages and internal equipment surfaces. `website/cms/rentals/` is retired and should not receive new inventory.

**Rationale:** Removes duplicate asset records, keeps public and internal views aligned, and lets one schema carry weekly rates, delivery fees, and richer operational notes.

---

### DEC-036: Inspiration Media Beats Broken Product Media (2026-03-28, Sprint 15/16 Post-Mortem)

**Context:** Several Sprint 16 shop products launched with image paths that did not exist in `website/frontend/public/`.

**Decision:** When dedicated product photography is not available yet, use valid on-site inspiration media from existing workshop or palette imagery rather than shipping broken image paths.

**Rationale:** Preserves public catalog integrity immediately while making the missing photography work explicit and trackable.

---

### DEC-037: Legacy Product IDs Require Planned Migration (2026-03-28, Sprint 15/16 Post-Mortem)

**Context:** Older shop products use mixed historical ID formats while Sprint 16 introduced a cleaner `product_[category]_[descriptor]` pattern.

**Decision:** Normalize IDs for new products only. Preserve legacy IDs until a dedicated migration is planned and validated against stored orders and integrations.

**Rationale:** Avoids silent breakage in persisted records while still moving the catalog toward a consistent identifier standard.

---
