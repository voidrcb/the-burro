---
title: "Sprint 2.2 Proposal — Public Equipment Rental"
project: "Big Bend Burro"
sprint_id: "2.2"
phase_id: "P2"
phase_name: "Expansion"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 2.2 Proposal — Public Equipment Rental

## Proposal intent

Expose the rental business publicly once the internal asset and scheduling model is proven, with deposits, inspection evidence, and local-delivery logic treated as core rather than optional details.

## Proposal basis

- Blueprint P2 activation includes public equipment rental, and acceptance requires rental bookings to be created, rescheduled, and closed with inspection evidence.
- Feature registry includes equipment_rental_service and the rental_asset model.
- Equipment-rental research says the local moat is delivery, proximity, and disciplined logistics, not metro-style fleet scale.
- Conversation notes tie the equipment concept to real local need and to the water project, but also warn that people are hard on machines.

## What

### In scope

- Launch the public rental catalog, quote/request flow, and reservation process.
- Implement deposits, damage checks, scheduling windows, and inspection evidence capture.
- Support delivery logic, local-availability messaging, and rescheduling policies.
- Create the operator workflow for check-out, check-in, maintenance hold, and issue escalation.

### Deliverables

- Public rental page and asset cards.
- Rental booking flow with deposits and required policy acknowledgements.
- Inspection checklist and evidence-upload path.
- Operator rental operations dashboard.
- Reschedule/cancel/close-out workflow.

### Out of scope

- No large fleet expansion.
- No blind self-service for every scenario if manual review is safer.
- No promise of instant availability if delivery and maintenance realities make that irresponsible.

## How

### Implementation approach

1. Map the rental_asset model into a public-facing product lane that clearly communicates machine type, intended use, delivery requirements, and constraints.
2. Use the rental platform integration for inventory and scheduling where possible, but ensure deposits, inspection evidence, and local tax logic are modeled explicitly in your own records.
3. Build a mobile-friendly inspection workflow because the evidence is created in the field, not at a desk.
4. Track the entire lifecycle: quoted, reserved, delivered, active, returned, inspected, maintenance, closed.
5. Require structured acknowledgement of rules around misuse, damage, delivery windows, and operator responsibilities.
6. Treat delivery and maintenance notes as first-class events because those are what make or break the business in a remote county.

### Data and system contracts touched

- `rental_asset`
- `rental booking lifecycle object`
- `inspection evidence record`
- `deposit and tax event records`

## Why

- This sprint exposes a revenue stream that the white paper treats as a local-moat utility business, but only after the internal lane is ready.
- It also forces the project to get serious about field operations: inspection evidence, deposits, and maintenance are the truth surface of this business.
- Because the equipment market is logistics-constrained, good software discipline creates real defensibility.
- Launching this too early would create damage risk; launching it after internal prep makes it manageable.

## Review

### Questions to resolve before commit

- Should the first release be full self-service booking, or quote-request plus operator approval?
- Do you want to support one flagship machine first, or multiple asset types in the initial public release?
- How much photo/video evidence is required at pickup and return?

### Dependencies

- Internal asset and scheduling prep from Sprint 1.3
- Payments and policy gateway
- Insurance and operating-policy decisions

### Definition of done

- A public customer can request or place a rental booking through the defined flow.
- Rental reservations can be rescheduled and closed with inspection evidence.
- Deposit handling, tax logic, and asset-state transitions behave correctly.
- Operators can mark an asset unavailable for maintenance without breaking the public system.

### What this sprint unlocks next

- Livestream Network and Analytics
- Partner Marketplace and Task Orchestration
