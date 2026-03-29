# Sprint 2.1 Jekyll Findings — Itinerary Builder and Retreat Hosting

**Reviewed:** 2026-03-16T16:05:00-05:00
**Sprint:** 2.1
**Proposal:** `Sprints/Proposals/08_sprint_2_1_itinerary_builder_and_retreat_hosting.md`
**Blueprint anchor:** `Docs/Big_Bend_Burro_Blueprint_Final.json`
**Overall feasibility:** FEASIBLE WITH AMENDMENTS

## Executive Summary

Sprint 2.1 is technically feasible on the current stack, but only if implementation stays internal-first and treats package composition as a scaffold-mode orchestration layer rather than a fully generalized booking engine. The biggest risk is scope compression: the current repo has route stubs and proven single-flow stores for stays, workshops, shop orders, and follow-up drafts, but it does not yet have a package composition engine, cross-component hold model, or itinerary review surface.

The proposal is strongest when interpreted as:
- establishing the experience catalog content model
- creating a local itinerary draft store with validation
- adding an assistant-side itinerary composer and approval flow
- proving retreat metadata and unit-block holds in local scaffold mode

The proposal is weakest where it implies a full public package lane, generalized reservation engine, or polished document-export workflow in the same sprint.

## Findings

### JF-801 — HIGH — Sprint scope exceeds the current repo baseline unless the proof path is narrowed

**Evidence**
- `/experiences` is still a route stub in [app/experiences/page.tsx](C:\Omega_Trader\The Burro\website\frontend\app\experiences\page.tsx).
- The assistant surface currently supports booking/workshop panels only in [BurroAssistantShell.tsx](C:\Omega_Trader\The Burro\website\frontend\components\assistant\BurroAssistantShell.tsx).
- There is no existing itinerary engine, no group-booking store, and no capacity-hold subsystem in `website/frontend/lib/`.

**Why this matters**
- The proposal currently bundles five substantial workstreams: new public catalog, new internal composer, new package contracts, new hold logic, and Burro itinerary generation.
- Adding PDF export or a fully guest-shareable experience in the same sprint further expands scope without an existing rendering/export pipeline.

**Required amendment**
- Treat Sprint 2.1 as an internal proof sprint.
- Make the shareable output a local permalink or printable HTML summary first; defer true PDF generation unless it falls out trivially from the existing page stack.
- Keep the public `/experiences` catalog simple and content-first; the sprint should not also promise a public self-serve package builder.

### JF-802 — MEDIUM — Contract supersession is not explicit enough, which risks type drift

**Evidence**
- Existing generic `Experience` contract already exists in [types.ts](C:\Omega_Trader\The Burro\website\frontend\lib\content\types.ts).
- Lodging and workshop production contracts live separately in [stay-types.ts](C:\Omega_Trader\The Burro\website\frontend\lib\content\stay-types.ts) and [content-types.ts](C:\Omega_Trader\The Burro\website\frontend\lib\workshop\content-types.ts).

**Why this matters**
- The proposal introduces `ExperienceProduct`, `ItineraryDraft`, `GroupBooking`, `PackagePricingRule`, and `CapacityHold` but does not state which files become canonical or whether old types are superseded.
- Sprint 1.3 needed an explicit supersession decision for workshops; Sprint 2.1 needs the same discipline.

**Required amendment**
- Record a Sprint 2.1 decision that `ExperienceProduct` becomes the canonical experience content contract.
- Define exact canonical paths for itinerary, group-booking, pricing-rule, and hold types before implementation starts.

### JF-803 — MEDIUM — Capacity-hold behavior is underspecified outside the workshop flow

**Evidence**
- Workshop capacity has a clear single-writer decrement pattern in [store.ts](C:\Omega_Trader\The Burro\website\frontend\lib\workshop\store.ts).
- Booking records in [store.ts](C:\Omega_Trader\The Burro\website\frontend\lib\booking\store.ts) do not reserve inventory locally; they capture waiver/intent/confirmation state.

**Why this matters**
- The proposal requires 72-hour package holds across lodging, workshops, and experiences.
- Without a defined writer and expiry/reconciliation rule, the sprint could create holds that look authoritative but are not deterministically enforced.

**Required amendment**
- Use a local `CapacityHold` store as the package hold source-of-truth for Sprint 2.1.
- Expire holds on read/write if `expiresAt` has passed; do not introduce a background scheduler requirement in this sprint.
- Treat lodging and partner experiences as scaffold-mode held inventory, not provider-synced inventory.

### JF-804 — MEDIUM — The approval workflow should extend the assistant pattern already in use, not fork it

**Evidence**
- The assistant already attaches follow-up drafts inline to existing panels per DEC-027 and [assistant/page.tsx](C:\Omega_Trader\The Burro\website\frontend\app\assistant\page.tsx).
- The proposal alternates between a general “review queue” and a dedicated `/assistant/itinerary` route.

**Why this matters**
- A brand-new workflow surface is not inherently wrong, but it risks breaking the repo’s current operator pattern of a single assistant shell with attached review artifacts.
- Chuck and Susan are still in an R1-assisted operating model per the blueprint.

**Required amendment**
- Keep `/assistant/itinerary` as a child route of the existing assistant shell, not a separate dashboard paradigm.
- Use the same approve/decline/edit review posture already proven for follow-up drafts.

### JF-805 — LOW — Quality-gate language overstates the current test baseline

**Evidence**
- `package.json` defines `lint`, `typecheck`, and `build`, but no `test` script in [package.json](C:\Omega_Trader\The Burro\website\frontend\package.json).

**Why this matters**
- The sprint prompt references `pnpm test`, but the current frontend workspace has no automated test harness to run.

**Recommended amendment**
- Mark tests as `N/A` unless Sprint 2.1 also introduces a test runner.
- Do not represent “pnpm test PASS” as a required gate unless a script is added.

### JF-806 — INFO — The internal-first decision is the correct operator fit

**Evidence**
- PRD-2.1.1 aligns with the blueprint’s `R1_ASSISTED` onboarding rule.
- The current assistant shell is already the established internal proving ground.

**Observation**
- This is the right activation level for Chuck and Susan. It reduces operator overload while still proving the package model.

### JF-807 — INFO — Retreats as a package subtype is the right domain boundary for this phase

**Evidence**
- PRD-2.1.3 keeps retreats inside the same composition system instead of creating a second booking domain.

**Observation**
- This keeps implementation coherent and lowers migration risk for later sprints.

## Recommended Amendments For Hyde Approval

- A-2.1.1: Sprint 2.1 remains internal-first end to end; no public self-serve itinerary builder.
- A-2.1.2: Shareable output is a permalink or printable HTML summary first; PDF is optional polish.
- A-2.1.3: `ExperienceProduct` supersedes the legacy generic experience shell as the canonical experience contract.
- A-2.1.4: `CapacityHold` uses a local single-writer scaffold model with expiry-on-read/write, not a background job.
- A-2.1.5: `/assistant/itinerary` extends the current assistant shell and reuses existing approval semantics.
- A-2.1.6: Quality gates for this sprint are `pnpm lint`, `pnpm typecheck`, and `pnpm build`; `pnpm test` is `N/A` unless introduced during implementation.

## Severity Summary

- CRITICAL: 0
- HIGH: 1
- MEDIUM: 3
- LOW: 1
- INFO: 2

## Recommendation

Approve Sprint 2.1 only with the amendments above. The current repo can support a strong scaffold-mode proof of itinerary composition and retreat handling, but not a fully generalized package platform in one sprint without avoidable delivery risk.
