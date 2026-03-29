# Sprint 1.4 Lessons Learned — Shop, Activism, and Assistant Enhancements

**Sprint:** 1.4
**Phase:** P1 MVP Launch
**Closed:** 2026-03-16
**Author:** HYDE (Big Bend Burro)

---

## Summary

Sprint 1.4 successfully delivered the first curated commerce layer, activism enhancement, and assistant follow-up capabilities while respecting P1 scaffold-mode boundaries. All five workstreams completed with quality gates passing.

---

## What Worked Well

### 1. Single-Feed Content Pattern Preserved
The decision to keep activism content in `updates.json` rather than migrating to per-file patterns (JF-702) proved correct. Deriving detail routes from a single feed avoids content fragmentation and maintains the pattern established in earlier sprints. This should be the default approach for new content domains in P2.

### 2. Scaffold-Mode Order Capture Model
Treating the shop checkout as scaffold-mode local capture (A-1.4.1) rather than "live purchase" kept expectations aligned with reality. The same pattern from booking (Sprint 1.2) and workshop registration (Sprint 1.3) transferred cleanly to commerce. This validates scaffold-mode as the standard P1 proof approach.

### 3. Single Shipping Profile Constraint
Blocking mixed-profile carts (A-1.4.4) dramatically reduced cart validation complexity. Rather than solving multi-profile shipping in one sprint, the constraint kept checkout logic narrow and repo-verifiable. Future sprints can relax this if operationally justified.

### 4. Draft Attachment Rather Than Separate Queue
Attaching follow-up drafts directly to BookingPanel and WorkshopPanel (PRD-1.4.3, A-1.4.3) avoided building a separate operator dashboard. This keeps the assistant surface cohesive and reduces context-switching for Chuck and Susan.

### 5. Explicit Status Visibility Rules
Defining exactly how `available`, `sold-out`, `coming-soon`, and `private` products render in the catalog (A-1.4.6) prevents ambiguity in merchandising. Similar explicit visibility rules should apply to any future inventory-bearing entity.

---

## What Caused Friction

### 1. Pre-Existing Incomplete Shop Scaffolding
The recap notes that existing unfinished shop components in `components/shop/` used an older cart/type shape. Jekyll had to normalize these to Sprint 1.4 contracts. This validates the carryover risk identified in `current_state.md`: "Parallel unfinished repo scaffolds may reappear."

**Lesson:** When a sprint claims a surface that has partial prior scaffolding, the proposal should explicitly call out the normalization scope. Hyde should search for existing route stubs and type definitions before finalizing workstream boundaries.

### 2. Sandbox Execution Intermittent Failures
Jekyll encountered `windows sandbox: setup refresh failed` errors requiring approved escalation for verification commands. This is an environment reliability issue, not a sprint design issue, but it caused implementation friction.

**Lesson:** For Minerva-coordinated workflows, environment stability matters. The orchestrator should consider health checks before agent invocation.

### 3. CRM/Event History Scope Ambiguity
Initial proposal language implied richer CRM capabilities than the sprint actually delivered. JF-705 correctly flagged this, and the amendment (A-1.4.5) constrained event history to append-only with normalized email identity. The unified guest CRM view was deferred to Sprint 3.2.

**Lesson:** When introducing foundational data models (like `GuestEvent`), Hyde should clearly distinguish "groundwork stored but not fully rendered" from "fully functional feature."

---

## Patterns to Carry Forward

### P1 Scaffold-Mode Proof Pattern
The pattern is now established across three domains:
- **Booking (1.2):** Waiver → redirect intent → provider webhook → local capture
- **Workshop (1.3):** Registration → capacity decrement → local confirmation
- **Shop (1.4):** Cart → checkout validation → local order capture

Future P1 sprints introducing new transaction types should follow this same scaffold-mode proof pattern.

### Single-Source Content Derivation
Activism content (1.4) and workshop content (1.3) both use single JSON files with loaders deriving routes. This avoids per-file sprawl and keeps content manageable for operators. P2 should maintain this unless content volume genuinely requires file-per-item.

### Explicit Status-Based Visibility
Products, lodging units, and workshop sessions all now have explicit status fields controlling public visibility. This pattern should extend to any new inventory-bearing entity in P2.

### Panel-Attached Operator Tools
BookingPanel, WorkshopPanel, and now follow-up drafts all attach to the assistant shell rather than spawning separate dashboards. This consolidation pattern keeps operator cognitive load manageable during gradual onboarding.

---

## What to Avoid

### 1. Vague "Complete Purchase" Language
Sprint 1.4 initially said customers could "complete eligible purchases." This language was ambiguous until JF-701 forced clarification. Future proposals should explicitly state whether a flow is scaffold-mode proof or live transaction from the start.

### 2. Assuming Content Migration Without Explicit Decision
Workstream 1.4.3 originally implied migrating activism from single-feed to per-file without an explicit decision. JF-702 caught this. Hyde should always state whether new content work extends existing patterns or creates new ones.

### 3. Underspecified Mixed-State Behavior
The shop proposal didn't specify mixed-cart handling until JF-704. When introducing multi-item or multi-profile concepts, Hyde should proactively decide on constraint rules rather than letting implementation drift.

---

## Carryover Items

The following items were explicitly deferred:

| Item | Deferred To | Rationale |
|------|-------------|-----------|
| Unified guest profile and richer CRM UI | Sprint 3.2 | Event groundwork needed first |
| Live payment collection (Stripe) | P2 activation | Scaffold-mode proof sufficient for P1 |
| Fragile/freight artisan shipping | Post-Sprint 1.4 | Operational complexity too high for curated launch |
| FAQ Burro conversational support | Post-P1 | Content generation proven; conversation deferred (DEC-010) |

---

## Decisions Established

| ID | Decision | Sprint |
|----|----------|--------|
| D-1.4.1 | Local order store follows scaffold-mode proof pattern | 1.4 |
| D-1.4.2 | Activism content stays single-feed (`updates.json`) | 1.4 |
| D-1.4.3 | Single shipping profile per order in P1 | 1.4 |
| D-1.4.4 | Guest identity by normalized email only in P1 | 1.4 |
| D-1.4.5 | Product status visibility rules explicit in catalog | 1.4 |
| D-1.4.6 | Draft cards attach to panels, not separate queue | 1.4 |

---

## Phase 1 Completion Status

With Sprint 1.4 closed, **Phase 1 (MVP Launch) is complete**. The following capabilities are now scaffold-mode proven:

- Public website with blog content (Sprint 1.1)
- Lodging catalog with booking handoff (Sprint 1.2)
- Workshop registration with capacity enforcement (Sprint 1.3)
- Curated shop with checkout validation (Sprint 1.4)
- Activism feed with detail routes (Sprint 1.4)
- Assistant panels for operator visibility (Sprints 1.2-1.4)
- Guest event history foundation (Sprint 1.4)

**Phase 2 (Expansion)** begins with Sprint 2.1: Itinerary Builder and Retreat Hosting.

---

## Acknowledgments

Jekyll's systematic findings (JF-701 through JF-707) correctly identified the ambiguities that could have caused implementation drift. The approval phase disposition (all findings accepted/acknowledged) ensured clean handoff for implementation.

---

*Synthesized by HYDE — Big Bend Burro*
*Sprint closure: 2026-03-16*
