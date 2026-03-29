# Sprint 1.3 Jekyll Findings

**Reviewed:** 2026-03-16T11:42:00-05:00
**Sprint:** 1.3
**Proposal:** `Sprints/Proposals/06_sprint_1_3_workshops_and_equipment_operations_prep.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 0
- HIGH: 2
- MEDIUM: 3
- LOW: 1
- INFO: 1

## Findings

### HIGH

#### JF-601: The proposal introduces a new workshop contract without reconciling it with the repo's existing workshop content model

**Severity:** HIGH

**Evidence**
- Sprint 1.3 defines `WorkshopProgram` and `WorkshopSession` with schedules, intake-schema references, status fields, and pricing structure.
- The current repo already has a canonical `Workshop` contract in `website/frontend/lib/content/types.ts` plus a `workshops` entry in `lib/content/config.ts`.
- That existing contract is materially narrower than Hyde's proposal and the current `website/cms/workshops/` directory only contains a shell MDX file, not the new JSON program structure.

**Impact**
- Sprint 1.3 is feasible, but Hyde has not yet said whether Jekyll is replacing the old workshop model, extending it, or creating a second parallel workshop schema.
- Without that decision, the repo risks ending the sprint with conflicting content contracts and validation paths.

**Required change**
- Amend the proposal to state explicitly that Sprint 1.3 supersedes the old workshop shell model with a JSON-backed `WorkshopProgram` structure for P1.
- Call out whether `lib/content/types.ts` and `lib/content/config.ts` are to be updated or retired for workshop content.

#### JF-602: Registration and capacity control are underspecified for a local JSON-backed source of truth

**Severity:** HIGH

**Evidence**
- The proposal promises local registration capture, confirmation flow, and capacity enforcement when sessions are full.
- The current repo has no workshop registration store, no workshop panel, and no workshop session mutation path.
- Acceptance criteria require that a guest can register for an open session and that full sessions show "Registration closed", but the proposal does not define how local registrations decrement `spotsAvailable` or prevent conflicting writes.

**Impact**
- The sprint is still buildable, but this is the core business rule for workshops.
- If Hyde leaves the source-of-truth logic vague, Jekyll can only approximate capacity with static content instead of a dependable registration workflow.

**Required change**
- Define whether `spotsAvailable` is operator-edited CMS data, derived from `capacity.max - confirmed_registrations`, or updated into local registration records only.
- Tighten acceptance to a repo-verifiable single-writer model, not a concurrency-safe production scheduler.

### MEDIUM

#### JF-603: The unified calendar decision is sensible, but the UI scope still reads broader than the risk posture allows

**Severity:** MEDIUM

**Evidence**
- PRD-1.3.1 narrows the concept to a unified calendar with category filtering.
- The risk section says calendar complexity should be mitigated by starting with a list view and treating a grid as enhancement.
- The deliverables table still names `WorkshopCalendar.tsx` without clarifying whether Sprint 1.3 is list-only, grid-only, or both.

**Impact**
- This does not block the sprint, but it leaves room for unnecessary frontend scope growth inside a sprint that already includes dynamic detail pages, intake forms, local registration, and an internal equipment scheduler.

**Recommended change**
- Amend the proposal to make list-first the committed MVP view.
- Treat a visual month grid as optional polish only if the core registration flow is already stable.

#### JF-604: Dynamic intake forms need an explicit answer schema and storage rule, not just per-type JSON question files

**Severity:** MEDIUM

**Evidence**
- PRD-1.3.5 says craft and photography workshops will each define their own intake schema in CMS.
- `WorkshopRegistration` currently stores `intakeResponses` as a generic `Record<string, string | number | boolean>`.
- The proposal does not define field IDs, validation rules, or how operators know which intake schema version produced a stored registration.

**Impact**
- Jekyll can ship a dynamic form, but the local records will be weakly interpretable unless the CMS schema and stored answers line up deterministically.
- That weakens later operator review and future migration to provider-backed registration tooling.

**Recommended change**
- Require each intake schema to use stable question IDs and a declared workshop-type key.
- Store the intake schema reference or version alongside each registration record.

#### JF-605: Equipment scheduler scope is still large relative to the current assistant surface

**Severity:** MEDIUM

**Evidence**
- The current assistant area only has `page.tsx`, `BookingPanel.tsx`, and the existing Burro feasibility shell.
- Sprint 1.3 proposes a new `/assistant/equipment` route, availability calendar, maintenance notes component, reservation schema, reservation CRUD, and asset loader.
- There is no existing equipment content or operator page scaffold in the repo today.

**Impact**
- The internal-only decision makes the work feasible, but the proposal still bundles several distinct operator tools into one sprint alongside the public workshop launch.
- That can erode review and verification quality if Hyde treats the equipment side as "just internal" and therefore low-risk.

**Recommended change**
- Constrain Sprint 1.3 equipment scope to read-mostly asset visibility plus simple reservation create/cancel behavior.
- Treat rich maintenance editing and advanced calendar interaction as deferable if workshop registration work runs long.

### LOW

#### JF-606: Closed-state language should distinguish between full sessions and cancelled sessions in the public UI

**Severity:** LOW

**Evidence**
- PRD-1.3.2 correctly defers waitlists and uses a simple closed state.
- `WorkshopSession` already distinguishes `open`, `full`, and `cancelled`.
- Acceptance criteria only mention showing "Registration closed" once capacity is reached.

**Impact**
- This does not block the sprint, but the public catalog and detail pages should not collapse operationally different session states into one undifferentiated message.

**Recommended change**
- Clarify how `full` and `cancelled` sessions are labeled in the public UI.
- Reserve generic "Registration closed" for full sessions only unless Hyde intentionally wants a single status label.

### INFO

#### JF-607: Sprint 1.3 is feasible if Hyde keeps it as a workshop launch plus internal equipment prep, not a stealth public rental platform

**Severity:** INFO

**Evidence**
- Sprint 1.1 already provides the public site shell and Sprint 1.2 already provides waiver and scaffold-mode confirmation patterns.
- Hyde sensibly keeps public equipment checkout, waitlists, payment processing, and external sync out of scope.
- The blueprint supports workshops in P1 and public equipment rental in P2.

**Impact**
- The repo is ready for a disciplined workshop catalog and registration sprint with internal equipment groundwork.
- Success depends on keeping workshop content, registration source-of-truth, and equipment-scheduler scope explicit.

**Recommended change**
- Preserve the current P1 boundary: public workshop launch, internal equipment operations prep, and scaffold-mode confirmation only.

## Overall Assessment

Sprint 1.3 is technically feasible, but Hyde should tighten the proposal before implementation begins. The biggest issue is that the proposal defines a substantially richer workshop program model without yet reconciling it with the repo's existing workshop content contract, while also promising local capacity enforcement without naming the concrete source-of-truth rule. If Hyde fixes those two points and keeps the calendar and equipment surfaces constrained, Jekyll can implement the sprint cleanly in the next phase.
