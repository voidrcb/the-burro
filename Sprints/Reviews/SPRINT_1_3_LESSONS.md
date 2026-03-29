# Sprint 1.3 Lessons Learned — Workshops and Equipment Operations Prep

**Synthesized:** 2026-03-16
**Sprint Duration:** Single-day approval-to-completion cycle
**Actors:** HYDE (Enhance, Approve, Synthesize), JEKYLL (Review, Implement)

---

## What Worked Well

### 1. Amendment-Driven Clarity
All 7 JEKYLL findings were explicitly addressed with amendments before implementation. The workshop model supersession (A-1.3.1), capacity source-of-truth (A-1.3.2), and scope constraints (A-1.3.5) prevented implementation drift.

### 2. Existing Asset Consolidation
JEKYLL encountered partial workshop implementation files and consolidated them rather than building a parallel stack. This preserved existing work and reduced duplication.

### 3. List-First MVP Commitment
The A-1.3.3 calendar list-first commitment reduced frontend scope while satisfying acceptance criteria. Month-grid remains optional polish rather than blocking launch.

### 4. Intake Schema Versioning
The intake schema versioning model with stable `questionId` values ensures stored registration answers remain interpretable after future schema changes.

### 5. Scaffold-Mode Continuation
Scaffold-mode confirmation capture (already proven in Sprint 1.2) applied cleanly to workshop registrations, maintaining consistent verification approach across booking and registration flows.

### 6. Internal Equipment Prep
Equipment scheduler stayed read-mostly with simple create/cancel, keeping P1 scope focused on workshop launch while laying groundwork for P2 equipment rental.

---

## What Caused Friction

### 1. Client/Server Import Boundary
Workshop components initially imported session helpers from the server content loader, breaking the production build. Required moving session-label helpers to a pure shared module.

### 2. TypeScript Route Type Sync
`pnpm typecheck` failed until the build regenerated Next route types. The typecheck-after-build pattern is now documented as the reliable sequence.

### 3. Overlapping File Names
Partial workshop files from earlier sprints used overlapping names, requiring consolidation rather than clean creation.

### 4. No Test Suite for Sprint Area
No test script configured for workshop or equipment routes. Quality gates rely on lint, typecheck, and build only.

---

## Patterns to Carry Forward

| Pattern | Description | Evidence |
|---------|-------------|----------|
| Amendment-before-implement | All findings resolved with explicit amendments before JEKYLL PHASE 4 | 7 amendments in proposal |
| Scaffold-mode proof | Local capture validates flow without external provider | Registration confirmation stored locally |
| Intake versioning | Schema version + stable questionIds | `schemaVersion` field in intake schemas |
| Capacity source-of-truth | CMS-authored with single-writer decrement | Registration API is only writer |
| Component consolidation | Integrate existing assets rather than duplicate | Workshop components merged |
| List-first UI | Simple list view before complex calendar | Workshop catalog and calendar |

---

## Patterns to Avoid

| Anti-Pattern | Description | Mitigation |
|--------------|-------------|------------|
| Server-only imports in client | Breaks production build | Use pure shared modules for client-accessible helpers |
| Typecheck before build | Route types may not exist | Always build first, then typecheck |
| Parallel implementation stacks | Creates maintenance burden | Consolidate existing assets |
| Complex calendar MVP | Delays launch | Commit to list-first, grid as polish |
| Full equipment CRUD in P1 | Scope creep | Read-mostly + simple create/cancel only |

---

## Carryover Items

1. **Waitlist logic** — Deferred to observed demand
2. **Rich equipment maintenance editing** — Deferred to later sprint
3. **Public equipment rental checkout** — Deferred to P2
4. **Live email delivery** — Scaffold-mode local capture remains proof path
5. **Month-grid calendar** — Optional polish if list-first stable
6. **Workshop concurrency model** — Local single-writer acceptable for MVP scale

---

## Recorded Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D-1.3.1 | Workshop model supersedes old `Workshop` type with JSON-backed `WorkshopProgram` | Prevents content contract drift |
| D-1.3.2 | Capacity uses CMS-authored with local decrement model; registration API is single writer | Suitable for scaffold-mode MVP |
| D-1.3.3 | Calendar committed to list-first; month-grid is optional polish | Reduces frontend scope risk |
| D-1.3.4 | Intake schemas require stable `questionId` and `schemaVersion` | Ensures stored answers remain interpretable |
| D-1.3.5 | Equipment scope constrained to read-mostly + simple create/cancel | P1 boundary preserved |
| D-1.3.6 | Session state uses distinct public labels: "Register Now" / "Registration Full" / "Session Cancelled" | Operational clarity |

---

## Artifacts Index

| Artifact | Location |
|----------|----------|
| Sprint Proposal (Enhanced) | `Sprints/Proposals/06_sprint_1_3_workshops_and_equipment_operations_prep.md` |
| Jekyll Findings | `Sprints/Reviews/SPRINT_1_3_JEKYLL_FINDINGS.md` |
| Implementation RECAP | `Sprints/Reviews/SPRINT_1_3_RECAP.md` |
| Validation Evidence | `Sprints/Reviews/evidence/sprint-1-3/validation_summary.md` |
| This Lessons Document | `Sprints/Reviews/SPRINT_1_3_LESSONS.md` |

---

## Transition Notes for Sprint 1.4

### What Sprint 1.4 Inherits

- **Public workshop catalog** at `/workshops` with detail pages and registration flow
- **Workshop registration** with waiver capture, intake versioning, and scaffold confirmation
- **Workshop operator panel** in assistant shell showing registration activity
- **Internal equipment scheduler** with asset visibility and simple reservation create/cancel
- **Distinct session state labels** for open/full/cancelled workshops

### What Sprint 1.4 Should Consider

1. **Shop and Artisan Integration** — Sprint 1.4 adds shop and artisan marketplace; may need workshop cross-sells
2. **FAQ Burro** — Deferred from Sprint 1.2; consider whether conversational support covers workshops
3. **Live Provider Activation** — If activating Postmark/Lodgify, workshop confirmations can piggyback
4. **Capacity Monitoring** — If registrations increase, revisit concurrency model

### Dependencies for Sprint 1.4

- All Sprint 1.3 routes and APIs stable
- Workshop CMS content available for cross-referencing
- Equipment asset data available for artisan integration planning

---

## Sprint 1.3 Status: CLOSED

Next: HYDE PHASE 1 (ENHANCE) for Sprint 1.4
