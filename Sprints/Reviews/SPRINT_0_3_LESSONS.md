# Sprint 0.3 Lessons Learned

**Sprint:** 0.3 — Sandbox Integrations and Internal Assistant
**Synthesized:** 2026-03-15
**Author:** HYDE
**Milestone:** P0 FOUNDATION COMPLETE

---

## Summary

Sprint 0.3 successfully delivered the integration scaffolding and internal assistant shell, completing P0 Foundation phase. The Jekyll/Hyde workflow handled significant scope amendments (8 findings, 3 HIGH) while maintaining forward progress.

**Duration:** ~6h 33m from APPROVED to COMPLETE
**Findings reviewed:** 8 (0 CRITICAL, 3 HIGH, 3 MEDIUM, 1 LOW, 1 INFO)
**All findings:** ACCEPTED with amendments
**Phase Status:** P0 FOUNDATION COMPLETE

---

## What Worked Well

### 1. Repo-Completable vs Provider-Backed Split
The JF-301 amendment (splitting deliverables into repo-verifiable scaffolding vs provider-dependent verification) allowed the sprint to complete without external account provisioning. This is a reusable pattern for any sprint with external dependencies.

### 2. Validated Runtime Alignment
The JF-302/JF-303 amendments (keeping webhooks in the validated Next.js app and maintaining Node 24.x) prevented runtime fragmentation. The sprint built on Sprint 0.2's proven foundation rather than introducing new execution paths.

### 3. Model Adapter Seam Pattern
The JF-305 amendment (explicit model-adapter interface with stub implementation) created a clean activation seam. The assistant shell is usable in "scaffold mode" and will activate fully when API credentials are provisioned.

### 4. Research Encyclopedia Integration
The JF-304 amendment (expanding retrieval to include Docs/Research/) ensures the artisan assistant can cite workshop and handicrafts research. Retrieval now covers both Sprint 0.1 outputs and validated encyclopedias.

### 5. Fixture-Based Webhook Testing
The JF-306 amendment (sample webhook fixtures) enables local verification without live provider accounts. Documented payload shapes can be validated even when provider APIs aren't accessible.

---

## What Caused Friction

### 1. Import Path Errors
Webhook routes initially had incorrect import paths (one directory too far up). Fixed before final typecheck.

**Lesson:** When adding new subdirectories, verify relative import paths against actual file locations.

### 2. Framework-Agnostic Service Design
Shared webhook service originally imported `next/server` types, breaking typecheck. Required refactoring to framework-agnostic request shape.

**Lesson:** Shared services should avoid framework-specific imports. Use abstract interfaces that concrete route handlers can adapt.

### 3. Runtime Verification Timeout
Local runtime harness for fixture posting timed out twice. Provider-style request logging remains inconclusive.

**Lesson:** Carried forward from Sprint 0.2 — local server orchestration needs longer timeouts or explicit readiness checks. Consider adding a test runner with proper fixture posting in Sprint 1.x.

### 4. Duration Variance
Sprint took 6h 33m vs earlier sprints' ~2h. Integration and assistant complexity is higher than pure scaffolding work.

**Lesson:** Integration sprints may need longer implementation windows. Don't assume all sprints have equal complexity.

---

## Patterns to Carry Forward

| Pattern | Description | Apply In |
|---------|-------------|----------|
| Repo-completable vs provider-backed split | Separate deliverables by verification scope | Any sprint with external dependencies |
| Validated runtime alignment | Build on existing verified app; don't introduce new execution paths | All frontend/backend work |
| Model adapter seam | Abstract interface with stub; real impl when credentials present | All LLM-dependent features |
| Fixture-based testing | Sample payloads for local verification | All webhook/API integrations |
| Framework-agnostic services | Shared services don't import framework types | All cross-module services |
| Research retrieval expansion | Include encyclopedias for domain grounding | All assistant modules |

---

## Patterns to Avoid

| Anti-Pattern | Problem | Alternative |
|--------------|---------|-------------|
| External credentials as sprint blockers | Can't complete without accounts | Split scope; scaffold first |
| Multiple runtime paths | Fragmentation between frontend/backend | Use validated app runtime |
| Node version changes mid-project | Invalidates previous verification | Pin versions; document actual |
| Framework-coupled services | Breaks typecheck in shared code | Abstract interfaces |
| Short runtime timeouts | Inconclusive verification | Longer timeouts; readiness checks |

---

## Carryover Items

| Item | Status | Target Sprint |
|------|--------|---------------|
| Live Lodgify webhook events | DEFERRED | When credentials provisioned |
| Live Stripe webhook events | DEFERRED | When credentials provisioned |
| Live Postmark webhook events | DEFERRED | When credentials provisioned |
| Real LLM inference | DEFERRED | When API key provisioned |
| Runtime fixture verification | INCONCLUSIVE | Sprint 1.1 or dedicated test setup |
| n8n automation | DEFERRED | Sprint 1.x |

---

## Recommendations for P1 MVP Launch

1. **Build on P0 foundation** — Use existing assistant shell, webhook routes, and integration scaffolds
2. **Activate incrementally** — Provision one provider at a time; verify each before next
3. **Add test runner** — Sprint 1.1 should include proper test suite for fixture verification
4. **Document activation paths** — Clear instructions for provisioning each external service
5. **Keep scaffold mode working** — Assistant should remain usable even without full credentials

---

## P0 Foundation Phase Summary

| Sprint | Status | Key Outputs |
|--------|--------|-------------|
| 0.1 | CLOSED | Workspace, evidence registry, trackers, DARQ, pilot model |
| 0.2 | CLOSED | Design tokens, frontend shell, content types, routes, validated toolchain |
| 0.3 | CLOSED | Integration scaffolds, webhook routes, assistant shell, policy gateway, retrieval |

**P0 Foundation Phase: COMPLETE**

All foundation work is now in place:
- Governed workspace with evidence registry and memory structure
- Property/probate tracking with task model
- Design system with blueprint-canonical palettes
- Next.js frontend with all route stubs
- Content types (MIRRORS and VIEW MODEL)
- Integration credential templates and webhook handlers
- Internal assistant shell with property planner and artisan modes
- Policy gateway and retrieval layer
- Feasibility helpers from pilot model

---

## Quality Gate Status After P0 Foundation

| Gate | Status | Notes |
|------|--------|-------|
| G0 | PASS | All source files ingested and registered |
| G1 | PASS | L2 capsule created |
| G3.5 | PARTIAL | High-risk claims not yet verified in L3 packs |
| LAND | PASS | Property blockers logged with next actions |
| UTIL | NOT STARTED | Requires actual utility pricing |
| B005 | PASS | Design tokens and media manifest |
| B006 | PASS | Staging shell with routes and content model |
| B007 | PASS (scaffold) | Integration scaffolds; activation deferred |
| B008 | PASS (scaffold) | Internal assistant shell; inference deferred |

---

## Sprint 0.3 Artifacts Index

| Artifact | Location | Purpose |
|----------|----------|---------|
| Proposal (approved) | `Sprints/Proposals/03_sprint_0_3_sandbox_integrations_and_internal_assistant.md` | Sprint definition |
| Jekyll findings | `Sprints/Reviews/SPRINT_0_3_JEKYLL_FINDINGS.md` | Review feedback |
| Jekyll recap | `Sprints/Reviews/SPRINT_0_3_RECAP.md` | Implementation summary |
| Lessons (this file) | `Sprints/Reviews/SPRINT_0_3_LESSONS.md` | Synthesis |
| Credential templates | `infra/integrations/` | Provider configs |
| Webhook fixtures | `data/fixtures/webhooks/` | Sample payloads |
| Webhook routes | `website/frontend/app/api/webhooks/` | API handlers |
| Prompt pack | `assistant/prompts/` | Burro prompts |
| Policy gateway | `assistant/config/policy.json` | Tool rules |
| Retrieval config | `assistant/config/retrieval.json` | Index config |
| Model adapter | `assistant/services/model-adapter.ts` | LLM interface |
| Property planner | `assistant/services/property-planner.ts` | Planning service |
| Artisan assistant | `assistant/services/artisan-assistant.ts` | Workshop service |
| Chat shell | `website/frontend/app/assistant/` | Internal UI |
| Feasibility helpers | `assistant/services/feasibility/` | Cost calculators |

---

## Transition to P1 MVP Launch

P0 Foundation is complete. The next phase is P1 MVP Launch (Sprints 1.1-1.4):

| Sprint | Focus | Foundation Used |
|--------|-------|-----------------|
| 1.1 Public Website Launch | Live content, blog | Frontend shell, design tokens, content types |
| 1.2 Lodging Booking | Booking flow | Lodgify scaffold, `/stay` route, LodgingUnit type |
| 1.3 Workshops | Workshop catalog | Artisan assistant, Workshop type, research retrieval |
| 1.4 Shop/Activism | Store, activism hub | Stripe scaffold, content types, assistant patterns |

**Operator Readiness Progression:**
- P0: R0_OBSERVE (Chuck and Susan watched setup)
- P1: R1_ASSISTED (guided use with templates and approval gates)
