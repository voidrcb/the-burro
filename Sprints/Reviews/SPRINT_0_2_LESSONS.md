# Sprint 0.2 Lessons Learned

**Sprint:** 0.2 — Design System and Website Shell
**Synthesized:** 2026-03-15
**Author:** HYDE

---

## Summary

Sprint 0.2 successfully established the visual foundation and frontend application shell for the Big Bend Burro website. The Jekyll/Hyde workflow continued to operate smoothly with all 7 findings accepted and amendments applied.

**Duration:** ~1h 41m from APPROVED to COMPLETE
**Findings reviewed:** 7 (0 CRITICAL, 2 HIGH, 3 MEDIUM, 1 LOW, 1 INFO)
**All findings:** ACCEPTED with amendments

---

## What Worked Well

### 1. Blueprint-Canonical Pattern for Palettes
The JF-201 amendment (treating blueprint palettes as canonical rather than re-extracting) prevented drift and simplified implementation. Jekyll used blueprint hex values directly, with extraction only for verification.

### 2. MIRRORS vs VIEW MODEL Type Classification
The JF-202 amendment explicitly classifying content types as MIRRORS (must match blueprint) or VIEW MODEL (frontend-only) provided clear guidance. This prevents schema drift in future sprints.

### 3. Deliverable Categorization
Splitting deliverables into "Canonical Foundation Outputs" vs "Starter Implementation Outputs" (JF-206) made the recap cleaner and clarified which artifacts are reusable contracts vs exploratory UI.

### 4. Config Normalization
Placing all framework configs in `website/frontend/` (JF-204) rather than at repo root keeps the frontend self-contained and avoids polluting the Burro workspace.

### 5. Quality Gate Success
Despite Windows sandbox challenges, `pnpm lint`, `typecheck`, and `build` all passed. The sprint delivered a working static export of all route stubs.

---

## What Caused Friction

### 1. Node/pnpm Version Mismatch
Proposal specified Node 20.x, pnpm 9.x but Jekyll ran on Node 24.11.0 / pnpm 10.32.1. The app worked, but strict version control would have caught this.

**Lesson:** Add `.nvmrc` or `engines` field to `package.json` for version enforcement. Or accept latest LTS and document actual versions used.

### 2. Windows Sandbox Execution Barriers
Multiple shell commands required escalated execution paths. The normal Bash tool path was blocked.

**Lesson:** Carried forward from Sprint 0.1 — Windows sandbox requires PowerShell fallbacks. Document platform-specific workarounds.

### 3. Dev Server Readiness Timeout
`pnpm dev` smoke tests timed out before capturing readiness output. Build passed, so functionality is confirmed, but dev experience wasn't fully validated.

**Lesson:** For dev server validation, use longer timeouts or check for specific startup indicators rather than relying on quick smoke tests.

### 4. JSX String Escaping
Initial build failed on `->` in JSX component text. Required escaping as `{'->'}`

**Lesson:** JSX has special character handling. Linters should catch this, but implementation should be aware.

---

## Patterns to Carry Forward

| Pattern | Description | Apply In |
|---------|-------------|----------|
| Blueprint-canonical values | Use blueprint JSON as source of truth; extraction/generation for verification only | All derived artifacts |
| MIRRORS vs VIEW MODEL | Classify types by their relationship to blueprint contracts | All content/data types |
| Deliverable categorization | Split canonical foundation vs starter implementation | All sprints with mixed outputs |
| Config containment | Keep framework configs in their app directory | All frontend/backend modules |
| Route stub with blueprint reference | Point to blueprint JSON, not separate spec files | All route-based work |

---

## Patterns to Avoid

| Anti-Pattern | Problem | Alternative |
|--------------|---------|-------------|
| Re-extracting canonical values | Creates drift from blueprint | Use blueprint values; verify only |
| Unspecified toolchain versions | Mismatch between proposal and implementation | Pin versions or document actual |
| Root-level framework configs | Pollutes workspace; unclear ownership | Contain in module directory |
| Short dev server timeouts | Inconclusive results | Longer timeouts or specific checks |

---

## Carryover Items

| Item | Status | Target Sprint |
|------|--------|---------------|
| Dev server full validation | INCONCLUSIVE | Sprint 0.3 or later |
| Actual Node/pnpm version alignment | DOCUMENTED | Consider .nvmrc in Sprint 0.3 |
| Live content editing | DEFERRED | Sprint 1.1+ |
| Operator content access | DEFERRED | R1_ASSISTED in Sprint 1.1+ |

---

## Recommendations for Sprint 0.3

1. **Reuse Sprint 0.2 outputs** — Route shell, content contracts, media manifest, and design tokens are ready
2. **Add .nvmrc** — Pin Node version to prevent future mismatch
3. **Test dev server with longer timeout** — Validate full development experience
4. **Reference content types** — Use MIRRORS types for assistant and ops modules
5. **Build on route stubs** — Assistant UI can use `/assistant` route foundation

---

## Quality Gate Status After Sprint 0.2

| Gate | Status | Notes |
|------|--------|-------|
| G0 | PASS | Source files ingested (Sprint 0.1) |
| G1 | PASS | L2 capsule created (Sprint 0.1) |
| G3.5 | PARTIAL | High-risk claims not yet verified in L3 packs |
| LAND | PASS | Property blockers logged (Sprint 0.1) |
| UTIL | NOT STARTED | Requires actual utility pricing |
| B005 | PASS | Design tokens and media manifest created |
| B006 | PASS | Staging shell with route stubs and content model |

---

## Sprint 0.2 Artifacts Index

| Artifact | Location | Purpose |
|----------|----------|---------|
| Proposal (approved) | `Sprints/Proposals/02_sprint_0_2_design_system_and_website_shell.md` | Sprint definition |
| Jekyll findings | `Sprints/Reviews/SPRINT_0_2_JEKYLL_FINDINGS.md` | Review feedback |
| Jekyll recap | `Sprints/Reviews/SPRINT_0_2_RECAP.md` | Implementation summary |
| Lessons (this file) | `Sprints/Reviews/SPRINT_0_2_LESSONS.md` | Synthesis |
| Design tokens | `website/frontend/tokens/design-tokens.json` | Color, type, spacing |
| Palette verification | `data/seeds/palette-verification.json` | Blueprint vs extraction |
| Media manifest | `data/seeds/media-manifest.json` | Image catalog |
| Content types | `website/frontend/lib/content/types.ts` | TypeScript definitions |
| Route stubs | `website/frontend/app/` | 12 blueprint routes |
| Components | `website/frontend/components/` | Starter UI library |
| CMS content | `website/cms/` | MDX content directories |

---

## P0 Foundation Phase Progress

| Sprint | Status | Key Outputs |
|--------|--------|-------------|
| 0.1 | CLOSED | Workspace, evidence registry, trackers, DARQ |
| 0.2 | CLOSED | Design tokens, frontend shell, content types, routes |
| 0.3 | PENDING | Sandbox integrations, internal assistant |

P0 Foundation phase is 2/3 complete. Sprint 0.3 will complete the foundation with integration sandboxes and internal Burro assistant modules.
