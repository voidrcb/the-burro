---
title: "Sprint 1.4 Proposal — Shop, Activism, and Assistant Enhancements"
project: "Big Bend Burro"
sprint_id: "1.4"
phase_id: "P1"
phase_name: "MVP Launch"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 1.4 Proposal — Shop, Activism, and Assistant Enhancements

## Proposal intent

Add the first curated commerce layer, strengthen the preservation-information system, and extend Burro into follow-up and content assistance roles that support the growing operation.

## Proposal basis

- Blueprint P1 build scope includes a small artisan shop, activism hub, and Burro CRM/follow-up capabilities.
- Feature registry includes artisan_tile_collections and activism_hub with P1 activation.
- White paper says the shop should stay curated and activism support should organize contact scripts, update briefs, and fast-moving action content.
- Research on handmade tile and workshops says heavy fragile goods work better when sold selectively and story-first, not as a giant commodity catalog.

## What

### In scope

- Launch the first version of the artisan shop with a narrow product set such as limited tile runs, pottery pieces, prints, and giftable goods.
- Implement product data, shipping profiles, and checkout for small curated items.
- Extend the activism section into a live update feed with background explainers, scripts, and donation/action pathways.
- Extend Burro to draft follow-ups, post-stay notes, workshop reminders, and content copy from approved sources.

### Deliverables

- Shop catalog and curated product detail pages.
- Checkout path for eligible items.
- Shipping-profile logic and product-state controls.
- Activism update feed and action center.
- Burro follow-up and content-assist flows.

### Out of scope

- No sprawling full-store catalog.
- No fragile high-risk shipping promises beyond what the shop rules can actually support.
- No automated outbound messages without review if they involve activism or sensitive claims.

## How

### Implementation approach

1. Use the shop_product model to make shipping constraints explicit. Pickup-only, fragile parcel, freight-only, and print-on-demand are different operational lanes and need different UI and checkout logic.
2. Start with a small set of SKUs that are easy to understand operationally. The sprint should prove the lane, not fill the catalog.
3. Implement activism content as a structured update stream connected to source-pack references so public updates can remain evidence-grounded.
4. Create content templates in Burro for post-stay follow-up, workshop reminders, drop announcements, and activism scripts, but keep approval human.
5. Add light CRM-style tagging or event history so later recommendation and follow-up sprints have real historical data.
6. Enforce shipping rules at checkout rather than relying on manual cleanup later.

### Data and system contracts touched

- `shop_product`
- `order and shipping-profile events`
- `activism_update`
- `Burro draft and follow-up event history`

## Why

- This sprint adds commercial depth without exploding operational load. A curated shop and a structured activism feed reinforce the brand instead of distracting from it.
- It also aligns with the reality that artisan goods work best when story, scarcity, and follow-on experience drive the sale.
- On the assistant side, follow-up automation creates time savings right when the first public demand signals begin to appear.
- The sprint keeps the project’s conservation identity visible instead of treating activism as an afterthought.

## Review

### Questions to resolve before commit

- What exact first-SKU set should be allowed into the shop: prints only, mixed giftables, or a limited tile-and-pottery collection from day one?
- Should donation handling live directly on the activism pages in this sprint, or wait until the content model is proven stable?
- Do you want Burro follow-up drafts surfaced in an internal queue, or attached directly to booking/workshop records for review?

### Dependencies

- Workshop and stay events from previous sprints
- Payments and email flows
- Shipping policy decisions

### Definition of done

- Customers can browse a curated product line and complete eligible purchases.
- Shipping restrictions are enforced correctly.
- Operators can publish activism updates without developer involvement.
- Burro can generate source-backed follow-up and content drafts within approved bounds.

### What this sprint unlocks next

- Itinerary Builder and Retreat Hosting
- Public Equipment Rental

---

## HYDE PHASE 1 ENHANCEMENT

**Enhanced:** 2026-03-16
**PRD Decisions:** 5
**Workstreams:** 5
**Data Contracts:** 5
**Acceptance Criteria:** 10

---

### PRD Decisions

| ID | Question | Decision | Rationale |
|----|----------|----------|-----------|
| PRD-1.4.1 | First SKU set | Prints, giftables, and print-on-demand only. Defer fragile tile/pottery to proven shipping lane. | Follows incremental scope pattern; proves checkout without fragile-goods operational risk |
| PRD-1.4.2 | Donation handling | External link pattern (scaffold-mode). Donation payment stays off-site until activism content model proven. | Matches scaffold-mode proof pattern from Sprint 1.2/1.3; avoids premature payment integration |
| PRD-1.4.3 | Follow-up drafts | Attach to booking/workshop records with inline review. Drafts surfaced in panels, not separate queue. | Follows BookingPanel/WorkshopPanel consolidation pattern from prior sprints |
| PRD-1.4.4 | Shipping profiles | Pickup-only, parcel, print-on-demand for P1. Freight shipping deferred to later. | Constrains operational scope; complex logistics handled after shop lane proven |
| PRD-1.4.5 | FAQ Burro scope | Follow-up and content-assist only. Full conversational FAQ deferred. | DEC-010 deferred FAQ Burro; this sprint delivers content generation, not interactive conversation |

---

### Workstreams

#### Workstream 1.4.1 — Shop Catalog and Product Pages

| Deliverable | Description |
|-------------|-------------|
| Shop landing page | Public catalog at `/shop` with category filtering |
| Product detail route | Product page at `/shop/[slug]` with images, story, and shipping info |
| Product loader | JSON-backed product data from `website/cms/shop/` |
| Shipping profile display | Clear indication of pickup-only, parcel, or print-on-demand per product |

#### Workstream 1.4.2 — Checkout Flow with Shipping Enforcement

| Deliverable | Description |
|-------------|-------------|
| Cart component | Add-to-cart, quantity control, and cart summary |
| Checkout route | `/shop/checkout` with shipping address capture |
| Shipping validation API | Enforces profile rules (pickup-only cannot ship, fragile blocked in P1) |
| Order capture API | Stores order locally in scaffold-mode; integrates with Stripe scaffold later |
| Order confirmation | Scaffold-mode local capture for order confirmation |

#### Workstream 1.4.3 — Activism Update Feed

| Deliverable | Description |
|-------------|-------------|
| Activism landing enhancement | `/activism` enhanced with live update stream |
| Update CMS content | `website/cms/activism/updates/*.json` with source references |
| Action center | External link cards for petitions, donations, and contact scripts |
| Update detail route | `/activism/updates/[slug]` for deep-dive explainers |

#### Workstream 1.4.4 — Burro Follow-Up Drafts

| Deliverable | Description |
|-------------|-------------|
| Post-stay follow-up generator | Draft thank-you and review-request content from booking record |
| Workshop reminder generator | Draft reminder content from registration record |
| Content template CMS | Templates in `website/cms/burro/templates/` for each follow-up type |
| Draft attachment UI | Draft cards attached to booking/registration records in assistant panels |
| Draft approval flow | Operator review before outbound (scaffold-mode local capture) |

#### Workstream 1.4.5 — CRM Event History Foundation

| Deliverable | Description |
|-------------|-------------|
| Event schema | `GuestEvent` contract for tracking interactions |
| Event store | Local storage for guest events (booking, registration, follow-up sent) |
| Event timeline component | Timeline view attached to guest record in assistant |
| Tagging foundation | Simple tag system for guest categorization |

---

### Data Contracts

```typescript
interface ShopProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'prints' | 'giftables' | 'print-on-demand';
  price: { amount: number; currency: 'USD' };
  images: string[];
  story: string;
  shippingProfile: 'pickup-only' | 'parcel' | 'print-on-demand';
  status: 'available' | 'sold-out' | 'coming-soon' | 'private';
  inventory?: { available: number };
}

interface ShopOrder {
  id: string;
  items: Array<{ productId: string; quantity: number; priceAtOrder: number }>;
  shippingAddress?: { line1: string; line2?: string; city: string; state: string; zip: string };
  shippingProfile: 'pickup-only' | 'parcel' | 'print-on-demand';
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  guestEmail: string;
}

interface ActivismUpdate {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  sourceRefs: Array<{ label: string; url: string }>;
  actions: Array<{ type: 'petition' | 'donation' | 'contact' | 'share'; label: string; url: string }>;
  publishedAt: string;
  category: 'legislative' | 'conservation' | 'community' | 'education';
}

interface BurroFollowUp {
  id: string;
  type: 'post-stay' | 'workshop-reminder' | 'drop-announcement' | 'activism-script';
  templateRef: string;
  contextRef: { type: 'booking' | 'registration'; id: string };
  draftContent: string;
  status: 'draft' | 'approved' | 'sent' | 'cancelled';
  generatedAt: string;
  reviewedAt?: string;
  sentAt?: string;
}

interface GuestEvent {
  id: string;
  guestEmail: string;
  eventType: 'booking' | 'registration' | 'purchase' | 'follow-up-sent' | 'note';
  eventRef?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
  tags?: string[];
}
```

---

### Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Shipping complexity explosion | HIGH | Constrain to three profiles (pickup-only, parcel, print-on-demand); defer freight |
| Payment integration scope | HIGH | Scaffold-mode order capture first; Stripe integration as separate activation |
| Fragile goods operational risk | MEDIUM | Exclude tile/pottery from P1 SKU set; prove shipping lane with low-risk items |
| Follow-up content quality | MEDIUM | Templates are operator-reviewed; no auto-send without approval |
| CRM scope creep | MEDIUM | Event history only; full recommendation engine deferred to Sprint 3.2 |

---

### Acceptance Criteria

1. Customer can browse shop catalog filtered by category
2. Customer can view product detail with story, images, and shipping profile
3. Customer can add items to cart and proceed to checkout
4. Checkout enforces shipping profile rules (pickup-only cannot ship)
5. Order confirmation stored locally in scaffold-mode
6. Operator can publish activism updates via CMS without developer involvement
7. Activism updates display with source references and action links
8. Burro generates post-stay follow-up draft attached to booking record
9. Operator can review and approve follow-up drafts before sending (scaffold-mode capture)
10. Guest events recorded to event store with timeline display

---

### Dependencies

| Dependency | Source | Required For |
|------------|--------|--------------|
| Booking records | Sprint 1.2 | Post-stay follow-up context |
| Registration records | Sprint 1.3 | Workshop reminder context |
| Scaffold-mode confirmation pattern | Sprint 1.2/1.3 | Order confirmation |
| Assistant panel pattern | Sprint 1.2/1.3 | Draft attachment UI |
| CMS content root | Sprint 0.2 | Product and activism content |
| Email template pattern | Sprint 1.2/1.3 | Follow-up template rendering |

---

### Carryover from Earlier Sprints

- **FAQ Burro conversational support** (DEC-010) — Deferred; this sprint delivers content generation only
- **Live email delivery** — Scaffold-mode local capture remains proof path
- **Full payment integration** — Scaffold-mode order capture; Stripe activation deferred

---

### Constraints from PRD Decisions

- **C-1.4.1:** Only prints, giftables, and print-on-demand products in P1 shop
- **C-1.4.2:** No direct on-site donation payment; external links only
- **C-1.4.3:** Follow-up drafts always require operator approval before outbound
- **C-1.4.4:** No freight shipping in P1
- **C-1.4.5:** No conversational FAQ; content generation and templates only

---

## HYDE PHASE 3 APPROVAL

**Approved:** 2026-03-16
**Findings Reviewed:** 7
**Disposition:** ALL ACCEPTED/ACKNOWLEDGED

---

### Findings Disposition

| Finding | Severity | Disposition |
|---------|----------|-------------|
| JF-701 | HIGH | ACCEPT - Local order store with scaffold-mode proof model |
| JF-702 | HIGH | ACCEPT - Keep single-feed pattern, derive detail pages from existing `updates.json` |
| JF-703 | MEDIUM | ACCEPT - Draft cards only on existing panels, thin CRM groundwork |
| JF-704 | MEDIUM | ACCEPT - Single shipping profile per order in Sprint 1.4 |
| JF-705 | MEDIUM | ACCEPT - Normalized email as identity key, append-only events |
| JF-706 | LOW | ACCEPT - Explicit status visibility rules for catalog |
| JF-707 | INFO | ACKNOWLEDGED - P1 boundary preserved |

---

### Amendments

#### A-1.4.1: Local Order Source-of-Truth (JF-701)

Sprint 1.4 proves cart, checkout validation, and local order capture, not provider-backed payment completion.

- Local order store: `website/frontend/lib/shop/store.ts`
- Follows booking/workshop scaffold-mode pattern
- `ShopOrder` persisted locally with status lifecycle: `pending` → `confirmed` → scaffold-mode proof
- No live Stripe checkout; payment integration deferred
- Acceptance language updated: "complete eligible purchases" means local scaffold-mode order capture with confirmation route

#### A-1.4.2: Activism Content Pattern (JF-702)

Keep the existing single-feed pattern. No migration to per-update files.

- Activism content remains in `website/cms/activism/updates.json`
- Detail route `/activism/updates/[slug]` derives content from the single feed
- Loader reads `updates.json` and filters by slug for detail pages
- No new `website/cms/activism/updates/*.json` files needed
- Workstream 1.4.3 deliverable updated: "Update CMS content" means enhancing existing `updates.json` structure

#### A-1.4.3: Draft Attachment Scope (JF-703)

Draft visibility constrained to simple attached draft cards on existing panels.

- Draft cards render inline in `BookingPanel` and `WorkshopPanel`
- No separate draft queue view
- `GuestEvent` timeline is groundwork only—stored but not fully rendered as CRM UI
- Unified guest profile views deferred to Sprint 3.2

#### A-1.4.4: Single Shipping Profile Per Order (JF-704)

Mixed-profile carts are blocked in Sprint 1.4.

- Cart enforces single shipping profile per order
- If user adds items with conflicting profiles, checkout blocked with clear message
- User must remove conflicting items before checkout proceeds
- This keeps cart validation narrow and repo-verifiable

#### A-1.4.5: Guest Identity Model (JF-705)

Normalized email is the Sprint 1.4 guest identity key.

- Guest identity resolved by normalized (lowercased, trimmed) email
- Event history is append-only events plus lightweight tags
- No merged customer profile across multiple contact channels
- Full guest identity consolidation deferred to Sprint 3.2

#### A-1.4.6: Product Status Visibility (JF-706)

Explicit catalog visibility rules for product status:

- `available`: Visible in catalog, purchase enabled
- `sold-out`: Visible in catalog (social proof), purchase disabled
- `coming-soon`: Visible in catalog, purchase disabled, "Coming Soon" badge
- `private`: Hidden from public catalog entirely

#### A-1.4.7: P1 Boundary Preserved (JF-707)

Sprint 1.4 stays within P1 scope:

- Curated SKU lane only (prints, giftables, print-on-demand)
- External donation links only
- Scaffold-mode follow-up drafts with operator approval
- Minimum event-history groundwork for later sprints
- No full CRM, no live payments, no conversational FAQ

---

### Updated Constraints from Amendments

- **C-1.4.6:** Local order store mirrors booking/workshop scaffold-mode pattern
- **C-1.4.7:** Activism content derives from single `updates.json` feed
- **C-1.4.8:** Single shipping profile per order; mixed-profile carts blocked
- **C-1.4.9:** Guest identity by normalized email only
- **C-1.4.10:** Product status visibility rules enforced in catalog
