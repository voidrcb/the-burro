---
title: "Sprint 0.3 Proposal — Sandbox Integrations and Internal Assistant"
project: "Big Bend Burro"
sprint_id: "0.3"
phase_id: "P0"
phase_name: "Foundation"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 0.3 Proposal — Sandbox Integrations and Internal Assistant

## Proposal intent

Wire up the first real external services and deliver Burro’s first internal-only usefulness so the owners can feel time savings before the public platform grows.

## Proposal basis

- Blueprint phase P0 includes booking/payment sandbox integrations and internal Burro modules for property and artisan planning.
- Delivery plan seeds B007-B008 prioritize Lodgify or Hospitable, Stripe, email provider setup, and the internal Burro assistant.
- White paper Part II explicitly recommends a SaaS-first stack and says Burro should start with useful workflows, not mythology.
- Internal modules defined in the blueprint are ops.property_planner and ops.artisan_assistant.

## What

### In scope

- Set up non-production accounts, credentials, webhook targets, and test data for lodging, payments, email, and automation.
- Create the first Burro internal assistant shell that can answer property-planning and artisan-planning questions from approved memory views.
- Add task lookup, draft-email assistance, and source-backed research retrieval for internal use only.
- Create the first cost and feasibility helpers that the owners can use while planning units, workshop needs, and equipment decisions.

### Deliverables

- Configured sandbox integrations for lodging, Stripe, email, and automation.
- Internal Burro interface or command surface with property and artisan modes.
- Retrieval layer over approved memory/l3 artifacts.
- Basic prompt pack, policy rules, and tool allowlist for internal use.
- Pilot models or helpers for lodging feasibility and early artisan planning.

### Out of scope

- No public Burro concierge yet.
- No autonomous sending or mutation of external systems without review.
- No production payments or guest data migration.

## How

### Implementation approach

1. Use a provider-abstraction mindset even in sandbox so you do not hard-wire the entire future platform to a single vendor before real usage patterns are known.
2. Implement the first policy gateway now, even if it is small. The assistant can propose actions and draft content, but tool execution and write-back must stay explicit and logged.
3. Expose only a narrow toolset: task lookup, research retrieval, draft generation, and maybe sandbox booking lookup. Keep all high-risk actions behind human review.
4. Ground the assistant in the canonical packs, not in raw ungoverned notes. This aligns the assistant with the project’s truth model from the beginning.
5. Structure the UI around practical owner tasks: ‘help me plan the cabin’, ‘help me plan the workshop’, ‘summarize the land blockers’, ‘draft a message’, and ‘show me the current assumption set’.
6. Store test events from webhooks and external providers so later public sprints can be validated against real payload shapes.

### Data and system contracts touched

- `assistant config and prompt pack`
- `integration credential placeholders and webhook configs`
- `retrieval index seeds for internal memory`
- `task and draft-message artifacts`

## Why

- This sprint delivers the first felt benefit to Chuck and Susan. It proves the project is making the business lighter, not just producing documents.
- It also hardens the platform path by testing the external service shapes early, before public traffic depends on them.
- The white paper’s recommendation is clear: manual workflows first, then automations, then retrieval, then orchestration. This sprint implements exactly that order.
- By keeping the scope internal-only, it creates confidence without exposing rough edges to guests.

## Review

### Questions to resolve before commit

- Do you want Burro’s first interface to be a simple internal chat, a task-oriented dashboard with embedded prompts, or both?
- Which lodging vendor do you want to test first: Lodgify or Hospitable?
- Should email drafting live inside Burro directly, or in a separate content utility that Burro calls?

### Dependencies

- Sprint 0.1 memory structure
- Sprint 0.2 site/backend shell
- API keys and sandbox account creation

### Definition of done

- Sandbox bookings, payments, and email events can be created and observed end-to-end in a test environment.
- Burro answers internal planning questions with grounded references to approved project memory.
- The assistant does not fabricate policy, pricing, or availability when that information is missing.
- All assistant actions and tool calls are logged.

### What this sprint unlocks next

- Public Website and Blog Launch
- Lodging Booking Flow
