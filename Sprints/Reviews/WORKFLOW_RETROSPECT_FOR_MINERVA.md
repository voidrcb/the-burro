# Workflow Retrospective for Minerva — Jekyll/Hyde Execution Through Sprint 1.1

**Recorded:** 2026-03-16T09:18:41.3261638-05:00
**Scope:** Sprint 0.1 through Sprint 1.1, including workflow friction outside direct sprint implementation
**Status:** Documentation-only update while handoff remains `waiting_for: HYDE`

## Purpose

This document captures what the user asked for, how Jekyll responded, what worked, what failed, and what Minerva should review if the goal is a lower-human-touch sprint loop.

## Current Delivery State

Completed by Jekyll so far:
- Sprint 0.1 review and implementation
- Sprint 0.2 review and implementation
- Sprint 0.3 review and implementation
- Sprint 1.1 review and implementation

Current handoff state at time of writing:
- `active_sprint`: `1.1`
- `proposal_status`: `COMPLETE`
- `waiting_for`: `HYDE`

## High-Level Prompt / Response Timeline

### Phase A — Workflow boundary pressure

1. **User prompt:** Requested polling or looping until it became Jekyll's turn.
   **Jekyll response:** Refused repeatedly and explained that the active workflow is `CHECK-WORK-EXIT` only, with no polling, sleeping, or persistence.
   **Outcome:** Guardrail held. No invalid loop was started.

2. **User prompt:** Repeated variations such as “continue polling”, “poll and work”, “loop or work”.
   **Jekyll response:** Rechecked handoff when asked, reported whether it was Jekyll's turn, and exited when it was not.
   **Outcome:** Guardrail enforcement remained consistent, but required repeated human prompting and repeated refusal text.

3. **User prompt:** Expressed frustration that the workflow still required a human to run Hyde/Jekyll alternately.
   **Jekyll response:** Acknowledged the limitation but did not violate the workflow. Suggested rerunning only after the handoff changed.
   **Outcome:** Correct behavior under the rules, but it exposed that the current system does not satisfy the user's automation goal.

### Phase B — Sprint execution results

4. **User prompt:** Asserted handoff had changed and asked Jekyll to continue.
   **Jekyll response:** Checked the handoff, then executed the correct review or implementation phase when `waiting_for` was `JEKYLL`.
   **Outcome:** Sprint 0.1, 0.2, 0.3, and 1.1 all advanced successfully when the handoff file actually reflected Jekyll's turn.

5. **User prompt:** Asked “is it your turn?” at multiple points.
   **Jekyll response:** Read `Sprints/.sprint_handoff.json` and answered from the real state instead of trusting the prompt.
   **Outcome:** Turn-taking stayed grounded in repo state.

### Phase C — Out-of-band documentation request

6. **User prompt:** Requested that, while paused, Jekyll document what was done, what was discussed, what prompts were given, what responses were made, and what worked or failed so Minerva could review it.
   **Jekyll response:** Treated this as out-of-band documentation work only, leaving the handoff state unchanged.
   **Outcome:** This retrospective was created and memory files were updated without breaking the sprint workflow.

## What Worked

- **Handoff gating worked.** Jekyll consistently read `Sprints/.sprint_handoff.json` and only acted when the state actually assigned work to Jekyll.
- **Review discipline worked.** Sprint proposals were not implemented blindly; feasibility findings forced corrections before implementation.
- **Implementation discipline worked.** Approved proposal amendments from Hyde were carried into code, recap documents, and handoff updates.
- **Repo-completable vs provider-backed split worked well.** This pattern prevented overclaiming on Sprint 0.3 and carried forward into Sprint 1.1.
- **Quality gates were useful.** Lint, typecheck, and build exposed real issues quickly, especially path drift, framework-boundary leakage, and content-schema mismatches.
- **Memory tracking generally worked.** `current_state.md`, `session_log.md`, recap files, findings files, and evidence summaries now provide a usable audit trail.

## What Did Not Work

- **The user’s automation goal is not met.** The current Jekyll prompt explicitly forbids polling and persistence, so Jekyll/Hyde cannot self-continue without an external scheduler or a human rerunning prompts.
- **Proposal-file drift occurred.** At least one approved sprint state lived in the handoff notes but was not fully reflected back into the proposal file on disk. Jekyll had to implement from handoff state rather than proposal text alone.
- **`apply_patch` was unreliable in this Windows environment.** Manual edits were often done through PowerShell `Set-Content` because patching was not dependable here.
- **Windows sandbox execution was brittle.** Important commands frequently failed first with `windows sandbox: setup refresh failed`, forcing escalated reruns.
- **Runtime verification harnesses were unstable.** Local attempts to stand up the app and replay webhook fixtures timed out more than once, so some runtime checks remained inconclusive even when lint/typecheck/build passed.
- **Human turn confusion remained high.** Even with correct gating, the workflow produced repeated “is it your turn?” checks and repeated attempts to coerce polling behavior.

## Concrete Friction Cases Minerva Should Review

### 1. Workflow design mismatch

The system goal appears to be “Hyde and Jekyll continue without a human.”
The actual Jekyll contract is “check handoff, do one phase, exit.”

Those two ideas are incompatible unless Minerva or some external orchestrator owns:
- polling
- prompt re-invocation
- handoff watching
- timeout/retry scheduling

### 2. Single source of truth drift

Hydra/Hyde approval details were sometimes visible in the handoff but not rewritten into the proposal file. That creates ambiguity about which artifact Jekyll should trust.

### 3. Tool reliability in this environment

The workflow assumes ordinary file edits and command execution are cheap. In practice:
- patching was unreliable
- sandbox refresh failed repeatedly
- runtime verification was harder than compile-time validation

### 4. Validation realism

Build gates passed reliably.
Runtime fixture verification was much less reliable.
That means the workflow should distinguish more clearly between:
- compile-time confidence
- static-build confidence
- actual runtime confidence

## Recommendations for Minerva

1. If the goal is full autonomous continuation, move polling and prompt orchestration out of Jekyll and into Minerva, Hyde, or an external scheduler.
2. Require any Hyde approval amendment to update both the handoff file and the proposal file in the same step.
3. Standardize a Windows-safe edit path when `apply_patch` is unavailable, instead of leaving the agent to improvise.
4. Standardize a repeatable local runtime harness for Next.js route verification, especially for webhook and API seam testing.
5. Separate “repo-completable success” from “provider-backed activation success” in every later sprint, because that distinction has already proven useful.
6. Reduce ambiguity in user-facing turn handling by making the active actor and next required command more explicit in one canonical place.

## Net Assessment

Minerva's gating did a good job at preventing Jekyll from violating the declared workflow.
Minerva did a poor job at satisfying the user's larger operational goal of letting Hyde and Jekyll self-advance through sprints without a human.

Both statements can be true at once:
- the guardrails were effective
- the overall automation objective was not achieved by the current design

That gap is the main thing Minerva should review.
