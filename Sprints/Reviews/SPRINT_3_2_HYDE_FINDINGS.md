# Sprint 3.2 HYDE Review Findings

**Sprint:** 3.2 - Advanced CRM and Recommendation Engine
**Reviewer:** HYDE (Critical Review Agent)
**Review Date:** 2026-03-19
**Proposal:** `Sprints/Proposals/13_sprint_3_2_advanced_crm_and_recommendation_engine.md`

---

## Executive Summary

Sprint 3.2 proposes unifying customer history across revenue systems and building recommendation logic for cross-sell and lifecycle communication. This builds directly on the analytics foundation from Sprint 2.3 and the guest-events layer established in Sprint 1.4.

The proposal correctly emphasizes privacy, explainability, and operator control. However, implementation requires explicit identity resolution, consent modeling, and recommendation rule definition.

**Disposition:** APPROVED WITH AMENDMENTS

---

## Findings

### HF-3201: Customer Identity Resolution Strategy

**Type:** MISSING_SPEC
**Severity:** BLOCKING

Multiple identity sources exist:
- `lib/guest-events/store.ts`: Uses `guestEmail` (normalized)
- `lib/crm/events.ts`: Uses `guestEmail` with `normalizeGuestEmail()`
- `lib/analytics/types.ts`: Uses `guestEmailHash` (SHA-256)
- Lodgify bookings: External customer ID
- Workshop registrations: Email-based

The proposal mentions "durable identity model" but does not specify how to:
- Merge records when email changes
- Link anonymous sessions to identified guests
- Handle same-person-multiple-emails
- Resolve conflicts between systems

**Recommendation:** Define `CustomerProfile` as canonical identity with:
- `profileId: string` (stable UUID)
- `primaryEmail: string` (normalized)
- `aliasEmails: string[]` (known alternates)
- `externalIds: { source: string; id: string }[]` (Lodgify, Stripe, etc.)
- Identity merge requires operator approval for ambiguous cases.

---

### HF-3202: Event History Schema Unification

**Type:** MISSING_SPEC
**Severity:** BLOCKING

Existing event stores are fragmented:
- `data/guest-events/` - General guest events
- `data/analytics/events.jsonl` - Analytics events (Sprint 2.3)
- `data/booking/` - Booking records
- `data/workshop/` - Workshop registrations
- `data/shop/orders/` - Shop orders

The proposal mentions "normalize events... into one history layer" without specifying:
- Unified event schema
- Source attribution
- Temporal ordering guarantees
- Query interface

**Recommendation:** Create `CustomerEventHistory` view layer that:
1. Reads from existing stores (no migration)
2. Projects unified schema with `source` field
3. Orders by `occurredAt` timestamp
4. Exposes via `lib/crm/history.ts`

Do NOT duplicate data. Query across sources on read.

---

### HF-3203: Recommendation Rules Engine Definition

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "explicit rules and interpretable logic" for recommendations. Example given: "prior dark-sky guest, returning in fall, interested in photography, therefore relevant workshop suggestion."

This requires:
- Rule definition schema
- Condition evaluation engine
- Rule priority/conflict resolution
- Output action types

**Recommendation:** Define `RecommendationRule` schema:
- `id: string`
- `name: string`
- `conditions: Condition[]` (AND logic)
- `actions: Action[]`
- `priority: number` (higher wins on conflict)
- `enabled: boolean`
- `validFrom / validTo: string`

Condition types: `has_event`, `event_count_gte`, `recency_within`, `seasonality_match`
Action types: `suggest_product`, `add_tag`, `trigger_followup`

---

### HF-3204: Communication Consent Model

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "explicit consent and communication preferences" and "opt-in only versus default operational messages."

Current system lacks:
- Consent storage schema
- Consent capture points
- Opt-in vs. operational message classification
- Unsubscribe mechanism

**Recommendation:** Define `CommunicationPreferences` on `CustomerProfile`:
- `marketingOptIn: boolean` (explicit opt-in required)
- `workshopNotifications: boolean` (default true for registrants)
- `followUpAllowed: boolean` (default true)
- `unsubscribedAt: string | null`

Transactional messages (booking confirmations, receipts) do not require consent.
Marketing (recommendations, promotions) requires `marketingOptIn: true`.

---

### HF-3205: Lifecycle Automation Workflow Definition

**Type:** MISSING_SPEC
**Severity:** IMPORTANT

The proposal lists automation examples:
- Abandoned inquiry follow-up
- Pre-arrival reminders
- Post-stay feedback
- Workshop upsells

These need explicit definition:
- Trigger conditions
- Delay timing
- Message templates
- Cancellation conditions
- Delivery tracking

**Recommendation:** Define `LifecycleAutomation` schema:
- `id: string`
- `name: string`
- `trigger: TriggerCondition`
- `delay: { amount: number; unit: 'hours' | 'days' }`
- `action: 'send_email' | 'create_followup_draft' | 'add_tag'`
- `templateRef: string`
- `cancelIf: CancelCondition[]`
- `status: 'active' | 'paused' | 'disabled'`

---

### HF-3206: Integration with Existing Guest Events

**Type:** INTEGRATION_RISK
**Severity:** IMPORTANT

The existing `lib/guest-events/store.ts` and `lib/crm/events.ts` have overlapping but inconsistent schemas:

`guest-events/store.ts`:
```typescript
eventType: z.enum(['booking', 'registration', 'purchase', 'follow-up-sent', 'note'])
```

`crm/events.ts`:
```typescript
eventType: z.enum(['booking', 'registration', 'purchase', 'follow-up-sent', 'note', 'itinerary', 'group-booking'])
```

This creates ambiguity about canonical event types.

**Recommendation:** Sprint 3.2 should:
1. Deprecate `lib/guest-events/store.ts` in favor of `lib/crm/events.ts`
2. Add missing event types to `lib/crm/events.ts` (rental, donation, etc.)
3. Create migration notes for any external references

---

### HF-3207: Recommendation Display Surfaces

**Type:** CLARIFICATION_NEEDED
**Severity:** IMPORTANT

The proposal mentions "attach recommendations to real business surfaces" including:
- Follow-up email drafts
- Booking confirmations
- Operator dashboards

This needs specification of:
- Which dashboard panels show recommendations
- Recommendation format per surface
- Operator override capability

**Recommendation:** Sprint 3.2 should implement recommendations on:
1. `/assistant/crm` dashboard (new panel) - full recommendation list with dismiss/accept
2. Follow-up draft composition - suggested content insertion
3. Booking confirmation emails - "you might also enjoy" section (requires consent)

---

### HF-3208: Privacy and Data Retention

**Type:** MISSING_SPEC
**Severity:** ADVISORY

Unified customer history raises retention questions:
- How long is event history kept?
- Can customers request deletion?
- What is anonymization vs. deletion?

**Recommendation:** Define retention policy:
- Active customer data: indefinite while relationship active
- Inactive (no activity 3+ years): anonymize email, retain aggregate events
- Deletion request: remove PII, retain anonymized event counts for analytics

---

## Questions Resolved

Based on architectural consistency and previous decisions:

1. **Mandatory event sources for unified profile:** All sources (stay, workshop, shop, rental, itinerary). The history layer queries across sources without migration.

2. **Recommendations approach:** Rule-based first. Learned scoring deferred beyond Sprint 3.2. Recommendation rules must be editable by operator.

3. **Opt-in classification:** Marketing requires explicit opt-in. Operational messages (confirmation, reminder) are default-allowed. Follow-ups are opt-out.

---

## Amendments Required

### A-3.2.1: Customer Profile Schema
Define `CustomerProfile` with stable identity, primary/alias emails, external ID mapping, and merge audit trail.

### A-3.2.2: Event History Query Layer
Create `lib/crm/history.ts` to query across existing stores with unified projection. No data migration.

### A-3.2.3: Recommendation Rules Schema
Define `RecommendationRule` with condition types, action types, and priority ordering.

### A-3.2.4: Communication Consent Model
Add `CommunicationPreferences` to `CustomerProfile` with marketing opt-in, notification preferences, and unsubscribe tracking.

### A-3.2.5: Lifecycle Automation Schema
Define `LifecycleAutomation` with trigger, delay, action, template, and cancellation logic.

### A-3.2.6: Guest Events Consolidation
Deprecate `lib/guest-events/store.ts`. Extend `lib/crm/events.ts` as canonical event store.

---

## Key Decisions

- **DEC-059:** Customer identity resolution via `CustomerProfile` with merge audit
- **DEC-060:** Event history as query layer, not data migration
- **DEC-061:** Rule-based recommendations with operator-editable rules
- **DEC-062:** Communication consent model (marketing opt-in, operational default)
- **DEC-063:** Lifecycle automation schema with trigger/delay/action pattern
- **DEC-064:** Guest events consolidation (`lib/crm/events.ts` canonical)

---

## Approval

**Status:** APPROVED WITH AMENDMENTS

All six amendments (A-3.2.1 through A-3.2.6) are required for implementation. Four findings are BLOCKING and require schema definitions before automation work begins.

---

*Reviewed by: HYDE (Critical Review Agent)*
*Workflow: dual-brain sprint*
