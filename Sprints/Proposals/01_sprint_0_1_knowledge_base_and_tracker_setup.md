---
title: "Sprint 0.1 Proposal — Knowledge Base and Tracker Setup"
project: "Big Bend Burro"
sprint_id: "0.1"
phase_id: "P0"
phase_name: "Foundation"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 0.1 Proposal — Knowledge Base and Tracker Setup

## Proposal intent

Stand up the governed workspace, ingest the core source material, and turn the conversation, land problems, and research pack set into structured working truth that later code can actually use.

## Proposal basis

- Blueprint phase P0 calls for workspace and memory-pack setup, a property/probate tracker, and internal task management.
- Delivery plan seeds B001-B004 prioritize the conversation capsule, L3 research packs, the property/probate tracker, and the one-unit pilot cost model.
- White paper priority: solve land, water, power, access, seasonality, and safety first instead of jumping straight into customer-facing tech.
- Conversation source highlights a live probate blocker, wrong-tax parcel issue, and a seven-year holding pattern on land that cannot yet be sold.

## What

### In scope

- Create the project workspace skeleton with deterministic operational files such as README, STATE, DECISIONS, BACKLOG, RUNS, and PACK_REGISTRY.
- Ingest the white paper, blueprint, transcript, highlights, summary, and research files into the memory structure so later services can retrieve them consistently.
- Build the first conversation capsule and DARQ register from the March 8 conversation so that land, activism, workshop, and equipment ideas are captured as governed work items.
- Build the first property/probate tracker to manage title problems, lien-release status, wrong-parcel tax history, adjacent-lot acquisition, and next actions.
- Create the first version of the property task model so Chuck and Susan can see blocked, active, and completed work in one place.
- Create a machine-readable one-unit pilot feasibility model shell, even if some cost inputs stay provisional until utilities are priced.

### Deliverables

- Workspace scaffold with canonical folder layout and root control files.
- Conversation capsule with anchors, DARQ items, and linked source references.
- Property/probate tracker with issue states, owners, notes, and dependency fields.
- Task dashboard backed by the property_task schema.
- Starter pilot-model JSON or spreadsheet seed for lodging type comparison.

### Out of scope

- No public site, no booking flow, and no guest-facing assistant in this sprint.
- No final legal interpretation or automated legal advice.
- No design polish beyond what is needed to make internal tools readable and usable.

## How

### Implementation approach

1. Use the workspace layout and metadata contracts from the Metalminds source of truth so the sprint does not create throwaway structure that must be rebuilt later.
2. Normalize all current evidence into L0 and L2 artifacts before building any retrieval layer. The immediate coding target is not a chatbot; it is governed project memory.
3. Implement the property tracker as a simple internal web app or low-friction internal console backed by a relational schema. Keep the model explicit: parcel, issue, document, dependency, owner, status, next action, and review date.
4. Represent land and probate facts as attributed statements linked to source anchors so questionable claims can be labeled instead of silently becoming truth.
5. Generate the first dashboard with a very small UI footprint: a task list, a blockers panel, a document registry, and a next-actions panel.
6. Store pilot-unit assumptions in machine-readable form so later pricing, booking, and Burro-planning sprints can read the same object instead of retyping numbers by hand.

### Data and system contracts touched

- `property_task`
- `issue register for probate, parcel, lien, and permit blockers`
- `conversation capsule + DARQ sidecars`
- `pilot lodging model seed`

## Why

- This sprint converts the most dangerous project risk—hidden ambiguity—into visible work. Without a real tracker, land and probate issues keep living in memory and messages.
- Every later sprint depends on stable truth. Booking flows, public content, assistant answers, and pricing logic are all weaker if the source system is still ad hoc.
- This is the smallest sprint that makes the project materially safer without overwhelming the owners with a public launch or a complex UI.
- It also fits the project’s human-pace rule: internal clarity first, exposure later.

## Review

### Questions to resolve before commit

- Do you want the property/probate tracker to live as a custom internal app from day one, or should it begin as a simpler managed backend with a thin interface?
- Should the task model treat activism and land as separate boards, or one unified project board with tags and dependency links?
- Do you want the pilot cost model embedded in the tracker, or stored as a separate artifact that the tracker links to?

### Dependencies

- Current source files and research packs
- Agreement on workspace folder structure
- Decision on initial internal storage choice

### Definition of done

- All current source files are registered and reachable from the workspace.
- The conversation capsule exists and captures land, equipment, workshop, activism, and pacing themes.
- Chuck and Susan can see active land blockers and next actions in one place.
- The tracker cleanly separates confirmed facts, attributed facts, and open questions.

### What this sprint unlocks next

- Design System and Website Shell
- Sandbox Integrations and Internal Assistant
