# Sprint 1.4 Jekyll Findings

**Reviewed:** 2026-03-16T13:08:00-05:00
**Sprint:** 1.4
**Proposal:** `Sprints/Proposals/07_sprint_1_4_shop_activism_and_assistant_enhancements.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 0
- HIGH: 2
- MEDIUM: 3
- LOW: 1
- INFO: 1

## Findings

### HIGH

#### JF-701: Shop catalog and checkout introduce a new commerce model without naming the concrete local source-of-truth pattern

**Severity:** HIGH

**Evidence**
- Sprint 1.4 introduces `ShopProduct`, `ShopOrder`, cart behavior, checkout, shipping validation, and order capture.
- The current repo has no `website/cms/shop/` content root, no existing cart/order store, and `/shop` is still a route stub.
- Hyde correctly defers live Stripe activation, but the proposal still says customers can complete eligible purchases without explicitly defining what the local scaffold-mode order lifecycle is.

**Impact**
- Sprint 1.4 is feasible, but only if Hyde treats checkout as a scaffold-mode order capture flow, not a production purchase system.
- Without that clarification, implementation and acceptance can drift into vague “purchase complete” language that the repo cannot honestly verify.

**Required change**
- Amend the proposal to define a local single-store order model equivalent to the booking/workshop scaffold pattern.
- State explicitly that Sprint 1.4 proves cart, checkout validation, and local order capture, not provider-backed payment completion.

#### JF-702: Activism update deliverables conflict with the repo’s current single-feed content pattern

**Severity:** HIGH

**Evidence**
- Workstream 1.4.3 says activism content will live at `website/cms/activism/updates/*.json` with a detail route at `/activism/updates/[slug]`.
- The current repo uses one machine-readable feed file at `website/cms/activism/updates.json` plus a loader already wired into `/activism`.
- No per-update JSON files or activism detail route exist today.

**Impact**
- The sprint is still feasible, but Hyde has not yet said whether Jekyll should migrate from the current single-feed file to per-update files or preserve the existing feed and derive detail pages from it.
- That ambiguity risks another parallel content pattern inside the same activism domain.

**Required change**
- Choose one canonical activism content source for Sprint 1.4 and state it explicitly.
- If per-update JSON files are preferred, Hyde should call out the migration away from the current `updates.json` feed and how the existing loader changes.

### MEDIUM

#### JF-703: Follow-up draft attachment is a good direction, but the proposal underdefines how draft generation attaches to the current assistant panels

**Severity:** MEDIUM

**Evidence**
- PRD-1.4.3 says Burro follow-up drafts attach inline to booking and workshop records rather than using a separate queue.
- The current assistant shell only has `BookingPanel` and `WorkshopPanel`, each rendering lightweight record summaries without draft cards, event timelines, or guest grouping.
- The proposal also adds `GuestEvent` timeline and tag foundations in the same sprint.

**Impact**
- This does not block the sprint, but Hyde is effectively asking Sprint 1.4 to add shop surfaces, activism enhancements, follow-up drafting, and a CRM/event foundation at once.
- Without tighter attachment rules, assistant work can sprawl into a mini-CRM before the shop and activism paths are stable.

**Recommended change**
- Constrain Sprint 1.4 draft visibility to simple attached draft cards on existing booking/workshop panels.
- Treat unified guest timelines and richer cross-record identity views as groundwork, not a fully developed CRM UI.

#### JF-704: Shipping-profile enforcement is feasible, but mixed-cart behavior is not yet specified

**Severity:** MEDIUM

**Evidence**
- PRD-1.4.4 constrains shipping profiles to `pickup-only`, `parcel`, and `print-on-demand`.
- Acceptance requires checkout to enforce shipping rules, especially that pickup-only items cannot ship.
- The proposal does not say whether mixed carts are allowed across multiple shipping profiles or whether the cart must be single-profile in Sprint 1.4.

**Impact**
- Jekyll can implement this sprint either way, but mixed-cart logic becomes materially more complex once address capture, order summaries, and validation rules interact.
- That complexity is unnecessary if Hyde only needs proof that the shipping lane rules can be enforced locally.

**Recommended change**
- Pick one explicit MVP rule: either one shipping profile per order, or hard-block mixed-profile carts.
- Keep Sprint 1.4 cart logic deliberately narrow and repo-verifiable.

#### JF-705: CRM event history promises tagging and timeline display before the repo has a stable guest identity model

**Severity:** MEDIUM

**Evidence**
- Workstream 1.4.5 introduces `GuestEvent`, local event store, timeline view, and tag system.
- Current booking and workshop records are separate local stores keyed mostly by record IDs and guest email, with no consolidated guest entity.
- The proposal does not define whether guest identity is resolved solely by normalized email or whether multiple contact channels can map to one timeline.

**Impact**
- This does not block the sprint, but the CRM/event foundation should be intentionally thin.
- Otherwise Hyde risks implying a stronger guest-history layer than the repo can maintain cleanly in one sprint.

**Recommended change**
- Define normalized email as the Sprint 1.4 guest identity key.
- Limit the event history layer to append-only events plus lightweight tags, not a full merged customer profile.

### LOW

#### JF-706: Shop SKU constraints are good, but the proposal should explicitly say how unavailable items render in public catalog views

**Severity:** LOW

**Evidence**
- PRD-1.4.1 and `ShopProduct.status` correctly constrain P1 products to prints, giftables, and print-on-demand.
- The `ShopProduct` contract already includes `available`, `sold-out`, `coming-soon`, and `private` states.
- The proposal does not specify whether `sold-out` and `coming-soon` items remain visible in the public catalog or are hidden by default.

**Impact**
- This is not blocking, but public catalog behavior should be explicit to avoid inconsistent merchandising and operator expectations.

**Recommended change**
- State whether Sprint 1.4 shows sold-out items as social proof, hides private items entirely, and disables purchase paths for non-available items.

### INFO

#### JF-707: Sprint 1.4 is feasible if Hyde frames it as curated commerce plus operator-assist scaffolding, not a full commerce-plus-CRM platform

**Severity:** INFO

**Evidence**
- Sprint 1.1 already provides public content patterns, Sprint 1.2 already provides scaffold-mode booking capture, and Sprint 1.3 already provides registration capture plus assistant panels.
- Hyde’s PRD decisions appropriately constrain SKUs, donation handling, freight, and conversational FAQ scope.
- The blueprint supports a small curated shop and activism hub in P1.

**Impact**
- The repo is ready for a disciplined shop and activism sprint if the proposal stays narrow about local order capture, activism content migration, and thin CRM/event scaffolding.

**Recommended change**
- Preserve the current P1 boundary: curated SKU lane, external donation links, scaffold-mode follow-up drafts, and only the minimum event-history groundwork needed for later sprints.

## Overall Assessment

Sprint 1.4 is technically feasible, but Hyde should tighten the proposal before implementation begins. The two main issues are that the shop lane still needs an explicit local order source-of-truth model, and the activism work needs a clear decision on whether the repo is staying with a single-feed JSON source or migrating to per-update files. If Hyde resolves those points and keeps CRM/event work intentionally thin, Jekyll can implement the sprint cleanly in the next phase.
