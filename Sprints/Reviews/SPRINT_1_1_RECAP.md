# Sprint 1.1 Recap — Public Website and Blog Launch

**Completed:** 2026-03-15T21:47:34.6074520-05:00
**Duration:** 5h 2m

## Deliverables

### Workstream 1.1.1 — Public trust layer
- [x] Home page replaced staging shell copy with stewardship-first public narrative
- [x] About/story page implemented for Chuck and Susan plus project framing
- [x] Contact page added as a net-new public route
- [x] Navigation updated for the public route set

### Workstream 1.1.2 — Blog and publishing flow
- [x] MDX blog rendering implemented via `next-mdx-remote`
- [x] Blog index and dynamic blog post route implemented
- [x] CMS-backed blog loader implemented against `website/cms/blog/`
- [x] Four initial public blog posts added
- [x] Legacy Sprint 0.2 shell content safely ignored unless it matches the public schema

### Workstream 1.1.3 — Activism and capture seams
- [x] Activism landing page implemented
- [x] Activism status feed component implemented
- [x] Activism seed data added in `website/cms/activism/updates.json`
- [x] Newsletter signup component and local subscribe API implemented
- [x] Minimal local analytics event logging implemented

## Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| `pnpm lint` | PASS | No ESLint warnings or errors |
| `pnpm typecheck` | PASS | TS strict mode passed |
| `pnpm test` | N/A | No frontend test suite exists |
| `pnpm build` | PASS | Public pages, blog SSG, and API routes built successfully |
| Accessibility smoke test | NOT RUN | Manual audit not performed |
| Responsive verification | NOT RUN | Manual breakpoint verification not performed |
| `pnpm dev` smoke | NOT RUN | Dev-server smoke not rerun in this close-out |

## Evidence

- `evidence/sprint-1-1/validation_summary.md`

## Issues Encountered

- The stale proposal file on disk did not reflect Hyde's approval amendments, so implementation followed the approved handoff notes instead.
- The initial blog loader admitted the old Sprint 0.2 shell post, which failed the public-schema parse during build; fixed by filtering to schema-valid posts only.
- MDX rendering required adding `next-mdx-remote` and `remark-gfm` to the frontend package.

## Deferred Items

- Postmark-backed newsletter delivery remains deferred until credentials are activated
- Accessibility audit remains to be run manually
- Responsive breakpoint verification remains to be run manually
- External analytics provider integration remains out of scope

## Notes for Next Sprint

- Sprint 1.2 can build on a real public-site narrative and a stable content root in `website/cms/`.
- The local newsletter and analytics seams should remain explicitly scaffold-mode unless Hyde approves provider activation work.
- If future sprints reuse blog content, they should continue enforcing the public schema rather than assuming every CMS file is publishable.
