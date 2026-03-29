# Sprint 0.1 Jekyll Findings

**Reviewed:** 2026-03-15T19:09:05-05:00
**Sprint:** 0.1
**Proposal:** `Sprints/Proposals/01_sprint_0_1_knowledge_base_and_tracker_setup.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 1
- HIGH: 2
- MEDIUM: 2
- LOW: 1
- INFO: 1

## Findings

### CRITICAL

#### JF-001: Evidence registry contract is not implementable as written

**Severity:** CRITICAL

**Evidence**
- The proposal requires `EVIDENCE_REGISTRY.json` to "register all existing source files" while also assigning source IDs that must match Blueprint `S001-S016`.
- The blueprint source registry is not a complete inventory of the current repo. `S001` points to `metalminds_L3_canonical_combined.md`, which does not exist in this workspace.
- The current repo contains files not represented in the blueprint registry, including the white paper DOCX, the highlights DOCX, the summary PNG, and `assets/design-palettes/6402042159658353253.JPG`.

**Impact**
- Deliverable D2 and the related acceptance criteria cannot be completed deterministically without redefining the ID policy.
- Any downstream retrieval layer built on these IDs will inherit broken references.

**Required change**
- Hyde should amend the proposal to define one of these approaches explicitly:
  1. Use blueprint IDs only for blueprint-listed sources and add a separate Burro-local ID range for additional files.
  2. Revise the blueprint source registry before implementation.

### HIGH

#### JF-002: Workspace scaffold instructions do not actually match the blueprint layout

**Severity:** HIGH

**Evidence**
- The proposal says the workspace must match Blueprint `workspace_layout` exactly.
- The implementation list omits blueprint paths and files, including `README.md`, `DECISIONS.log`, `RUNS.jsonl`, `assistant/`, `website/`, `ops/runbooks/`, `ops/policy/`, `infra/`, and `data/analytics/`.
- The definition of done says all blueprint paths must exist.

**Impact**
- A literal implementation of the proposal would fail its own definition of done.
- Sprint 0.2 and 0.3 would inherit layout drift immediately.

**Required change**
- Amend the proposal so the deliverables and implementation checklist cover the full blueprint layout, or narrow the definition of done to the subset truly intended for Sprint 0.1.

#### JF-003: Property tracker schema references the wrong blueprint contract

**Severity:** HIGH

**Evidence**
- The proposal says the property/probate tracker schema is "per Blueprint `property_task` model."
- The blueprint `property_task` contract is a task schema with `task_id`, `task_group`, `priority`, `status`, `dependency_ids`, and `owner`.
- The proposed issue tracker schema uses different fields such as `issue_id`, `parcel_ref`, `issue_type`, `documents`, `next_action_date`, and `confidence`.

**Impact**
- The proposal currently conflates the task board and the issue register.
- Implementation would produce a new undocumented data contract with no approved canonical owner.

**Required change**
- Split the contracts explicitly:
  - `property_tracker.json` as a new issue-register schema approved in the proposal.
  - `property_tasks.json` as the implementation of the existing blueprint `property_task` schema.

### MEDIUM

#### JF-004: Operator-readiness acceptance cannot be verified during a local Jekyll run

**Severity:** MEDIUM

**Evidence**
- The definition of done includes: "Chuck and Susan can view the dashboard and understand what's blocked."
- This review/implementation workflow is local and non-interactive; there is no operator validation step defined in the sprint artifacts.

**Impact**
- The sprint can appear incomplete even if the files are built correctly.
- Hyde may approve implementation against an acceptance criterion Jekyll cannot close.

**Recommended change**
- Replace this with a measurable surrogate such as a dashboard readability checklist plus a pending operator review note.

#### JF-005: Control-file plan conflicts with the current repo's active memory discipline

**Severity:** MEDIUM

**Evidence**
- The repo already uses `memory/DECISIONS.md`, `memory/current_state.md`, and `memory/session_log.md`.
- The proposal adds root-level control files from the blueprint, including `DECISIONS.log`, `STATE.json`, and `PACK_REGISTRY.md`, but does not define coexistence rules.

**Impact**
- The project risks duplicating state across root control files and memory files from the first implementation sprint.
- Future agents may not know which artifact is authoritative.

**Recommended change**
- Add explicit governance language stating which files are canonical in Sprint 0.1 and which are compatibility scaffolds only.

### LOW

#### JF-006: Deliverable locations are inconsistent for the tracker viewer/dashboard

**Severity:** LOW

**Evidence**
- Deliverable D5 says "Property/probate tracker | JSON data + simple viewer" but gives only `data/trackers/property_tracker.json`.
- Deliverable D8 separately defines the operator dashboard at `ops/dashboards/internal_overview.md`.

**Impact**
- The implementation target is still understandable, but the deliverables table blurs the viewer boundary.

**Recommended change**
- Make D5 data-only and keep the rendered view exclusively under D8.

### INFO

#### JF-007: Sprint 0.1 is feasible after proposal cleanup, but utility-pricing closure remains deferred

**Severity:** INFO

**Evidence**
- The proposal's scoped artifacts are lightweight and file-based.
- The blueprint still lists `UTIL` as a phase gate requiring water, waste, and power options priced for the one-unit pilot.
- The proposal intentionally limits Sprint 0.1 to a pilot model shell with provisional inputs.

**Impact**
- This is acceptable for a foundation sprint, but Hyde should avoid treating Sprint 0.1 as utility-feasibility completion.

**Recommended change**
- Keep Sprint 0.1 framed as tracker and model setup, not as full one-unit pilot validation.

## Overall Assessment

Sprint 0.1 is technically feasible in this repo once the proposal is corrected for source-ID policy, workspace-layout scope, and the issue-tracker/task-schema split. The sprint remains appropriately conservative for Chuck and Susan because it stays internal, static, and offline-friendly.
