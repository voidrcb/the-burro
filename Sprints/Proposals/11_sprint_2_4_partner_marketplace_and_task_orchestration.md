---
title: "Sprint 2.4 Proposal — Partner Marketplace and Task Orchestration"
project: "Big Bend Burro"
sprint_id: "2.4"
phase_id: "P2"
phase_name: "Expansion"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 2.4 Proposal — Partner Marketplace and Task Orchestration

## Proposal intent

Expand the platform from self-owned offers into a managed network of partner experiences and local goods, while upgrading Burro from draft helper into a real orchestrator with human approvals.

## Proposal basis

- Blueprint P2 build scope includes partner marketplace and Burro task orchestration.
- Feature registry includes partner packages, mining history experience, local marketplace, and partner-led excursions.
- White paper positioning and partnership section says the project becomes stronger when it connects to local guides, artists, observatory-adjacent ecosystems, and preservation stakeholders.
- The project explicitly avoids launching regulated ferry transport or other high-risk early products, so partner-led packages are the scalable alternative.

## What

### In scope

- Create the partner catalog and partner-onboarding structures.
- Support partner-led experiences and local-maker goods as governed marketplace entries.
- Teach Burro to orchestrate multi-step internal tasks involving packages, partner coordination, and approval-required handoffs.
- Add moderation, commission, and partner-governance fields needed before the marketplace grows.

### Deliverables

- Partner registry and partner content/admin model.
- Marketplace or partner-experience presentation layer.
- Commission and approval-rule framework.
- Burro orchestration flows for package preparation and partner coordination.
- Moderation and publication workflow for partner offers.

### Out of scope

- No uncontrolled open marketplace.
- No autonomous external commitments without human approval.
- No attempt to support every possible partner type in the first release.

## How

### Implementation approach

1. Build the partner registry as a governed entity first. Each partner entry should carry contact, category, approval status, liability notes, and revenue-share or referral rules.
2. Treat marketplace publishing as a workflow, not a table dump. Partner offers need moderation, copy quality, and operational review.
3. Implement Burro orchestration as explicit sequences with approval gates: collect needed information, assemble a draft, request review, then execute allowed steps.
4. Support partner-led experiences as distinct from owned experiences in the experience model so risk, cancellation, and availability assumptions stay clean.
5. If local maker goods are included, keep inventory and fulfillment responsibilities explicit so the platform does not accidentally absorb the wrong logistics burden.
6. Log every orchestration step as an auditable artifact so human-in-the-loop remains real.

### Data and system contracts touched

- `partner registry record`
- `commission and governance rules`
- `partner experience listing objects`
- `Burro task-run records`

## Why

- This sprint is how the project gains breadth without owning every activity itself.
- It also operationalizes the white paper’s preservation-led network logic: the platform becomes stronger by coordinating local value, not replacing it.
- From the assistant perspective, orchestration is only worth doing once there are enough moving pieces to justify it. By this stage, there are.
- It is also the right place to draw the governance line so future partner growth does not turn into chaos.

## Review

### Questions to resolve before commit

- Do you want the first marketplace release to emphasize experiences, local maker goods, or both?
- Should Burro orchestration start with operator-only task runs, or be allowed to assemble guest-facing package drafts immediately?
- How formal do you want commission and partner-governance rules before the first partner goes live?

### Dependencies

- Itinerary builder and package model
- Content and admin tooling
- Policy gateway and logging

### Definition of done

- Operators can create, review, approve, and publish a partner offer.
- Burro can help assemble partner-inclusive packages without bypassing approval rules.
- Partner categories and revenue rules are explicit enough to avoid policy drift.
- Marketplace entries remain traceable to partner status and moderation state.

### What this sprint unlocks next

- Bilingual Support and Internationalisation
- Partner Network Expansion and Event Operations
