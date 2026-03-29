# Sprint 0.2 Jekyll Findings

**Reviewed:** 2026-03-15T19:33:00-05:00
**Sprint:** 0.2
**Proposal:** `Sprints/Proposals/02_sprint_0_2_design_system_and_website_shell.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 0
- HIGH: 2
- MEDIUM: 3
- LOW: 1
- INFO: 1

## Findings

### HIGH

#### JF-201: Palette extraction plan conflicts with the blueprint's existing canonical palette values

**Severity:** HIGH

**Evidence**
- The blueprint already defines six palette sets with concrete hex arrays under `design_system.palette_sets`.
- The proposal says Sprint 0.2 should extract hex values from the photos again and map them to blueprint palette definitions.
- `memory/DECISIONS.md` records DEC-006: the blueprint remains the canonical JSON source of truth.

**Impact**
- Re-extracting colors can create drift between the canonical blueprint palette values and the generated design tokens.
- Later sprints may not know whether `Docs/Big_Bend_Burro_Blueprint_Final.json` or `data/seeds/palettes.json` is authoritative.

**Required change**
- Amend the proposal so Sprint 0.2 treats blueprint palette hex values as canonical and uses extraction only as a verification or enrichment step, not as a competing source of truth.

#### JF-202: Content schema proposal does not define a contract mapping back to the blueprint data models

**Severity:** HIGH

**Evidence**
- The blueprint already defines canonical models including `lodging_unit`, `workshop_program`, and `activism_update`.
- The proposal introduces new frontend types: `Page`, `BlogPost`, `ActivismUpdate`, `Workshop`, `Experience`, and `LodgingUnit`.
- The proposal does not state how those frontend types map to the blueprint contracts or where field-level translation is allowed.

**Impact**
- Sprint 0.2 could create a second parallel schema layer before any CMS or public site exists.
- Sprint 1.x implementation would inherit migration work or silent model divergence.

**Required change**
- Add an explicit mapping table from each frontend type to the blueprint contract it mirrors, extends, or intentionally introduces.
- If a type is frontend-only, mark it as a view model rather than a canonical content contract.

### MEDIUM

#### JF-203: Route-stub acceptance references "links to Blueprint route spec" that do not exist as separate artifacts

**Severity:** MEDIUM

**Evidence**
- The proposal requires each route stub to include a link to the full spec.
- In the current repo, route definitions live inside the blueprint JSON rather than in per-route spec files.

**Impact**
- Jekyll can build route stubs, but the acceptance checklist asks for links to an artifact that has not been defined.

**Recommended change**
- Replace this with a link or note referencing the route entry in `Docs/Big_Bend_Burro_Blueprint_Final.json`, or remove the link requirement entirely.

#### JF-204: Frontend config output paths are underspecified

**Severity:** MEDIUM

**Evidence**
- Deliverable D1 lists `website/frontend/tokens/design-tokens.json` and `tailwind.config.ts`.
- Deliverable D8 says the development environment lives in `website/frontend/`.
- The proposal does not explicitly place `tailwind.config.ts`, `postcss`, `tsconfig`, or ESLint config files inside `website/frontend/`.

**Impact**
- Implementation can still proceed, but the repo may end up with framework config files split between root and the frontend app directory.
- That would complicate later workspace setup and quality gates.

**Recommended change**
- Normalize all frontend app configs to `website/frontend/` and state that path explicitly in the deliverables table.

#### JF-205: Quality-gate expectations assume package-manager bootstrapping that the proposal does not specify

**Severity:** MEDIUM

**Evidence**
- `website/frontend/` currently contains only `.gitkeep`.
- There is no existing `package.json`, lockfile, or Node toolchain config in the repo.
- The proposal requires `pnpm dev`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`, but does not specify Node version, package-manager version, or initialization approach.

**Impact**
- The sprint is still feasible, but repeatable verification is weaker than the checklist suggests.
- Tooling setup decisions may leak into implementation ad hoc rather than being reviewed in the proposal.

**Recommended change**
- Add explicit package-manager and Node assumptions, or narrow the quality gate to the app created inside `website/frontend/` with a local `package.json`.

### LOW

#### JF-206: Deliverable scope mixes canonical design assets with starter component implementation

**Severity:** LOW

**Evidence**
- The sprint aims to create design tokens, palettes, media manifest, route stubs, content types, and seven reusable components from an empty frontend directory.
- Only some of those artifacts are blueprint-backed canonical outputs; others are exploratory starter UI implementation.

**Impact**
- The sprint is still feasible, but review and recap may blur foundational contracts with optional initial UI patterns.

**Recommended change**
- Separate "canonical foundation outputs" from "starter implementation outputs" in the proposal language.

### INFO

#### JF-207: Sprint 0.2 is feasible if it stays shell-first and avoids treating the site shell as public-ready

**Severity:** INFO

**Evidence**
- Sprint 0.1 already created the required scaffold paths and evidence registry.
- The blueprint explicitly supports a private prototype website or staging shell in P0.
- The proposal keeps booking, checkout, and live content operations out of scope.

**Impact**
- This is an appropriate foundation sprint as long as Hyde keeps the implementation focused on contracts, stubs, and reusable structure.

**Recommended change**
- Preserve the current shell-first framing and resist adding real marketing copy or pseudo-launch polish in this sprint.

## Overall Assessment

Sprint 0.2 is technically feasible in the current repo, but Hyde should clean up the proposal so the generated website shell does not drift from canonical blueprint data. The main corrections are to treat palette values and core content models as blueprint-aligned contracts, tighten frontend config paths, and remove acceptance criteria that point to nonexistent route-spec artifacts.
