---
title: "Sprint 1.3 Proposal — Workshops and Equipment Operations Prep"
project: "Big Bend Burro"
sprint_id: "1.3"
phase_id: "P1"
phase_name: "MVP Launch"
status: "APPROVED"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
hyde_enhanced: "2026-03-16"
hyde_approved: "2026-03-16"
jekyll_findings_disposition:
  JF-601: "ACCEPT - Workshop contract supersession explicit"
  JF-602: "ACCEPT - Capacity source-of-truth defined"
  JF-603: "ACCEPT - List-first MVP committed"
  JF-604: "ACCEPT - Intake versioning required"
  JF-605: "ACCEPT - Equipment scope constrained"
  JF-606: "ACCEPT - Session state labels distinct"
  JF-607: "ACKNOWLEDGED - P1 boundary preserved"
---

# Sprint 1.3 Proposal — Workshops and Equipment Operations Prep

## Proposal intent

Launch the workshop operating surface with public catalog, registration, and confirmation flows. Create structured operational groundwork for the equipment rental business before public exposure in P2.

## Proposal basis

- Blueprint P1 build scope includes public workshop pages and calendar, while initial equipment rental workflow is also part of the build scope.
- Feature registry includes photography workshops, craft workshops, and equipment_rental_service with build in P1 and public activation in P2.
- White paper revenue architecture treats workshops as the highest-value margin layer and equipment rental as utility income with a local moat.
- Backlog seed B009 explicitly calls for workshop SKUs, pricing ladders, and intake forms.

---

## HYDE PRD Decisions

### PRD-1.3.1: Unified Calendar with Category Filtering

**Decision:** Craft and photography workshops share one calendar system with unified registration backend. Category filtering allows guests to view "craft only" or "photography only" if desired.

**Rationale:**
- Simpler implementation than parallel calendars
- Shared registration flow reduces code duplication
- Operators manage one schedule instead of two
- Category field enables future filtering without architectural change

### PRD-1.3.2: Waitlist Deferred to Observed Demand

**Decision:** Waitlists are deferred until real demand is observed. MVP shows "Registration closed" when capacity is reached.

**Rationale:**
- Waitlist logic adds notification complexity
- Workshops are intentionally small and curated
- If demand warrants, add waitlist in Sprint 1.4 or later
- Simple closure state is honest and premium-feeling

### PRD-1.3.3: Internal Equipment Scheduler (No External Platform in P1)

**Decision:** Equipment scheduler is fully internal with JSON-based asset and reservation records. Booqable or similar platform integration deferred to P2 public activation sprint.

**Rationale:**
- Keeps P1 scope contained
- Operators can test scheduling logic without external dependencies
- Asset/reservation data model will be compatible with future platform sync
- Avoids API credential complexity in MVP

### PRD-1.3.4: Workshop Registration Follows Booking Handoff Pattern

**Decision:** Workshop registration reuses the waiver-capture and confirmation patterns from Sprint 1.2. Guest completes waiver, submits registration, receives confirmation (scaffold-mode local capture until email provider activated).

**Rationale:**
- Proven pattern from lodging booking flow
- Consistent guest experience across booking and registration
- Scaffold-mode confirmation avoids external dependency in MVP

### PRD-1.3.5: Intake Forms Are Workshop-Type Specific

**Decision:** Each workshop type defines its own intake schema. Craft workshops ask about experience level and material preferences. Photography workshops ask about equipment and mobility.

**Rationale:**
- Tile-making and dark-sky photography have different prep needs
- Operators can customize intake per workshop
- Intake schema stored alongside workshop definition in CMS

---

## What

### In scope

- Build the public workshop catalog page structure, calendar presentation, workshop detail templates, and registration flow.
- Create the operator-side workshop content in `website/cms/workshops/` for dates, capacity, price, materials, and publish status.
- Implement type-specific intake forms, waiver support, and guest instructions for craft and photography offerings.
- Model the internal equipment rental asset set, availability, maintenance notes, and scheduling logic without launching public booking yet.

### Deliverables

See workstreams below for concrete deliverables.

### Out of scope

- No public equipment rental checkout or inspection workflow yet (P2).
- No retreat hosting logic beyond what is needed to avoid future rework.
- No full itinerary bundling yet.
- No waitlist functionality.
- No external calendar sync (Google Calendar, iCal export).
- No payment processing for workshop registration (deposit handling deferred to P2).

---

## Workstreams

### Workstream 1.3.1 — Workshop Catalog and Public Pages

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Workshop catalog page | `website/frontend/app/workshops/page.tsx` | Replace route stub with full catalog |
| Workshop detail route | `website/frontend/app/workshops/[slug]/page.tsx` | Dynamic workshop page |
| Workshop card component | `website/frontend/components/workshop/WorkshopCard.tsx` | Card for catalog grid |
| Workshop calendar component | `website/frontend/components/workshop/WorkshopCalendar.tsx` | Monthly/list view of upcoming workshops |
| Category filter component | `website/frontend/components/workshop/CategoryFilter.tsx` | Craft/photography/all toggle |
| Workshop content loader | `website/frontend/lib/content/workshops.ts` | Load from `website/cms/workshops/` |

### Workstream 1.3.2 — Workshop CMS Content

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Workshop schema | `website/cms/workshops/schema.json` | JSON schema for validation |
| Craft workshop seed | `website/cms/workshops/tile-making-intro.json` | Sample craft workshop |
| Photography workshop seed | `website/cms/workshops/dark-sky-photography.json` | Sample photography workshop |
| Workshop waiver template | `website/cms/waivers/workshop-waiver.md` | MDX waiver content |
| Craft intake schema | `website/cms/workshops/intake/craft.json` | Intake questions for craft workshops |
| Photography intake schema | `website/cms/workshops/intake/photography.json` | Intake questions for photography workshops |

### Workstream 1.3.3 — Registration Flow

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Registration page | `website/frontend/app/workshops/[slug]/register/page.tsx` | Registration funnel |
| Intake form component | `website/frontend/components/workshop/IntakeForm.tsx` | Dynamic intake based on workshop type |
| Workshop waiver component | `website/frontend/components/workshop/WorkshopWaiver.tsx` | Reuses waiver pattern from 1.2 |
| Registration submit component | `website/frontend/components/workshop/RegistrationSubmit.tsx` | Submit and confirmation display |
| Registration API | `website/frontend/app/api/workshop/register/route.ts` | Captures registration locally |
| Workshop waiver API | `website/frontend/app/api/workshop/waiver/route.ts` | Captures waiver acknowledgement |

### Workstream 1.3.4 — Registration Confirmation and Notifications

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Registration store | `website/frontend/lib/workshop/store.ts` | Local persistence for registrations |
| Confirmation email template | `website/cms/emails/workshop-confirmation.mjml` | Scaffold-mode email template |
| Confirmation email helper | `website/frontend/lib/workshop/confirmation.ts` | Renders template, logs locally |
| Operator notification logger | `website/frontend/lib/workshop/operator-notify.ts` | Logs registration for operator visibility |
| Registration confirmation page | `website/frontend/app/workshops/[slug]/register/confirmation/page.tsx` | Post-registration confirmation |

### Workstream 1.3.5 — Internal Equipment Scheduler

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Equipment asset schema | `website/cms/equipment/schema.json` | JSON schema for assets |
| Equipment asset seeds | `website/cms/equipment/*.json` | 2-3 sample equipment assets |
| Equipment loader | `website/frontend/lib/content/equipment.ts` | Load assets from CMS |
| Reservation schema | `data/equipment-reservations/schema.json` | Local reservation records |
| Reservation store | `website/frontend/lib/equipment/store.ts` | Local CRUD for reservations |
| Equipment dashboard page | `website/frontend/app/assistant/equipment/page.tsx` | Internal operator view |
| Equipment calendar component | `website/frontend/components/equipment/AvailabilityCalendar.tsx` | Shows availability grid |
| Maintenance notes component | `website/frontend/components/equipment/MaintenanceNotes.tsx` | Shows/edits maintenance log |

### Workstream 1.3.6 — Operator Visibility

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Workshop registration panel | `website/frontend/components/assistant/WorkshopPanel.tsx` | Shows recent registrations |
| Assistant shell update | `website/frontend/app/assistant/page.tsx` | Add workshop panel alongside booking panel |

---

## Data Contracts

### WorkshopProgram

```typescript
interface WorkshopProgram {
  slug: string;
  title: string;
  category: 'craft' | 'photography';
  description: string;
  instructorName: string;
  instructorBio?: string;
  heroImage?: string;
  duration: {
    hours: number;
    format: 'single-session' | 'multi-day';
  };
  capacity: {
    min: number;
    max: number;
  };
  pricing: {
    basePrice: number;
    depositRequired?: number;
    materialsIncluded: boolean;
    materialsFee?: number;
  };
  schedule: WorkshopSession[];
  status: 'draft' | 'published' | 'archived';
  intakeSchemaRef: string; // e.g., "craft" or "photography"
  waiverRequired: boolean;
  specialInstructions?: string;
  shippingFollowUp?: {
    required: boolean;
    description?: string;
  };
}

interface WorkshopSession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  spotsAvailable: number;
  status: 'open' | 'full' | 'cancelled';
}
```

### WorkshopRegistration

```typescript
interface WorkshopRegistration {
  id: string;
  workshopSlug: string;
  sessionId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  intakeResponses: Record<string, string | number | boolean>;
  waiverAcknowledgedAt: string; // ISO timestamp
  registeredAt: string; // ISO timestamp
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationSent: boolean;
  notes?: string;
}
```

### EquipmentAsset

```typescript
interface EquipmentAsset {
  id: string;
  name: string;
  category: 'camera' | 'telescope' | 'outdoor-gear' | 'craft-supplies';
  description: string;
  dailyRate: number;
  depositRequired: number;
  status: 'available' | 'reserved' | 'maintenance' | 'retired';
  maintenanceLog: MaintenanceEntry[];
  images?: string[];
}

interface MaintenanceEntry {
  date: string; // YYYY-MM-DD
  description: string;
  resolvedAt?: string;
}
```

### EquipmentReservation

```typescript
interface EquipmentReservation {
  id: string;
  assetId: string;
  reservedBy: string; // operator name or "internal"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  purpose: string;
  status: 'tentative' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}
```

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Workshop capacity tracking complexity | MEDIUM | Simple session-level spot count; no complex waitlist |
| Intake form sprawl | LOW | Constrain to two intake schemas (craft, photography) for MVP |
| Equipment scheduler scope creep | MEDIUM | Internal-only view; no public booking in this sprint |
| Email confirmation delivery | LOW | Scaffold-mode local capture until provider activated |
| Calendar UI complexity | MEDIUM | Start with list view; calendar grid is enhancement |

---

## Acceptance Criteria

### AC-1.3.1: Workshop Catalog
Guests can view a catalog of published workshops at `/workshops` with category filtering.

### AC-1.3.2: Workshop Detail
Guests can view workshop details including description, instructor, schedule, capacity, and pricing at `/workshops/[slug]`.

### AC-1.3.3: Workshop Registration
Guests can register for an open session by completing intake form and waiver acknowledgement.

### AC-1.3.4: Intake Type Specificity
Craft workshops show craft-specific intake questions; photography workshops show photography-specific intake questions.

### AC-1.3.5: Registration Confirmation
After successful registration, guest sees confirmation page and confirmation email is captured locally (scaffold-mode).

### AC-1.3.6: Capacity Enforcement
When a session reaches max capacity, registration shows "Registration closed" instead of intake form.

### AC-1.3.7: Operator Workshop Visibility
Operators can view recent workshop registrations in the assistant shell via WorkshopPanel.

### AC-1.3.8: Equipment Asset Management
Operators can view equipment assets, availability calendar, and maintenance notes at `/assistant/equipment`.

### AC-1.3.9: Equipment Reservation CRUD
Operators can create, view, and cancel internal equipment reservations.

### AC-1.3.10: Quality Gates
`pnpm lint`, `pnpm typecheck`, and `pnpm build` pass with no errors.

---

## Dependencies

- Sprint 1.1: Public site and content model (COMPLETE)
- Sprint 1.2: Waiver capture pattern and confirmation flow (COMPLETE)
- Sprint 0.3: Integration scaffolding and assistant shell (COMPLETE)

---

## Definition of done

- Operators can publish or unpublish workshops by editing CMS files without developer help.
- Guests can register for a workshop and provide the required intake information.
- Workshop confirmation is generated and captured locally in scaffold-mode.
- Internal equipment scheduling is functional enough to test timing, inventory, and maintenance workflows.
- All acceptance criteria pass.
- Quality gates pass.

---

## What this sprint unlocks next

- Sprint 1.4: Shop, Activism, and Assistant Enhancements
- Sprint 2.1: Itinerary Builder and Retreat Hosting
- Sprint 2.2: Public Equipment Rental (activates internal scheduler built here)

---

## HYDE Amendments (PHASE 3 Approval)

**Approved:** 2026-03-16
**Findings Reviewed:** `Sprints/Reviews/SPRINT_1_3_JEKYLL_FINDINGS.md`

### Amendment A-1.3.1: Workshop Content Model Supersession (addresses JF-601)

**ACCEPT - Required change implemented**

Sprint 1.3 explicitly supersedes the existing workshop shell model. The old `Workshop` contract in `website/frontend/lib/content/types.ts` and the `workshops` entry in `lib/content/config.ts` will be **replaced** by the new JSON-backed `WorkshopProgram` structure.

**Implementation requirements:**
1. Remove or deprecate the existing `Workshop` type from `lib/content/types.ts`
2. Update `lib/content/config.ts` to point to JSON-based workshop loader
3. Replace MDX shell in `website/cms/workshops/` with JSON program files
4. New canonical contract is `WorkshopProgram` and `WorkshopSession` as defined in this proposal

### Amendment A-1.3.2: Registration Capacity Source-of-Truth (addresses JF-602)

**ACCEPT - Required change implemented**

The source-of-truth for workshop capacity follows a **CMS-authored with local decrement** model:

1. **`capacity.max`** is CMS-authored in `WorkshopProgram` and is immutable during a session
2. **`spotsAvailable`** is initialized from `capacity.max` when a session is first created
3. **Local registration records decrement `spotsAvailable`** on successful registration capture
4. **Single-writer rule:** Only the registration API (`/api/workshop/register/route.ts`) may decrement `spotsAvailable`
5. **Operators may manually adjust** `spotsAvailable` via CMS edit for corrections (e.g., phone registrations, cancellations)

This is a **local single-writer model** suitable for scaffold-mode MVP, not a concurrency-safe production scheduler. The acceptance criteria for AC-1.3.6 (Capacity Enforcement) is repo-verifiable by checking that `spotsAvailable <= 0` triggers "Registration closed" UI state.

### Amendment A-1.3.3: Calendar MVP Scope Constraint (addresses JF-603)

**ACCEPT - Recommended change implemented**

The committed MVP calendar view is **list-first**:

1. `WorkshopCalendar.tsx` renders as a **chronological list of upcoming sessions** for Sprint 1.3
2. Month-grid view is **optional polish** only if core registration flow is stable before sprint close
3. Acceptance criteria AC-1.3.1 and AC-1.3.2 are satisfied by list view alone
4. If grid is not delivered, it becomes carryover for Sprint 1.4

### Amendment A-1.3.4: Intake Schema Versioning (addresses JF-604)

**ACCEPT - Recommended change implemented**

Each intake schema uses **stable question IDs** and **version tracking**:

1. Intake schema files (`cms/workshops/intake/craft.json`, `cms/workshops/intake/photography.json`) must include:
   - `schemaVersion: string` (e.g., "1.0.0")
   - Each question has a stable `questionId: string` (e.g., "craft_experience_level")
2. `WorkshopRegistration.intakeResponses` stores answers keyed by `questionId`
3. `WorkshopRegistration` gains a new field: `intakeSchemaVersion: string`
4. Registration API captures schema version at registration time

**Updated WorkshopRegistration contract:**
```typescript
interface WorkshopRegistration {
  id: string;
  workshopSlug: string;
  sessionId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  intakeSchemaRef: string; // e.g., "craft" or "photography"
  intakeSchemaVersion: string; // e.g., "1.0.0"
  intakeResponses: Record<string, string | number | boolean>; // keyed by questionId
  waiverAcknowledgedAt: string;
  registeredAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationSent: boolean;
  notes?: string;
}
```

### Amendment A-1.3.5: Equipment Scheduler Scope Constraint (addresses JF-605)

**ACCEPT - Recommended change implemented**

Sprint 1.3 equipment scheduler is constrained to **read-mostly asset visibility** plus **simple reservation CRUD**:

**In scope for Sprint 1.3:**
1. Equipment asset listing with status display
2. Basic availability calendar (read-only date highlighting)
3. Reservation create and cancel operations
4. Simple maintenance log viewing

**Explicitly deferred to later sprint:**
1. Rich maintenance editing UI
2. Advanced calendar interactions (drag-drop, multi-select)
3. Reservation modification (edit in place)
4. Conflict detection beyond basic date overlap

If workshop registration work runs long, equipment scope may be further reduced to asset visibility only, with reservation CRUD as carryover.

### Amendment A-1.3.6: Session State Labels (addresses JF-606)

**ACCEPT - Recommended change implemented**

Public UI distinguishes between `full` and `cancelled` session states:

| Session Status | Public Label | UI Treatment |
|----------------|--------------|--------------|
| `open` | "Register Now" | Active registration button |
| `full` | "Registration Full" | Disabled button, no waitlist |
| `cancelled` | "Session Cancelled" | Strikethrough date, no button |

Generic "Registration closed" is **not used**. Each state has its own label for operational clarity.

### Amendment A-1.3.7: P1 Boundary Preservation (addresses JF-607)

**ACKNOWLEDGED**

Sprint 1.3 maintains the P1 boundary:
- Public workshop launch with catalog and registration
- Internal equipment operations prep (no public rental)
- Scaffold-mode confirmation only (no live email provider)
- No waitlists, payment processing, or external calendar sync

---

## Findings Disposition Summary

| Finding | Severity | Disposition |
|---------|----------|-------------|
| JF-601 | HIGH | ACCEPT - Workshop model supersession explicit |
| JF-602 | HIGH | ACCEPT - Capacity source-of-truth defined |
| JF-603 | MEDIUM | ACCEPT - List-first MVP committed |
| JF-604 | MEDIUM | ACCEPT - Intake versioning required |
| JF-605 | MEDIUM | ACCEPT - Equipment scope constrained |
| JF-606 | LOW | ACCEPT - Session state labels distinct |
| JF-607 | INFO | ACKNOWLEDGED - P1 boundary preserved |

**Approval Status:** APPROVED with amendments
**Ready for:** JEKYLL PHASE 4 (IMPLEMENT)
