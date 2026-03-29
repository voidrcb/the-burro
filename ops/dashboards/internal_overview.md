# Big Bend Burro Internal Overview

## How To Read This Dashboard

This dashboard is an internal Sprint 0.1 view for Chuck and Susan.

- `Blocked` means work cannot move until an outside dependency changes.
- `Active` means a next action exists and can be advanced now.
- `Backlog` means the item matters but should wait until higher-priority blockers clear.
- `Provisional` means the data is useful for planning but not yet verified enough for commitments.

## Current Focus

Sprint 0.1 turns conversation and research into structured working files. The immediate goal is not public launch. The goal is to make land, probate, and pilot-planning issues visible in one place.

## Active Deliverables

- Evidence registry: `memory/l0/EVIDENCE_REGISTRY.json`
- Conversation capsule: `memory/l2/capsules/CAPSULE_2026_03_08.md`
- DARQ register: `memory/l2/capsules/DARQ_2026_03_08.json`
- Issue register: `data/trackers/property_tracker.json`
- Task model: `data/trackers/property_tasks.json`
- Pilot model shell: `data/models/pilot_unit_model.json`

## Blocked Issues

| Issue | Status | Next action | Anchor |
|------|--------|-------------|--------|
| Seller estate still in probate | Blocked | Follow up with realtor on probate timeline | `S003:L1004-L1006` |
| Lien release still required from heirs | Blocked | Confirm who must sign the release paperwork | `S003:L0996-L1000` |

## Active Issues

| Issue | Status | Next action | Anchor |
|------|--------|-------------|--------|
| Wrong parcel carried Susan's name and taxes | Open | Confirm remaining tax/refund/record-cleanup exposure | `S003:L0916-L0934` |
| Adjacent-lot acquisition opportunity | Open | Capture parcel number, seller, and price | `S003:L0892-L0894` |

## Task Board

| Task | Group | Priority | Status | Owner |
|------|-------|----------|--------|-------|
| Document probate and lien blockers in one tracker | land | P0 | done | JEKYLL |
| Confirm heir contacts and lien-release requirements | land | P0 | blocked | Chuck and Susan |
| Capture wrong-tax parcel history and supporting documents | land | P0 | active | Susan |
| Research adjoining parcel seller and price | land | P1 | backlog | Chuck and Susan |
| Define water-project equipment assumptions for pilot budgeting | utilities | P1 | active | Chuck |
| Track activism actions that affect tourism and land strategy | activism | P1 | active | Susan |

## Pilot Unit Model Snapshot

| Unit type | ADR | Occupancy | Annual revenue | Notes |
|----------|-----|-----------|----------------|-------|
| Basic canvas tent, shared facilities | 145 | 32% | 16936 | Lowest-cost entry point |
| Safari tent, private bath | 265 | 35% | 33854 | Highest comfort, highest capital |
| Small dome, private | 225 | 34% | 27922 | Middle-ground premium path |

All pilot model inputs are provisional until water, waste, and power pricing is captured.

## Operator Notes

- This dashboard is not legal advice.
- The land/probate section is meant to organize conversations with the realtor, county offices, and heirs.
- Activism is tracked here because it affects tourism viability, not because Sprint 0.1 is building a public activism system.

## Next Actions

1. Ask the realtor for an updated probate and lien-release timeline.
2. Record any paperwork tied to the wrong-tax parcel history.
3. Capture adjacent-lot details before the parcel is resold.
4. Keep utility pricing separate from the pilot shell until quotes are real.
