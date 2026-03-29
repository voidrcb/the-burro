# Sprint 0.1 Lessons Learned

**Sprint:** 0.1 — Knowledge Base and Tracker Setup
**Synthesized:** 2026-03-15
**Author:** HYDE

---

## Summary

Sprint 0.1 successfully established the foundational workspace, evidence registry, conversation capsule, property trackers, and pilot model shell. The Jekyll/Hyde workflow operated as designed, with one full cycle from PENDING → ENHANCED → REVIEWED → APPROVED → COMPLETE.

**Duration:** ~3 hours from initial enhancement to completion
**Findings reviewed:** 7 (1 CRITICAL, 2 HIGH, 2 MEDIUM, 1 LOW, 1 INFO)
**All findings:** ACCEPTED with amendments

---

## What Worked Well

### 1. Jekyll/Hyde Separation of Concerns
The dual-agent model proved effective:
- **Hyde** caught strategic issues (scope, governance, ID policy) during enhancement
- **Jekyll** caught implementation issues (schema conflicts, missing paths, verification gaps)
- No redundant work between phases

### 2. Amendment-Driven Refinement
The CRITICAL finding (JF-001) about evidence registry IDs could have blocked the sprint. Instead, the dual-ID policy (Blueprint S001-S016 + Burro-local B001+) resolved it cleanly without requiring blueprint revision or scope reduction.

### 3. Scaffold vs Active Directory Split
Separating "directories with deliverables" from "empty stubs for later" (JF-002 amendment) prevented definition-of-done confusion and made the sprint scope concrete.

### 4. File Governance Clarification
Explicitly documenting which files are canonical (`memory/`) vs scaffold stubs (root control files) prevents future state confusion (JF-005 amendment).

### 5. Static File Approach
JSON + markdown with no database worked well for P0 Foundation. Kept infrastructure minimal while proving the data contracts.

---

## What Caused Friction

### 1. Blueprint Source Registry Mismatch
Blueprint listed 16 sources (S001-S016) but some don't exist in repo (`metalminds_L3_canonical_combined.md`) and repo has files not in blueprint. This required the dual-ID policy amendment.

**Lesson:** When building from a blueprint, validate source inventories before implementation. Blueprint and reality will drift.

### 2. Schema Conflation in Original Proposal
The proposal said "per Blueprint property_task model" but then listed different fields. Jekyll correctly flagged this (JF-003).

**Lesson:** When referencing external schemas, verify field-level alignment. "Based on X" is ambiguous; explicit schema definitions are clearer.

### 3. Unverifiable Acceptance Criteria
"Chuck and Susan can understand the dashboard" cannot be verified in an automated workflow. Replaced with readability checklist (JF-004).

**Lesson:** Acceptance criteria must be machine-verifiable or explicitly marked as "pending human review."

### 4. Windows Sandbox Tooling
Jekyll noted that `apply_patch` failed in Windows and required PowerShell fallback for file creation.

**Lesson:** Sprint implementations should not assume Unix tooling. Document platform-specific workarounds.

---

## Patterns to Carry Forward

| Pattern | Description | Apply In |
|---------|-------------|----------|
| Dual-ID policy | Blueprint IDs for canonical sources, local IDs for additions | All evidence ingestion |
| Active vs scaffold split | Clearly separate deliverable directories from stubs | All workspace expansions |
| File governance table | Document canonical vs compatibility files | Any sprint adding control files |
| Readability checklist | Replace subjective criteria with measurable surrogates | Dashboard and UI deliverables |
| Schema splitting | Issue registers separate from task models | Tracker and data model design |

---

## Patterns to Avoid

| Anti-Pattern | Problem | Alternative |
|--------------|---------|-------------|
| "Match blueprint exactly" | Blueprint may not match repo reality | Validate and scope explicitly |
| Implicit schema references | "Per Blueprint X" without field verification | Inline schema definitions |
| Unverifiable acceptance | Human understanding not testable | Checklists + deferred human review |
| Assumed Unix tooling | Breaks in Windows sandbox | Document platform fallbacks |

---

## Carryover Items

| Item | Status | Target Sprint |
|------|--------|---------------|
| Operator review (Chuck/Susan) | PENDING | Post-0.1 validation |
| UTIL gate (utility pricing) | DEFERRED | Future sprint (requires quotes) |
| Missing blueprint source S001 | DOCUMENTED | Evidence registry notes it |

---

## Recommendations for Sprint 0.2

1. **Use existing scaffold paths** — Don't recreate workspace layout; extend from Sprint 0.1 structure
2. **Reference Sprint 0.1 outputs** — Evidence registry, DARQ, and property trackers are now available for design system and website shell work
3. **Apply readability checklist pattern** — Any dashboard or operator-facing output should include the same checklist approach
4. **Watch for blueprint drift** — Sprint 0.2 touches design palettes; verify palette photo paths against blueprint before extraction

---

## Quality Gate Status After Sprint 0.1

| Gate | Status | Notes |
|------|--------|-------|
| G0 | PASS | All source files ingested and registered |
| G1 | PASS | L2 capsule created |
| G3.5 | PARTIAL | High-risk claims not yet verified in L3 packs (future) |
| LAND | PASS | Property blockers logged with next actions |
| UTIL | NOT STARTED | Requires actual utility pricing |

---

## Sprint 0.1 Artifacts Index

| Artifact | Location | Purpose |
|----------|----------|---------|
| Proposal (approved) | `Sprints/Proposals/01_sprint_0_1_knowledge_base_and_tracker_setup.md` | Sprint definition |
| Jekyll findings | `Sprints/Reviews/SPRINT_0_1_JEKYLL_FINDINGS.md` | Review feedback |
| Jekyll recap | `Sprints/Reviews/SPRINT_0_1_RECAP.md` | Implementation summary |
| Lessons (this file) | `Sprints/Reviews/SPRINT_0_1_LESSONS.md` | Synthesis |
| Evidence registry | `memory/l0/EVIDENCE_REGISTRY.json` | Source catalog |
| Conversation capsule | `memory/l2/capsules/CAPSULE_2026_03_08.md` | March 8 themes |
| DARQ register | `memory/l2/capsules/DARQ_2026_03_08.json` | Decisions, assertions, risks, questions |
| Property tracker | `data/trackers/property_tracker.json` | Land/probate issues |
| Property tasks | `data/trackers/property_tasks.json` | Work items |
| Pilot model | `data/models/pilot_unit_model.json` | Lodging comparison |
| Dashboard | `ops/dashboards/internal_overview.md` | Operator view |
