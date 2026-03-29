---
title: "Sprint 2.1 Proposal — Itinerary Builder and Retreat Hosting"
project: "Big Bend Burro"
sprint_id: "2.1"
phase_id: "P2"
phase_name: "Expansion"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 2.1 Proposal — Itinerary Builder and Retreat Hosting

## Proposal intent

Turn separate lodging, workshop, and experience pieces into packaged multi-step offerings that Burro can assemble for review, sell more coherently, and support for small groups and retreats.

## Proposal basis

- Blueprint P2 build scope includes itinerary builder and retreat hosting logic, with Burro able to assemble a multi-step itinerary draft for review.
- Feature registry includes weekend_cruise_itinerary_builder and retreat_hosting.
- White paper envisions weekend-cruise-style package building and group experiences after the initial guest flows are stable.
- Tourism research shows the region is strong for all-inclusive bundles, closure-substitution products, stargazing, and curated partner-led experiences.

## What

### In scope

- Create the itinerary-builder experience that lets the team or a guest assemble stays, workshops, and partner activities into one draft plan.
- Add the internal review and approval loop for Burro-generated itinerary drafts.
- Implement retreat and group-booking structures such as blocks of units, shared schedules, group pricing support, and facilitator notes.
- Prepare the system to support premium packages rather than only single bookings.

### Deliverables

- Plan/build page or internal-first itinerary composer.
- Burro itinerary assembly module with review queue.
- Group and retreat booking data structures.
- Operator controls for package composition, overrides, and capacity management.

### Out of scope

- No full dynamic-optimization engine or recommendation science yet.
- No automated partner confirmation without operator approval.
- No assumption that every product can be bundled cleanly.

## How

### Implementation approach

1. Use a composable package model rather than a single giant custom object. Lodging, workshop seats, partner experiences, and add-ons should stay individually addressable.
2. Let Burro assemble draft itineraries from approved products and current constraints, but require operator review before anything becomes a commitment.
3. Create a clear group-booking abstraction so retreat facilitators can be handled differently from individual travelers.
4. Track package dependencies explicitly: date fit, capacity, waiver requirements, meeting point, and staffing constraints.
5. Present the itinerary output as a shareable draft that can move between internal review and guest-facing refinement.
6. Keep fallback paths available. If one bundle element fails, the system should degrade to a reviewed alternate, not silently rebook something.

### Data and system contracts touched

- `experience_product bundle records`
- `group/retreat booking object`
- `itinerary draft and review status`
- `Burro orchestration event logs`

## Why

- This sprint is what turns the business from ‘a set of pages’ into an experience platform.
- It also creates the bridge between the project’s story and its pricing power: curated packages sell the combination of place, guidance, and timing.
- Group and retreat support is important because those bookings can raise revenue without multiplying unit count.
- The sprint fits the white paper’s rule that custom orchestration becomes worthwhile only after the first guest flows are proven.

## Review

### Questions to resolve before commit

- Should the itinerary builder ship internal-first for operator use before it becomes guest-facing?
- What counts as a valid package in the first version: stay + one experience, or full multi-day bundles?
- Do you want retreats handled as a special package type or as a separate booking domain from day one?

### Dependencies

- Stable stay and workshop systems
- Partner/service catalog decisions
- Burro retrieval and draft infrastructure

### Definition of done

- Burro can assemble a multi-step itinerary draft from available products.
- Operators can review, edit, approve, and decline itinerary drafts.
- Group or retreat bookings can reserve capacity across multiple components.
- Package logic respects seasonality, safety, and availability constraints.

### What this sprint unlocks next

- Public Equipment Rental
- Partner Marketplace and Task Orchestration

---

## HYDE PHASE 1 ENHANCEMENT

**Enhanced:** 2026-03-16
**PRD Decisions:** 6
**Workstreams:** 5
**Data Contracts:** 5
**Acceptance Criteria:** 12

---

### PRD Decisions

| ID | Question | Decision | Rationale |
|----|----------|----------|-----------|
| PRD-2.1.1 | Itinerary builder audience | Internal-first (operator use). Public guest-facing version deferred to Sprint 2.3 or later. | Follows R1_ASSISTED pattern; operators learn the tool before guests use it. Reduces scope risk. |
| PRD-2.1.2 | Valid package definition | Minimum viable package = stay + 1 experience OR workshop + 1 add-on. Multi-day bundles allowed but not required. | Proves composition model without mandating complex multi-day builds from day one. |
| PRD-2.1.3 | Retreat vs package domain | Retreats are a special package type with group metadata, not a separate booking domain. | Single composition model; retreat-specific fields (facilitator, group name, deposit rules) attached to package. |
| PRD-2.1.4 | Burro assembly scope | Burro can draft itineraries from CMS content; all drafts require operator approval before becoming bookable. | Matches follow-up draft approval pattern from Sprint 1.4; no autonomous booking creation. |
| PRD-2.1.5 | Partner experience handling | Partner experiences added as catalog entries with `delivery_model: partner_led`. No automated partner confirmation. | External partner coordination stays manual in P2; future automation deferred to Sprint 2.4. |
| PRD-2.1.6 | Capacity reservation model | Package reservation creates provisional holds on component capacity; holds expire or convert on package approval. | Prevents overbooking during draft review; matches workshop capacity pattern from Sprint 1.3. |

---

### Workstreams

#### Workstream 2.1.1 — Experience Catalog Foundation

| Deliverable | Description |
|-------------|-------------|
| Experience content model | `ExperienceProduct` type in `website/cms/experiences/` |
| Experience loader | JSON-backed loader for experience catalog |
| Public experiences route | `/experiences` catalog with category filtering |
| Experience detail route | `/experiences/[slug]` with partner attribution, seasonality, and waiver info |
| Experience status rules | `available`, `seasonal`, `coming-soon`, `private` visibility controls |

#### Workstream 2.1.2 — Itinerary Composition Engine

| Deliverable | Description |
|-------------|-------------|
| Itinerary draft type | `ItineraryDraft` contract with component references |
| Composition rules | Validation for date fit, capacity, waiver requirements, meeting points |
| Conflict detection | Identify overlapping schedules, incompatible experiences, capacity exhaustion |
| Draft persistence | Local store for itinerary drafts under `data/itineraries/` |
| Fallback suggestions | When primary component unavailable, surface alternatives |

#### Workstream 2.1.3 — Operator Itinerary Composer

| Deliverable | Description |
|-------------|-------------|
| Composer UI | Internal `/assistant/itinerary` route for building itineraries |
| Component picker | Select lodging, workshops, experiences for date range |
| Pricing aggregator | Sum component prices with package-level adjustments |
| Review controls | Approve, edit, or decline drafted itineraries |
| Shareable draft output | Generate PDF or link for guest review |

#### Workstream 2.1.4 — Retreat and Group Booking

| Deliverable | Description |
|-------------|-------------|
| Group booking type | `GroupBooking` contract with facilitator, participant count, deposit rules |
| Unit block holds | Reserve multiple lodging units for group dates |
| Shared schedule view | Calendar showing all group activities across components |
| Facilitator notes | Operator-visible notes attached to group bookings |
| Group pricing rules | CMS-configured discounts for group sizes |

#### Workstream 2.1.5 — Burro Itinerary Assembly

| Deliverable | Description |
|-------------|-------------|
| Assembly prompt | Burro module for generating itinerary suggestions from guest preferences |
| Constraint awareness | Burro respects seasonality, availability, safety levels, waiver requirements |
| Draft generation | Burro outputs `ItineraryDraft` objects for operator review |
| Approval workflow | Drafts enter operator queue; same pattern as follow-up drafts |
| Assembly templates | CMS templates for common itinerary types (weekend getaway, photography retreat, etc.) |

---

### Data Contracts

```typescript
interface ExperienceProduct {
  id: string;
  slug: string;
  name: string;
  category: 'river' | 'stargazing' | 'craft' | 'mining_history' | 'boquillas_partner' | 'offroad' | 'wellness' | 'touring';
  deliveryModel: 'owned' | 'partner_led' | 'guide_led' | 'self_guided';
  partnerRef?: string;
  meetingPoint: string;
  durationHours: number;
  priceUsd: number;
  seasonality: {
    available: string[]; // months like "jan", "feb", etc.
    peakMonths?: string[];
    unavailable?: string[];
  };
  safetyLevel: 'low' | 'medium' | 'high';
  waiverRequired: boolean;
  status: 'available' | 'seasonal' | 'coming-soon' | 'private';
  description: string;
  images: string[];
}

interface ItineraryDraft {
  id: string;
  title: string;
  dateRange: { start: string; end: string };
  components: Array<{
    type: 'lodging' | 'workshop' | 'experience';
    refId: string;
    dates: string[];
    quantity: number;
    priceAtDraft: number;
    holdStatus: 'pending' | 'held' | 'released' | 'confirmed';
  }>;
  totalPrice: number;
  packageAdjustment?: { type: 'discount' | 'surcharge'; amount: number; reason: string };
  status: 'draft' | 'pending_review' | 'approved' | 'declined' | 'expired';
  guestEmail?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

interface GroupBooking {
  id: string;
  groupName: string;
  facilitator: {
    name: string;
    email: string;
    phone?: string;
  };
  participantCount: number;
  itineraryRef: string;
  depositRules: {
    required: boolean;
    amount?: number;
    dueBy?: string;
  };
  unitHolds: Array<{
    unitId: string;
    dates: string[];
    status: 'held' | 'confirmed' | 'released';
  }>;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface PackagePricingRule {
  id: string;
  name: string;
  triggerType: 'min_nights' | 'group_size' | 'seasonal' | 'component_combo';
  triggerValue: number | string;
  adjustmentType: 'percentage_discount' | 'fixed_discount' | 'fixed_surcharge';
  adjustmentValue: number;
  applicableTo: 'all' | 'lodging' | 'experiences' | 'workshops';
  validFrom?: string;
  validTo?: string;
}

interface CapacityHold {
  id: string;
  componentType: 'lodging' | 'workshop' | 'experience';
  componentId: string;
  itineraryRef: string;
  dates: string[];
  quantity: number;
  holdStatus: 'active' | 'converted' | 'expired' | 'released';
  expiresAt: string;
  createdAt: string;
}
```

---

### Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Composition complexity explosion | HIGH | MVP package = stay + 1 component; multi-day complexity is optional |
| Capacity double-booking | HIGH | Provisional holds with expiration; single-writer pattern per component |
| Partner coordination lag | MEDIUM | No automated partner confirmation; manual coordination explicit in workflow |
| Operator learning curve | MEDIUM | Internal-first launch; operators practice before guest exposure |
| Burro hallucination risk | MEDIUM | All Burro drafts require approval; no autonomous package creation |
| Seasonality conflicts | MEDIUM | Validation rules enforce experience availability by month |

---

### Acceptance Criteria

1. Operator can view experience catalog filtered by category at `/experiences`
2. Operator can view experience detail with partner attribution and seasonality info
3. Operator can create itinerary draft from lodging + experience components
4. Composition engine validates date fit and capacity before allowing draft creation
5. Capacity holds created for draft components; holds expire after 72 hours if not approved
6. Operator can review, edit, approve, or decline itinerary drafts in assistant
7. Approved itinerary generates local confirmation artifact (scaffold-mode)
8. Operator can create group booking with facilitator info and unit block holds
9. Group pricing rules apply package-level discounts based on CMS configuration
10. Burro can generate itinerary suggestions from guest preference prompts
11. Burro drafts enter operator review queue; no autonomous package creation
12. Shareable draft output available as PDF or link for guest review

---

### Dependencies

| Dependency | Source | Required For |
|------------|--------|--------------|
| Lodging catalog and booking flow | Sprint 1.2 | Package composition with stays |
| Workshop registration system | Sprint 1.3 | Package composition with workshops |
| Assistant panel pattern | Sprints 1.2-1.4 | Itinerary composer UI |
| Follow-up approval pattern | Sprint 1.4 | Burro draft approval workflow |
| Scaffold-mode confirmation | Sprints 1.2-1.4 | Package confirmation proof |
| CMS content root | Sprint 0.2 | Experience catalog content |

---

### Carryover from Earlier Sprints

- **FAQ Burro conversational support** (DEC-010) — Still deferred; Sprint 2.1 delivers itinerary assembly, not guest conversation
- **Live payment integration** — Scaffold-mode local capture remains proof path
- **Full CRM/guest profile** — Deferred to Sprint 3.2; guest events from packages added to existing event store

---

### Constraints from PRD Decisions

- **C-2.1.1:** Itinerary builder is internal-only in Sprint 2.1
- **C-2.1.2:** MVP package requires minimum 2 components (lodging + experience or workshop + add-on)
- **C-2.1.3:** Retreats are packages with group metadata, not separate domain
- **C-2.1.4:** All Burro-generated itineraries require operator approval
- **C-2.1.5:** Partner experiences are catalog entries; no automated partner API
- **C-2.1.6:** Capacity holds expire after 72 hours if not approved

---

### Phase 2 Context

Sprint 2.1 begins Phase 2 (Expansion). Key differences from Phase 1:

| P1 Pattern | P2 Evolution |
|------------|--------------|
| Single-item booking (lodging, workshop, shop) | Multi-component package composition |
| Guest-initiated flows | Operator-initiated package building (internal-first) |
| Individual guest records | Group booking with facilitator abstraction |
| Static pricing per item | Package-level pricing rules and adjustments |
| Burro follow-up drafts | Burro itinerary assembly |

The itinerary builder creates the foundation for premium, bundled offerings that differentiate Big Bend Burro from simple lodging directories. It also enables retreat hosting, which can generate higher revenue per booking without requiring more lodging units.

---

### Research Context

From `Big_Bend_Terlingua_Tourism_Encyclopedia.md`:
- Big Bend tourism supports bundled products combining lodging, river trips, stargazing, and guided experiences
- Spring peak and fall-winter shoulder create strong windows for multi-day packages
- Chisos Basin closure (May 2026) creates substitution opportunities for gateway operators
- Stargazing, birding, and heritage tourism are underserved relative to demand

From `Big_Bend_Glamping_Economics_and_Seasonality_Canonical.md`:
- Premium packages can command higher ADR than standalone lodging
- Seasonality makes package composition valuable (fill shoulder periods with experience bundles)
- Group/retreat bookings raise revenue without unit expansion

Blueprint feature references:
- F001: weekend_cruise_itinerary_builder (build P1, activate P2)
- F011: retreat_hosting (build P1, activate P2)
- assistant.guest.itinerary_builder module

---

## HYDE PHASE 3 APPROVAL

**Approved:** 2026-03-16
**Jekyll Review:** `Sprints/Reviews/SPRINT_2_1_JEKYLL_FINDINGS.md`
**Findings Reviewed:** 7
**Severity Summary:** CRITICAL: 0, HIGH: 1, MEDIUM: 3, LOW: 1, INFO: 2

---

### Findings Disposition

| Finding | Severity | Decision | Notes |
|---------|----------|----------|-------|
| JF-801 | HIGH | ACCEPT | Sprint scope narrowed to internal-first proof; no public self-serve itinerary builder |
| JF-802 | MEDIUM | ACCEPT | Explicit contract supersession and canonical paths required |
| JF-803 | MEDIUM | ACCEPT | Local CapacityHold store with expiry-on-read/write; no background scheduler |
| JF-804 | MEDIUM | ACCEPT | `/assistant/itinerary` extends existing assistant shell pattern |
| JF-805 | LOW | ACCEPT | Quality gates: lint, typecheck, build; test is N/A |
| JF-806 | INFO | ACKNOWLEDGED | Internal-first is correct operator fit |
| JF-807 | INFO | ACKNOWLEDGED | Retreats as package subtype is right domain boundary |

---

### Approved Amendments

| Amendment | Description |
|-----------|-------------|
| A-2.1.1 | Sprint 2.1 remains internal-first end-to-end; no public self-serve itinerary builder |
| A-2.1.2 | Shareable output is permalink or printable HTML summary first; PDF is optional polish |
| A-2.1.3 | `ExperienceProduct` supersedes the legacy generic experience shell as the canonical experience contract |
| A-2.1.4 | `CapacityHold` uses a local single-writer scaffold model with expiry-on-read/write, not a background job |
| A-2.1.5 | `/assistant/itinerary` extends the current assistant shell and reuses existing approval semantics |
| A-2.1.6 | Quality gates: `pnpm lint`, `pnpm typecheck`, `pnpm build`; `pnpm test` is N/A unless introduced |

---

### Updated Constraints (Post-Amendment)

- **C-2.1.1:** Itinerary builder is internal-only in Sprint 2.1 (no public self-serve)
- **C-2.1.2:** MVP package requires minimum 2 components (lodging + experience or workshop + add-on)
- **C-2.1.3:** Retreats are packages with group metadata, not separate domain
- **C-2.1.4:** All Burro-generated itineraries require operator approval
- **C-2.1.5:** Partner experiences are catalog entries; no automated partner API
- **C-2.1.6:** Capacity holds expire after 72 hours if not approved
- **C-2.1.7:** (NEW) Shareable draft output is permalink/HTML first; PDF is optional polish
- **C-2.1.8:** (NEW) Canonical contract paths must be defined before implementation

---

### Canonical Contract Paths (Per A-2.1.3)

| Contract | Canonical Path |
|----------|----------------|
| `ExperienceProduct` | `website/frontend/lib/experience/types.ts` |
| `ItineraryDraft` | `website/frontend/lib/itinerary/types.ts` |
| `GroupBooking` | `website/frontend/lib/itinerary/types.ts` |
| `PackagePricingRule` | `website/frontend/lib/itinerary/types.ts` |
| `CapacityHold` | `website/frontend/lib/itinerary/types.ts` |

The generic `Experience` type in `website/frontend/lib/content/types.ts` is superseded by `ExperienceProduct` for experience catalog content.

---

### Updated Acceptance Criteria (Post-Amendment)

1. Operator can view experience catalog filtered by category at `/experiences`
2. Operator can view experience detail with partner attribution and seasonality info
3. Operator can create itinerary draft from lodging + experience components
4. Composition engine validates date fit and capacity before allowing draft creation
5. Capacity holds created for draft components; holds expire after 72 hours if not approved (expiry-on-read/write)
6. Operator can review, edit, approve, or decline itinerary drafts in assistant (via `/assistant/itinerary` child route)
7. Approved itinerary generates local confirmation artifact (scaffold-mode)
8. Operator can create group booking with facilitator info and unit block holds
9. Group pricing rules apply package-level discounts based on CMS configuration
10. Burro can generate itinerary suggestions from guest preference prompts
11. Burro drafts enter operator review queue; no autonomous package creation
12. Shareable draft output available as printable HTML or permalink (PDF is optional polish)

---

### Quality Gates

| Gate | Status |
|------|--------|
| `pnpm lint` | Required (PASS) |
| `pnpm typecheck` | Required (PASS) |
| `pnpm build` | Required (PASS) |
| `pnpm test` | N/A (no test runner) |

---

### Sprint Status

**Status:** APPROVED
**Next Actor:** JEKYLL (implementation)
**Handoff:** 2026-03-16
