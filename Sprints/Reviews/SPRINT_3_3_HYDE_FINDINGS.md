# Sprint 3.3 HYDE Review Findings

**Sprint:** 3.3 - Partner Network Expansion and Event Operations
**Reviewer:** HYDE (Critical Review Agent)
**Review Date:** 2026-03-19
**Proposal:** `Sprints/Proposals/14_sprint_3_3_partner_network_expansion_and_event_operations.md`

---

## Executive Summary

Sprint 3.3 proposes expanding the partner network into a mature operating program and adding annual/seasonal event operations capability. This is the capstone sprint that hardens the platform for durable operation.

The proposal correctly frames this as institutional maturity rather than feature addition. However, implementation requires explicit governance rule schemas, event operations types, and runbook artifact specifications.

**Disposition:** APPROVED WITH AMENDMENTS

---

## Findings

### HF-3301: Partner Governance Rule Schema

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal lists governance components without schema:
- Approval criteria
- Revenue rules (already partially defined in A-2.4.6)
- Content standards
- Liability requirements
- Offboarding paths

Sprint 2.4 establishes `PartnerRecord` and `CommissionRule`. Sprint 3.3 needs to extend this with:
- Partner tier system
- Content review requirements per tier
- Liability insurance thresholds
- Performance metrics and suspension triggers

**Recommendation:** Define `PartnerGovernance` schema:
- `tier: 'starter' | 'standard' | 'premium'`
- `contentReviewRequired: boolean` (based on tier)
- `insuranceRequired: boolean`
- `insuranceMinimum: number | null`
- `performanceThresholds: { metric: string; minimum: number }[]`
- `suspensionTriggers: string[]`
- `offboardingNotice: { days: number }`

---

### HF-3302: Event Operations Object Schema

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "event objects and scheduling flows" for multi-day gatherings without specifying:
- Event type enumeration
- Registration flow
- Capacity model (different from workshop single-session)
- Multi-day scheduling
- Partner/speaker role assignments
- Communication schedule

**Recommendation:** Define `EventOperation` schema:
- `id: string`
- `slug: string`
- `name: string`
- `eventType: 'conservation_gathering' | 'symposium' | 'maker_market' | 'retreat_summit'`
- `dateRange: { start: string; end: string }`
- `sessions: EventSession[]` (individual time blocks)
- `capacityTotal: number`
- `registrationOpen: string` / `registrationClose: string`
- `status: 'planning' | 'registration_open' | 'sold_out' | 'in_progress' | 'completed' | 'cancelled'`
- `partners: { partnerId: string; role: string }[]`
- `communications: EventCommunication[]` (scheduled sends)

---

### HF-3303: Incident Runbook Artifact Structure

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal emphasizes runbooks but does not specify:
- Runbook document format
- Incident classification
- Rollback procedure schema
- Responsibility assignment
- Testing/drill requirements

**Recommendation:** Define `IncidentRunbook` structure:
- `id: string`
- `systemArea: 'booking' | 'payment' | 'stream' | 'content' | 'partner'`
- `incidentType: string` (e.g., "payment_webhook_failure")
- `severity: 'critical' | 'high' | 'medium' | 'low'`
- `detectionMethod: string`
- `responseSteps: RunbookStep[]`
- `rollbackProcedure: string`
- `responsibleRole: string`
- `lastDrillDate: string | null`
- `lastIncidentDate: string | null`

Store as markdown with frontmatter at `docs/runbooks/`.

---

### HF-3304: Admin Audit Log Schema

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "admin-level controls with audit logs for high-impact updates" without specifying:
- What constitutes a high-impact update
- Audit log event structure
- Retention policy
- Query interface

**Recommendation:** Define `AdminAuditEvent` schema:
- `eventId: string`
- `occurredAt: string`
- `actorId: string`
- `actorType: 'operator' | 'system' | 'automation'`
- `actionType: 'partner_status_change' | 'content_publish' | 'booking_override' | 'config_change' | 'runbook_execute'`
- `resourceType: string`
- `resourceId: string`
- `changeDetails: Record<string, { before: unknown; after: unknown }>`
- `reason: string | null`

Store at `data/audit/` with JSONL format for append-only integrity.

---

### HF-3305: Operational Readiness Checklist Format

**Type:** MISSING_SPEC
**Severity:** IMPORTANT

The proposal mentions "operational readiness checklist for mature public updates and partner launches" without specifying:
- Checklist item structure
- Sign-off requirements
- Blocking vs. advisory items
- Reuse across launch types

**Recommendation:** Define checklist templates at `docs/checklists/`:
- `partner_launch.md` - New partner activation
- `event_launch.md` - Annual event go-live
- `seasonal_opening.md` - Post-season reopening
- `content_publish.md` - Major content update

Each checklist item includes:
- `[ ]` Task description
- `(blocking)` or `(advisory)` marker
- Responsible role
- Verification method

---

### HF-3306: Event Registration vs Workshop Registration

**Type:** INTEGRATION_RISK
**Severity:** IMPORTANT

Existing workshop registration at `lib/workshop/` handles single-session events. Multi-day event registration has different requirements:
- Multi-session selection
- Package pricing (full event vs. day pass)
- Accommodation coordination
- Partner session assignments

**Recommendation:** Event registration should be a SEPARATE system from workshop registration:
- `lib/events/registration.ts` - Event-specific registration flow
- Reuse `lib/workshop/` for individual event sessions where appropriate
- Link to `lib/itinerary/` for accommodation bundling

---

### HF-3307: Partner Self-Service Scope

**Type:** CLARIFICATION_NEEDED
**Severity:** IMPORTANT

The proposal asks: "How much partner self-service is desirable at maturity versus keeping approvals centralized?"

This should be tier-based:
- `starter`: No self-service, operator creates/edits all content
- `standard`: Can edit own descriptions, operator approves
- `premium`: Can publish directly, audit-only oversight

**Recommendation:** Partner self-service tied to `PartnerGovernance.tier`. Implement operator override capability at all tiers.

---

### HF-3308: Rollback Procedure Testing

**Type:** MISSING_SPEC
**Severity:** ADVISORY

The proposal mentions "tabletop drills or simulated failures" but does not specify:
- Drill schedule
- Drill documentation format
- Success criteria
- Findings remediation tracking

**Recommendation:** Define quarterly drill schedule. Drill records stored at `docs/drills/` with date, scenario, findings, and remediation status.

---

### HF-3309: Local Maker Goods Full Implementation

**Type:** SCOPE_CONCERN
**Severity:** ADVISORY

Sprint 2.4 deferred consignment and inventory tracking for local maker goods. Sprint 3.3 should decide whether to:
1. Keep referral-only model indefinitely
2. Implement consignment tracking
3. Support direct maker fulfillment

**Recommendation:** Sprint 3.3 should add OPTIONAL consignment tracking for approved makers only. Most goods remain referral. This keeps complexity bounded while enabling growth.

---

## Questions Resolved

Based on architectural consistency:

1. **Flagship event type:** Start with conservation gathering (aligns with preservation mission). Symposium and maker market as subsequent additions.

2. **Partner self-service level:** Tier-based per HF-3307. Premium partners have publish rights, others require approval.

3. **First-priority runbook cases:** Booking failure, payment webhook failure, stream outage, content publication rollback.

---

## Amendments Required

### A-3.3.1: Partner Governance Extension
Extend Sprint 2.4 `PartnerRecord` with tier system, insurance requirements, performance thresholds, and suspension triggers via `PartnerGovernance` fields.

### A-3.3.2: Event Operations Schema
Define `EventOperation` with multi-day scheduling, session structure, capacity, registration lifecycle, and partner role assignments.

### A-3.3.3: Incident Runbook Structure
Define `IncidentRunbook` artifact format with detection, response, rollback, and drill tracking. Store at `docs/runbooks/`.

### A-3.3.4: Admin Audit Log Schema
Define `AdminAuditEvent` with actor, action, resource, change details, and reason tracking. JSONL storage at `data/audit/`.

### A-3.3.5: Operational Checklists
Create template checklists for partner launch, event launch, seasonal opening, and content publish at `docs/checklists/`.

### A-3.3.6: Event Registration System
Separate `lib/events/registration.ts` for multi-day event registration distinct from workshop single-session flow.

### A-3.3.7: Partner Self-Service by Tier
Implement tier-based self-service: starter (none), standard (edit with approval), premium (direct publish with audit).

---

## Key Decisions

- **DEC-065:** Partner governance tier system (starter/standard/premium)
- **DEC-066:** Event operations schema with multi-day support
- **DEC-067:** Incident runbook artifact format at `docs/runbooks/`
- **DEC-068:** Admin audit log schema (JSONL at `data/audit/`)
- **DEC-069:** Operational checklist templates at `docs/checklists/`
- **DEC-070:** Event registration as separate system from workshop
- **DEC-071:** Tier-based partner self-service model

---

## Approval

**Status:** APPROVED WITH AMENDMENTS

All seven amendments (A-3.3.1 through A-3.3.7) are required for implementation. Four findings are BLOCKING and require schema definitions before event/governance work begins.

---

*Reviewed by: HYDE (Critical Review Agent)*
*Workflow: dual-brain sprint*
