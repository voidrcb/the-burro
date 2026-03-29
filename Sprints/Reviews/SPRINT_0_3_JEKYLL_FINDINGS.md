# Sprint 0.3 Jekyll Findings

**Reviewed:** 2026-03-15T20:25:54.2624623-05:00
**Sprint:** 0.3
**Proposal:** `Sprints/Proposals/03_sprint_0_3_sandbox_integrations_and_internal_assistant.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 0
- HIGH: 3
- MEDIUM: 3
- LOW: 1
- INFO: 1

## Findings

### HIGH

#### JF-301: Required external sandbox accounts and API credentials are not repo-satisfied prerequisites

**Severity:** HIGH

**Evidence**
- The proposal marks Lodgify sandbox, Stripe test mode, Postmark sandbox, and an OpenAI/Anthropic API key as `REQUIRED` dependencies.
- The current repo contains no local credential templates, seeded sandbox payloads, or setup evidence for those providers.
- Sprint 0.3 definition of done requires real webhook receipt and logged test events.

**Impact**
- Jekyll can scaffold configs and handlers, but cannot complete the proposal's integration acceptance criteria from repo state alone.
- Review/implementation could overstate completion unless the sprint explicitly distinguishes between scaffolded integration support and provider-backed verification.

**Required change**
- Amend the proposal to split external-provider work into two modes:
  1. repo-completable scaffolding and fixture support
  2. operator-provisioned sandbox verification once credentials exist.
- If Hyde wants provider-backed testing to remain in-scope, mark user action required for local credential provisioning.

#### JF-302: Proposed webhook implementation path diverges from the established Sprint 0.2 application shape

**Severity:** HIGH

**Evidence**
- Sprint 0.2 established a verified Next.js app in `website/frontend/app/`.
- Sprint 0.3 proposes webhook routes under `website/backend/api/webhooks/`.
- The proposal does not define whether `website/backend/` is a separate runtime, a future service, or just a filesystem placeholder.

**Impact**
- Implementing handlers under `website/backend/api/webhooks/` risks creating non-executable route stubs disconnected from the only validated app runtime.
- Hyde's acceptance criteria imply actual 200 responses and logged events, which is materially different from static backend placeholders.

**Required change**
- Pick one runtime for Sprint 0.3 and state it explicitly.
- If the validated Next.js app remains the execution target, move webhook acceptance to API routes under `website/frontend/app/api/...` or narrow the deliverable to documentation-only stubs.

#### JF-303: The proposal's Node 20 `.nvmrc` requirement conflicts with the toolchain already validated in Sprint 0.2

**Severity:** HIGH

**Evidence**
- Sprint 0.2 already created `website/frontend/.nvmrc` and validated `pnpm lint`, `pnpm typecheck`, and `pnpm build` on the local Node 24 / pnpm 10 toolchain.
- Sprint 0.3 pre-resolves a decision to add `.nvmrc` with Node 20.x.
- No migration or compatibility rationale is provided for replacing the currently verified runtime.

**Impact**
- Blindly forcing Node 20.x can invalidate the existing verified frontend environment and create avoidable drift between recap evidence and current instructions.
- The proposal currently turns a tooling preference into a hidden replatforming task.

**Required change**
- Either keep the existing verified `.nvmrc` and document Node 24 as the active local baseline, or provide an explicit compatibility/migration step with revalidation requirements.

### MEDIUM

#### JF-304: Retrieval scope is too narrow to satisfy the proposal's promised citation behavior

**Severity:** MEDIUM

**Evidence**
- The retrieval plan only enumerates Sprint 0.1 outputs such as DARQ, property tracker, property tasks, and pilot model.
- The acceptance criteria also require the artisan assistant to answer workshop questions with research citations.
- The blueprint's knowledge system expects retrieval views to be built from published packs and validated research, not only early sprint JSON outputs.

**Impact**
- Property-planning answers can be grounded from Sprint 0.1 artifacts, but artisan and workshop assistance will be underpowered or ungrounded if research packs are excluded.
- Jekyll could technically ship a retrieval config that passes JSON parsing while still failing the intended grounding standard.

**Recommended change**
- Expand the retrieval contract to include the specific `Docs/Research/` and/or published L3 sources needed for artisan and workshop citations, or narrow the assistant scope to property planning only for this sprint.

#### JF-305: Assistant functionality is underspecified between prompt scaffolding, retrieval, and actual model invocation

**Severity:** MEDIUM

**Evidence**
- The proposal promises a functional internal chat interface, citation behavior, unknown handling, and offline-friendly retrieval.
- It does not define a model adapter contract, local inference fallback, or the boundary between stubbed responses and real answered chat.
- The repo currently has no assistant runtime or service abstraction for LLM calls.

**Impact**
- The sprint is still feasible, but success criteria are ambiguous: a UI shell and service contracts are very different from a genuinely answering assistant.
- Without clarification, recap quality can drift into over-claiming capability.

**Recommended change**
- Reframe the implementation target as an internal assistant shell with retrieval-backed context assembly and explicit placeholder/model-adapter seams, unless provider keys and runtime wiring are confirmed.

#### JF-306: Webhook verification criteria need local fixtures when provider-backed test events are unavailable

**Severity:** MEDIUM

**Evidence**
- Definition of done requires captured booking, payment, and email test events in `data/sandbox-events/`.
- The proposal does not define sample payload fixtures, replay scripts, or a local event-generation strategy.
- Multiple required providers are external prerequisites rather than repo-native assets.

**Impact**
- Even if handlers are scaffolded correctly, Jekyll may have no repeatable local way to prove event logging behavior.
- This weakens acceptance and makes later debugging harder.

**Recommended change**
- Add provider fixture files or normalized sample payloads as first-class sprint deliverables so logging behavior can be verified without live accounts.

### LOW

#### JF-307: The integration matrix introduces n8n, but the deliverables and acceptance tests never make it concrete

**Severity:** LOW

**Evidence**
- The implementation approach lists `n8n (self-hosted)` as the automation candidate.
- No deliverable, output path, or acceptance criterion references n8n configuration or workflows afterward.

**Impact**
- This does not block Sprint 0.3, but it creates noise about whether automation setup is actually part of the sprint.

**Recommended change**
- Either remove n8n from the sprint narrative or add a narrowly scoped config/documentation deliverable for it.

### INFO

#### JF-308: Sprint 0.3 remains feasible if Hyde narrows it to scaffolded integrations and an internal assistant shell

**Severity:** INFO

**Evidence**
- Sprint 0.1 already produced the tracked property and feasibility inputs.
- Sprint 0.2 already produced the frontend shell, route stub, and validated app toolchain.
- The blueprint supports operator-only R1_ASSISTED activation and gradual rollout.

**Impact**
- The current repo is ready for config schemas, prompt packs, policy files, service contracts, and a grounded internal UI shell.
- The unstable parts are external-provider verification and any claim of fully operational assistant inference.

**Recommended change**
- Preserve Sprint 0.3 as the P0 closer, but describe it as a controlled operator-only scaffold with explicit seams for later provider activation.

## Overall Assessment

Sprint 0.3 is feasible in the current repo only if Hyde tightens the proposal around what Jekyll can actually verify from local state. The main issues are external-provider prerequisites, the mismatch between proposed webhook paths and the validated Next.js runtime, and a tooling/runtime drift introduced by the new Node 20 requirement. If Hyde narrows the sprint to scaffolded integration support, retrieval/policy contracts, and an internal assistant shell with explicit non-production seams, Jekyll can implement it cleanly in the next phase.
