# Sprint 2.4 HYDE Review Findings

**Sprint:** 2.4 - Partner Marketplace and Task Orchestration
**Reviewer:** HYDE (Critical Review Agent)
**Review Date:** 2026-03-19
**Proposal:** `Sprints/Proposals/11_sprint_2_4_partner_marketplace_and_task_orchestration.md`

---

## Executive Summary

Sprint 2.4 proposes two major capabilities: (1) a governed partner marketplace for experiences and local goods, and (2) Burro task orchestration with human approval gates. Both are foundational for Phase 3 sprints.

The proposal is well-grounded in the established architecture but requires explicit contract definitions, integration specifications with existing systems, and clearer scope boundaries to avoid implementation ambiguity.

**Disposition:** APPROVED WITH AMENDMENTS

---

## Findings

### HF-2401: Partner Entity Contract Missing

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal references "partner registry record" and "commission and governance rules" but does not define the explicit schema. Given the established pattern of Zod-validated type contracts (see `lib/experience/types.ts`, `lib/itinerary/types.ts`), the partner entity requires canonical definition.

**Required fields to specify:**
- Partner identity (id, slug, legalName, displayName)
- Contact (email, phone, primaryContact)
- Category (guide, artisan, observatory, preservation_org, etc.)
- Approval status lifecycle (pending, approved, suspended, inactive)
- Liability acknowledgment (waiverAccepted, insuranceVerified)
- Revenue model (referral_fee, commission_pct, flat_fee)
- CMS publication rights (canPublish, requiresReview)

**Recommendation:** Define `PartnerRecord` schema in `lib/partner/types.ts` with Zod validation before implementation begins.

---

### HF-2402: Partner Experience vs Owned Experience Integration

**Type:** INTEGRATION_RISK
**Severity:** BLOCKING

The existing `ExperienceProduct` type in `lib/experience/types.ts` already includes:
- `deliveryModel: z.enum(['owned', 'partner_led', 'guide_led', 'self_guided'])`
- `partnerRef: z.string().optional()`
- `partnerName: z.string().optional()`

The proposal states "Support partner-led experiences as distinct from owned experiences" but does not clarify whether this means:
1. Extending the existing `ExperienceProduct` with additional partner governance fields
2. Creating a separate `PartnerExperience` type
3. Treating partner experiences as a filtered view of `ExperienceProduct`

**Recommendation:** Partner experiences MUST use the existing `ExperienceProduct` type with mandatory `partnerRef` when `deliveryModel` is `partner_led` or `guide_led`. Add partner governance fields via a linked `PartnerRecord`, not embedded in experience records.

---

### HF-2403: Burro Task Orchestration Schema Undefined

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "Burro task-run records" and "orchestration flows for package preparation" without defining:
- Task type enumeration
- Task state machine (created, pending_approval, approved, executing, completed, failed)
- Approval gate structure
- Audit log event schema

The existing analytics event schema (`lib/analytics/types.ts`) includes `assistant_interaction` but lacks task orchestration semantics.

**Recommendation:** Define `BurroTaskRun` schema with:
- Task types: `package_draft`, `partner_coordination`, `content_review`, `followup_sequence`
- State machine with valid transitions
- Approval gate record with approver identity and timestamp
- Link to existing `AnalyticsEvent` for audit trail integration

---

### HF-2404: Marketplace Publication Workflow Ambiguity

**Type:** CLARIFICATION_NEEDED
**Severity:** IMPORTANT

The proposal states "Treat marketplace publishing as a workflow, not a table dump" but does not specify:
- Publication states (draft, pending_review, approved, published, suspended, archived)
- Who can transition between states
- Review requirements per transition
- Relationship to existing CMS patterns (`cms/experiences/`, `cms/workshops/`)

**Recommendation:** Define explicit marketplace publication state machine matching the pattern established in `lib/rental/state-machine.ts`. Marketplace items should follow CMS directory conventions at `cms/marketplace/`.

---

### HF-2405: Local Maker Goods Scope Creep Risk

**Type:** SCOPE_CONCERN
**Severity:** IMPORTANT

The proposal includes "local-maker goods as governed marketplace entries" with the caveat about "inventory and fulfillment responsibilities." This risks scope creep into:
- Consignment tracking
- Inventory management
- Shipping logistics
- Payment splits

The existing shop at `lib/shop/` handles owned goods with scaffold-mode fulfillment.

**Recommendation:** For Sprint 2.4, local maker goods should be LIMITED to:
1. Referral/affiliate links (no inventory)
2. Single "featured maker" showcase (operator fulfills)

Full consignment or inventory tracking should be deferred to Sprint 3.3 or later.

---

### HF-2406: Commission and Revenue Rules Data Model

**Type:** MISSING_SPEC
**Severity:** IMPORTANT

Revenue share requires explicit calculation logic. The proposal should specify:
- Commission calculation timing (at booking, at confirmation, at completion)
- Revenue rule priority (partner-specific vs. category default)
- Refund/cancellation commission handling
- Reporting requirements for partners

**Recommendation:** Define `CommissionRule` type with:
- `partnerId: string` (or 'default')
- `productType: 'experience' | 'goods' | 'all'`
- `model: 'percentage' | 'flat_fee' | 'referral_only'`
- `rate: number`
- `calculatedAt: 'booking' | 'confirmation' | 'completion'`
- `validFrom: string` / `validTo: string`

---

### HF-2407: Task Orchestration vs Follow-Up Integration

**Type:** INTEGRATION_RISK
**Severity:** ADVISORY

Existing follow-up infrastructure at `lib/burro/follow-ups.ts` and `lib/burro/followups.ts` handles draft messages and guest follow-up. Task orchestration should integrate with, not replace, this pattern.

**Recommendation:** Task orchestration should be able to CREATE follow-up drafts as a task outcome, linking `BurroTaskRun.id` to follow-up records.

---

### HF-2408: Analytics Event Gaps for Partner Activity

**Type:** MISSING_SPEC
**Severity:** ADVISORY

The existing 10 analytics event types (`lib/analytics/types.ts`) do not include partner-specific events. Sprint 2.4 should add:
- `partner_experience_booked`
- `partner_onboarded`
- `marketplace_item_published`

**Recommendation:** Extend analytics event schema in Sprint 2.4 to support partner activity tracking. This aligns with Sprint 3.2 CRM requirements.

---

## Questions Resolved

Based on architectural consistency and previous decisions:

1. **First marketplace release emphasis:** EXPERIENCES first. Local maker goods as referral-only for Sprint 2.4, matching the conservative pattern from Sprint 2.2 (single flagship rental).

2. **Burro orchestration scope:** OPERATOR-ONLY task runs in Sprint 2.4. Guest-facing package assembly via Burro requires the CRM foundation from Sprint 3.2.

3. **Commission formality:** Define rules schema now, apply minimal rules (single commission tier). Complex rule evaluation deferred.

---

## Amendments Required

### A-2.4.1: Partner Entity Contract
Define `PartnerRecord` schema with identity, contact, category, approval status, liability, revenue model, and CMS rights fields. Location: `lib/partner/types.ts`.

### A-2.4.2: Partner Experience Integration
Partner experiences use existing `ExperienceProduct` type with mandatory `partnerRef` link to `PartnerRecord`. No separate type.

### A-2.4.3: Task Orchestration Schema
Define `BurroTaskRun` with task types, state machine (5 states), approval gate records, and audit trail integration.

### A-2.4.4: Marketplace Publication State Machine
Define explicit publication states (6 states) with transition rules and reviewer requirements.

### A-2.4.5: Local Maker Goods Scope Constraint
Sprint 2.4 limits local goods to referral links and single featured maker. No consignment or inventory.

### A-2.4.6: Commission Rules Foundation
Define `CommissionRule` type with partner/category scope, model, rate, and timing fields.

### A-2.4.7: Operator-Only Orchestration
Task orchestration runs are internal/operator-only in Sprint 2.4. Guest-facing assembly deferred.

---

## Key Decisions

- **DEC-046:** Partner entity contract canonical location (`lib/partner/types.ts`)
- **DEC-047:** Partner experiences via `ExperienceProduct` linkage (no separate type)
- **DEC-048:** Task orchestration state machine (5 states with approval gates)
- **DEC-049:** Marketplace publication workflow (6 states)
- **DEC-050:** Local maker goods scope constraint (referral-only for Sprint 2.4)
- **DEC-051:** Commission rules foundation type definition
- **DEC-052:** Operator-only orchestration for Sprint 2.4

---

## Approval

**Status:** APPROVED WITH AMENDMENTS

All seven amendments (A-2.4.1 through A-2.4.7) are required for implementation. Three findings are BLOCKING and must be addressed in contract definitions before code is written.

---

*Reviewed by: HYDE (Critical Review Agent)*
*Workflow: dual-brain sprint*
