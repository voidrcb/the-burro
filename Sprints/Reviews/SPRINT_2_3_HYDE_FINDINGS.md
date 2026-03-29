# Sprint 2.3 Hyde Findings - Livestream Network and Analytics

**Reviewed:** 2026-03-19T13:30:00-05:00
**Sprint:** 2.3
**Proposal:** `Sprints/Proposals/10_sprint_2_3_livestream_network_and_analytics.md`
**Blueprint anchor:** `Docs/Big_Bend_Burro_Blueprint_Final.json`
**Overall feasibility:** APPROVED WITH AMENDMENTS

## Executive Summary

Sprint 2.3 bundles two related but distinct systems: scenic/dark-sky livestream infrastructure and business analytics. Both are P2 Expansion scope per the blueprint. The proposal correctly prioritizes graceful degradation for streaming and server-side durability for analytics - critical requirements given Big Bend's connectivity realities.

The key strategic insight is correct: analytics unlocks data-driven decision-making for later CRM and recommendation work (Sprints 3.2-3.3), and livestream provides brand visibility between visits while documenting the conservation case.

The proposal is strongest when interpreted as:
- Building a connectivity-tolerant streaming architecture with explicit fallback states
- Instrumenting core revenue surfaces (booking, workshop, shop, rental) with server-side event capture
- Creating an owner-facing dashboard with monthly reporting cadence
- Treating livestream as R0_OBSERVE (marketing/documentation) not R2 revenue feature

The proposal is weakest where it:
- Underweights the specific analytics schema and metric hierarchy needed
- Does not specify stream uptime/failure logging architecture
- Leaves stream type decision (night vs. day vs. both) unresolved

## Findings

### HF-901 - MEDIUM - Analytics event schema requires explicit definition

**Evidence**
- Proposal mentions "core site and commerce events appear in analytics consistently" but does not define the event schema.
- Existing `lib/analytics/events.ts` only supports `page_view`, `newsletter_subscribed`, and `newsletter_duplicate`.
- Blueprint success_metrics reference: booking_conversion_rate, newsletter_signup_rate, operator_time_saved_hours_per_week.

**Why this matters**
- Without explicit event schema, instrumentation will be inconsistent across surfaces.
- Future CRM and recommendation work (Sprint 3.2) depends on clean event data.
- Server-side vs. client-side event capture must be deterministic.

**Required amendment**
- Define canonical analytics event schema covering: page_view, booking_intent, booking_confirmed, workshop_registered, shop_order_created, rental_quote_requested, rental_approved, donation_completed, assistant_interaction.
- Each event must include: eventType, occurredAt, path, guestEmailHash (if available), metadata object.
- Document event producer responsibilities (which API routes emit which events).

### HF-902 - MEDIUM - Core metrics hierarchy needs explicit definition

**Evidence**
- Proposal asks: "Which five business metrics do you want treated as non-negotiable in the first dashboard?"
- Blueprint defines 15 success metrics across business, product, and conservation categories.
- Proposal mentions "visitor, signups, booking conversion, workshop inquiries, order events, donation events, assistant usage, and package interest" without priority ranking.

**Why this matters**
- Dashboard design without metric hierarchy leads to noise.
- Operators need 3-5 decision-useful numbers, not 15 vanity metrics.
- Monthly reporting cadence only works if metrics are pre-selected.

**Required amendment**
- Define Tier 1 (non-negotiable) metrics: unique_visitors, booking_conversion_rate, workshop_registration_count, shop_revenue_usd, newsletter_signup_rate.
- Define Tier 2 (useful context) metrics: rental_quotes, assistant_interactions, donation_total, stream_uptime_pct.
- Dashboard must display Tier 1 prominently; Tier 2 in supporting section.

### HF-903 - HIGH - Streaming fallback state machine must be explicit

**Evidence**
- Proposal: "Implement graceful failure states: low-bandwidth stream, still image, time-lapse loop, scheduled downtime notice, or last-known-good capture."
- Blueprint program_principle: "Design all customer systems to degrade gracefully in low-connectivity conditions."
- Current `/dark-sky/page.tsx` is a RouteStub with no fallback logic.

**Why this matters**
- Big Bend connectivity is unreliable. Without explicit fallback states, the page will show broken embeds or error states.
- Reputation risk if visitors encounter dead feeds without explanation.
- Operational complexity if operators cannot predict which fallback state applies.

**Required amendment**
- Define explicit stream state machine: `live`, `low_bandwidth`, `static_fallback`, `timelapse_fallback`, `scheduled_offline`, `error_recovery`.
- Each state must have: public message, visual indicator, recovery condition.
- Implement state display component that reads from stream health store.

### HF-904 - MEDIUM - Stream uptime and incident logging is required for operational learning

**Evidence**
- Proposal: "Log stream uptime and failure modes because the operational lesson matters as much as the marketing lesson."
- No existing infrastructure for stream health logging in codebase.

**Why this matters**
- Operators cannot improve reliability without historical failure data.
- Connectivity pattern analysis requires structured uptime logs.
- Blueprint risk RISK-008 explicitly calls out remote connectivity causing outages.

**Required amendment**
- Create stream health log store: `data/analytics/stream-health.jsonl`.
- Log events: stream_start, stream_stop, bandwidth_degraded, fallback_triggered, recovery_completed.
- Include: timestamp, stream_id, state_from, state_to, duration_seconds, failure_reason (if applicable).

### HF-905 - LOW - First stream type decision should be explicit in sprint scope

**Evidence**
- Proposal asks: "Do you want the first stream to be night-sky focused, scenic daytime focused, or one of each?"
- Blueprint feature F008 (livestream_and_webcam_network) lists dependencies: starlink, camera_hardware, media_streaming_backend.

**Why this matters**
- Night-sky streaming has different technical requirements (low-light camera, specific timing).
- Scenic daytime is simpler but less differentiated.
- Scope creep risk if both are attempted simultaneously.

**Recommended amendment**
- Sprint 2.3 launches with single stream type: scenic daytime OR night-sky.
- Operators choose based on hardware readiness and bandwidth testing.
- Second stream type becomes Sprint 2.4 or later scope.

### HF-906 - LOW - Membership/donation prompt timing should follow reliability proof

**Evidence**
- Proposal asks: "Should membership or donation prompts appear alongside the first stream release, or only after reliability is proven?"
- Blueprint readiness for livestream_portal is R0_OBSERVE.

**Why this matters**
- Asking for money before proving value creates brand friction.
- R0_OBSERVE activation profile explicitly means "observe reports or internal demos" before revenue extraction.

**Recommended amendment**
- Sprint 2.3 streams are free/unauthenticated.
- Membership/donation prompt deferred to Sprint 2.4 or later after 30-day uptime proven.
- Soft newsletter capture allowed alongside stream.

### HF-907 - INFO - Server-side analytics is correct for durability

**Evidence**
- Proposal: "Instrument the main revenue surfaces and content surfaces with server-side or durable event tracking so analytics are not dependent on a single fragile client path."
- Existing `PageViewTracker` is client-side.

**Observation**
- Correct architectural decision. Server-side events via API routes are more durable than client-side tracking.
- Client-side page_view tracking can remain for non-critical surface coverage.
- Revenue-critical events (booking, shop, workshop) must have server-side instrumentation.

### HF-908 - INFO - Monthly reporting cadence is appropriate for operator capacity

**Evidence**
- Proposal: "Set up periodic reporting so the owners can compare actual demand against plan, not just raw traffic spikes."

**Observation**
- Monthly cadence matches operator capacity and seasonal planning horizon.
- Weekly would be noise at current scale.
- Template approach (not fully automated report generation) is correct for MVP.

## Recommended Amendments For Approval

- A-2.3.1: Define canonical analytics event schema with 10 event types and standard field structure.
- A-2.3.2: Define Tier 1 (5 metrics) and Tier 2 (4 metrics) hierarchy for dashboard and reporting.
- A-2.3.3: Explicit stream state machine with 6 states and fallback display component.
- A-2.3.4: Stream health logging store with structured uptime/incident events.
- A-2.3.5: Single stream type for Sprint 2.3 launch (operator chooses day vs. night based on readiness).
- A-2.3.6: Membership/donation prompts deferred until reliability proven (30-day minimum).

## Key Decisions

- **DEC-040**: Analytics event schema canonical definition (10 event types, standard fields)
- **DEC-041**: Metric hierarchy (Tier 1: 5 non-negotiable, Tier 2: 4 context)
- **DEC-042**: Stream state machine with explicit fallback states
- **DEC-043**: Stream health logging requirement
- **DEC-044**: Single stream type MVP (day or night, not both)
- **DEC-045**: R0_OBSERVE activation for livestream (no monetization in Sprint 2.3)

## Severity Summary

- CRITICAL: 0
- HIGH: 1
- MEDIUM: 3
- LOW: 2
- INFO: 2

## Recommendation

**APPROVED** with amendments above. The proposal correctly identifies the dual value of livestream (marketing + documentation) and analytics (decision quality). The graceful degradation requirement is well-understood. Amendments focus on making implicit architecture explicit: event schemas, metric hierarchy, stream state machine, and health logging.

The sprint is ready for implementation once amendments are recorded in the handoff.

---

*Reviewed by: Hyde (Dual-Brain Counterpart)*
*Workflow: check_work_exit*
