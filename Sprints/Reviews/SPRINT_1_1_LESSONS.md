# Sprint 1.1 Lessons Learned

**Sprint:** 1.1 — Public Website and Blog Launch
**Synthesized:** 2026-03-16
**Author:** HYDE
**Milestone:** P1 MVP LAUNCH — First Public Sprint Complete

---

## Summary

Sprint 1.1 successfully delivered the public trust layer, blog publishing system, activism hub, and local capture seams. This was the first customer-facing sprint, marking the transition from internal foundation (P0) to public presence (P1).

**Duration:** ~5h 2m from APPROVED to COMPLETE
**Findings reviewed:** 7 (0 CRITICAL, 2 HIGH, 3 MEDIUM, 1 LOW, 1 INFO)
**All findings:** ACCEPTED with amendments
**Phase Status:** P1 MVP LAUNCH — Sprint 1 of 4 complete

---

## What Worked Well

### 1. Jekyll/Hyde Amendment Protocol
The 7 amendments from HYDE's PHASE 3 review were successfully implemented by JEKYLL. The amendment-based approval process caught proposal drift (JF-401 route assumptions, JF-403 content root ambiguity) before implementation began.

### 2. Single Canonical Content Root
The JF-403 amendment (choosing `website/cms/` as the single content root) prevented content fragmentation. JEKYLL implemented loaders against the canonical path, and legacy Sprint 0.2 shell content was safely filtered.

### 3. MDX Rendering Strategy
The JF-402 amendment (explicit `next-mdx-remote` choice) provided clear implementation guidance. JEKYLL added the dependency and wired it correctly without ambiguity.

### 4. Activism Feed Data Contract
The JF-404 amendment (explicit `website/cms/activism/updates.json` path) created a concrete data source. The status feed component reads from governed data rather than hardcoded samples.

### 5. Local Newsletter Persistence
The JF-405 amendment (NewsletterSubscriber schema with local persistence) implemented scaffold-mode capture. Addresses are saved locally with `pending_postmark` status until provider activation.

### 6. Minimal Analytics Scope
The JF-406 amendment (simple local event logger) kept analytics from sprawling. Sprint 1.1 shipped a minimal tracking API without external provider complexity.

---

## What Caused Friction

### 1. Stale Proposal File
The proposal on disk did not reflect HYDE's approval amendments. JEKYLL correctly followed the handoff notes instead.

**Lesson:** Amendments should be appended to the proposal markdown before JEKYLL implementation begins, or the handoff notes must serve as the authoritative source.

### 2. Legacy Content Filtering
The initial blog loader admitted old Sprint 0.2 shell posts, causing build failures. JEKYLL fixed this by filtering to schema-valid posts only.

**Lesson:** Content loaders should validate against a public schema, not assume all CMS files are publishable. This is now a pattern.

### 3. New Dependencies Required
MDX rendering required adding `next-mdx-remote` and `remark-gfm` to the frontend package. This was expected from the JF-402 amendment but wasn't pre-installed.

**Lesson:** When amendments specify new dependencies, include them in the amendment wording so they're visible to JEKYLL.

### 4. Manual Gates Not Run
Accessibility audit and responsive breakpoint verification were not run. These remain deferred.

**Lesson:** Manual QA gates should either be explicitly deferred in the proposal or given a verification window.

---

## Patterns to Carry Forward

| Pattern | Description | Apply In |
|---------|-------------|----------|
| Amendment-based approval | HYDE approves with explicit amendments | All sprints |
| Single content root | Use `website/cms/` for all public content | All content sprints |
| Schema-validated loaders | Filter CMS files by public schema | All content loading |
| Scaffold-mode persistence | Local capture with provider flag | All external integrations |
| Minimal analytics | Simple local logger before provider choice | All analytics work |
| Net-new route declaration | Mark routes as net-new vs placeholder-replacement | All IA changes |

---

## Patterns to Avoid

| Anti-Pattern | Problem | Alternative |
|--------------|---------|-------------|
| Assuming routes exist | Proposal claimed `/contact` was stubbed | Verify route shell before proposal |
| Dual content roots | Risk of content fragmentation | Choose canonical root in P1 |
| Unspecified MDX strategy | Implementation ambiguity | Name the renderer in proposal |
| Hardcoded sample data | Violates MIRRORS contract | Use governed data files |
| Broad analytics scope | Sprawl risk in content sprints | Constrain to local logger |

---

## Carryover Items

| Item | Status | Target Sprint |
|------|--------|---------------|
| Postmark newsletter delivery | DEFERRED | When credentials provisioned |
| Accessibility audit | DEFERRED | Manual audit needed |
| Responsive breakpoint verification | DEFERRED | Manual verification needed |
| External analytics provider | OUT OF SCOPE | Future sprint if needed |
| Blog comment system | NOT PLANNED | Not in P1 scope |

---

## Decisions Recorded

| Decision | Rationale | Impact |
|----------|-----------|--------|
| D-1.1.1: `next-mdx-remote` for MDX | Works with App Router; server-side rendering | All future MDX content uses this |
| D-1.1.2: `website/cms/` canonical | Single source of truth; no parallel roots | All content work uses this path |
| D-1.1.3: `/contact` net-new | Not in Sprint 0.2 shell; explicitly added | IA expanded for public launch |
| D-1.1.4: Local newsletter capture | Scaffold-mode until Postmark activated | Addresses stored locally |
| D-1.1.5: Minimal local analytics | Page views and newsletter events only | No external provider yet |
| D-1.1.6: Activism JSON feed | `updates.json` for structured activism data | Status feed reads governed data |

---

## Sprint 1.1 Artifacts Index

| Artifact | Location | Purpose |
|----------|----------|---------|
| Proposal | `Sprints/Proposals/04_sprint_1_1_public_website_and_blog_launch.md` | Sprint definition |
| Jekyll findings | `Sprints/Reviews/SPRINT_1_1_JEKYLL_FINDINGS.md` | Review feedback |
| Jekyll recap | `Sprints/Reviews/SPRINT_1_1_RECAP.md` | Implementation summary |
| Validation summary | `Sprints/Reviews/evidence/sprint-1-1/validation_summary.md` | Build evidence |
| Lessons (this file) | `Sprints/Reviews/SPRINT_1_1_LESSONS.md` | Synthesis |
| Public pages | `website/frontend/app/` (`/`, `/about`, `/activism`, `/blog`, `/contact`) | Public routes |
| Blog loader | `website/frontend/lib/content/blog.ts` | CMS-backed loader |
| Activism loader | `website/frontend/lib/content/activism.ts` | Feed loader |
| Newsletter API | `website/frontend/app/api/newsletter/subscribe/route.ts` | Local capture |
| Analytics API | `website/frontend/app/api/analytics/track/route.ts` | Local logger |
| Blog content | `website/cms/blog/*.mdx` | Public posts |
| Activism data | `website/cms/activism/updates.json` | Status feed |

---

## Quality Gate Status After Sprint 1.1

| Gate | Status | Notes |
|------|--------|-------|
| `pnpm lint` | PASS | Clean lint |
| `pnpm typecheck` | PASS | TS strict passed |
| `pnpm build` | PASS | All routes built |
| Accessibility | NOT RUN | Deferred |
| Responsive | NOT RUN | Deferred |

---

## Transition to Sprint 1.2

Sprint 1.1 established the public trust layer. The next sprint builds on this foundation:

| Sprint | Focus | Foundation Used |
|--------|-------|-----------------|
| 1.2 Lodging Booking | Booking flow | Public site, Lodgify scaffold, `/stay` route |

**Key dependencies for 1.2:**
- Public site narrative is now live
- Content root established at `website/cms/`
- Local capture pattern proven for newsletter
- Next.js App Router patterns validated

**Operator Readiness:**
- P1 Sprint 1.1: R1_ASSISTED (operators can publish blog posts and view activism updates)

---

## P1 MVP Launch Progress

| Sprint | Status | Key Outputs |
|--------|--------|-------------|
| 1.1 Public Website | CLOSED | Trust layer, blog, activism hub, capture seams |
| 1.2 Lodging Booking | PENDING | Booking flow |
| 1.3 Workshops | PENDING | Workshop catalog |
| 1.4 Shop/Activism | PENDING | Store, activism enhancements |

**Sprint 1.1: CLOSED**
