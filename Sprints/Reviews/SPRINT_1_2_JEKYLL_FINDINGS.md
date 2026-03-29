# Sprint 1.2 Jekyll Findings

**Reviewed:** 2026-03-16T09:33:00-05:00
**Sprint:** 1.2
**Proposal:** `Sprints/Proposals/05_sprint_1_2_lodging_booking_flow.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 0
- HIGH: 2
- MEDIUM: 3
- LOW: 1
- INFO: 1

## Findings

### HIGH

#### JF-501: The proposal still mixes full-booking language with the approved MVP handoff model

**Severity:** HIGH

**Evidence**
- The proposal intent says a guest should "see availability and pricing logic, complete a booking, and receive the right confirmations".
- Earlier sections still describe a "guest checkout funnel", "deposit handling", and "reservation data capture".
- Hyde's PRD-1.2.1 explicitly changes MVP scope to a site-to-Lodgify handoff and the out-of-scope section defers full in-site checkout and Stripe deposit handling to P2.

**Impact**
- Sprint 1.2 is feasible, but the current wording overstates what Jekyll can verify inside this repo.
- If Hyde leaves the language ambiguous, the implementation can look incomplete even when it matches the approved MVP architecture.

**Required change**
- Rewrite the sprint intent, in-scope list, and definition of done so they consistently describe a waiver-and-redirect flow, not a full in-site checkout.
- Reserve "booking complete" language for provider-confirmed bookings received back through the Lodgify webhook path.

#### JF-502: Operator booking visibility is underspecified relative to the actual Sprint 0.3 assistant surface

**Severity:** HIGH

**Evidence**
- Workstream 1.2.5 promises `BookingList` and `BookingDetail` components in `/assistant`.
- The current `/assistant` route renders `BurroAssistantShell` from a feasibility snapshot service, not an operator dashboard with booking records.
- There is no existing `components/assistant/BookingList.tsx`, `components/assistant/BookingDetail.tsx`, or `website/frontend/lib/email/` module in the repo.

**Impact**
- The sprint is still buildable, but the proposal currently treats operator visibility as a small extension instead of a new assistant data surface plus new notification plumbing.
- That creates scope risk and weakens acceptance criterion AC-1.2.8.

**Required change**
- State explicitly whether Sprint 1.2 will add a simple booking panel to the existing assistant shell or introduce a separate operator booking view.
- Tighten acceptance so it only promises repo-verifiable rendering from local booking records and scaffold-mode notifications.

### MEDIUM

#### JF-503: The booking record lifecycle is not clearly separated from waiver acknowledgement and redirect intent

**Severity:** MEDIUM

**Evidence**
- Workstream 1.2.3 records a waiver before redirect.
- Workstream 1.2.4 then defines a `BookingRecord` with status values `pending`, `confirmed`, and `cancelled`.
- The proposal does not explicitly say whether a local record is created at waiver time, redirect time, webhook confirmation time, or some combination of those events.

**Impact**
- Jekyll can implement this sprint either way, but inconsistent lifecycle assumptions will make notifications, dashboard display, and local logs harder to reason about.
- The repo risks conflating "guest started booking" with "provider confirmed booking".

**Recommended change**
- Define three distinct event stages: waiver acknowledgement, booking redirect intent, and provider-confirmed booking.
- Specify which stage creates or updates `BookingRecord` and which fields are optional before confirmation arrives.

#### JF-504: Rate-rule validation scope is feasible, but date logic and blackout handling need tighter constraints

**Severity:** MEDIUM

**Evidence**
- The proposal introduces `website/cms/rates/schema.json`, `seasonal.json`, and a loader that returns the applicable rate for a date range.
- `SeasonalRate` uses recurring `MM-DD` season boundaries plus optional `YYYY-MM-DD` blackout dates.
- Acceptance criterion AC-1.2.3 expects correct pricing for selected dates, but the proposal does not define edge handling for year wrap, overlapping seasons, or partial blackout spans.

**Impact**
- The ruleset approach is good and fits the repo, but these ambiguities can expand into a mini pricing engine if left open.
- That is too much uncertainty for a sprint that already includes public stay pages, APIs, webhooks, and notifications.

**Recommended change**
- Constrain Sprint 1.2 to one deterministic rule-resolution strategy with no overlapping seasons.
- Treat blackout dates as display and booking-block hints unless Hyde explicitly wants full conflict resolution in this sprint.

#### JF-505: Confirmation delivery language is stronger than the repo can prove in scaffold mode

**Severity:** MEDIUM

**Evidence**
- PRD-1.2.4 correctly allows Postmark scaffold mode when credentials are absent.
- The definition of done still says a guest can receive a correct confirmation email.
- The current project pattern from Sprints 0.3 and 1.1 treats provider-backed delivery as local capture when credentials are not configured.

**Impact**
- This does not block the sprint, but the acceptance language should match the actual verification mode available in the repo.
- Otherwise Hyde may approve a standard that depends on external provider activation rather than implementation quality.

**Recommended change**
- Amend the definition of done and AC-1.2.7 to say confirmation is sent or captured locally in scaffold mode.
- Require evidence for the rendered payload and stored capture, not live guest inbox delivery.

### LOW

#### JF-506: Unit content requirements should explicitly mark private inventory and soft-launch behavior

**Severity:** LOW

**Evidence**
- The `LodgingUnit` contract already includes `status: 'available' | 'coming_soon' | 'private'`.
- The definition of done says the site must clearly separate public stay inventory from the private home zone.
- The deliverables only require at least two unit definitions and do not specify whether one may be `coming_soon` or `private`.

**Impact**
- This is not blocking, but Hyde should make the catalog behavior explicit so the public stay page does not accidentally expose inventory that should remain hidden or non-bookable.

**Recommended change**
- State whether Sprint 1.2 requires two publicly bookable units or allows one public unit plus one non-bookable placeholder.
- Make the rendering rule for `private` units explicit in the acceptance criteria.

### INFO

#### JF-507: Sprint 1.2 is feasible if Hyde keeps it as a booking handoff sprint, not a full reservation platform

**Severity:** INFO

**Evidence**
- Sprint 1.1 already established the public site and content root.
- Sprint 0.3 already established webhook and scaffold-mode integration seams.
- Hyde's enhancement sensibly defers FAQ Burro and full in-site checkout.

**Impact**
- The repo is ready for a disciplined stay catalog, waiver capture, Lodgify redirect, and scaffold-mode confirmation flow.
- Success depends on maintaining the handoff architecture and reducing any lingering language that implies full commerce capability.

**Recommended change**
- Keep the sprint anchored to public stay content, local rules, structured waiver records, webhook-backed confirmation, and operator visibility from local records.

## Overall Assessment

Sprint 1.2 is technically feasible, but Hyde should tighten the proposal before treating it as implementation-ready. The main issue is scope language drift: the enhanced decision set correctly narrows MVP to a Lodgify handoff, while earlier sections still describe a fuller checkout and confirmation stack than the repo can honestly verify. If Hyde aligns the wording around handoff architecture, booking lifecycle stages, scaffold-mode confirmation proof, and a constrained operator dashboard surface, Jekyll can implement the sprint cleanly in the next phase.
