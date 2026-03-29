# Sprint 1.1 Jekyll Findings

**Reviewed:** 2026-03-15T21:17:32.2360537-05:00
**Sprint:** 1.1
**Proposal:** `Sprints/Proposals/04_sprint_1_1_public_website_and_blog_launch.md`
**Status:** REVIEWED

## Summary

- CRITICAL: 0
- HIGH: 2
- MEDIUM: 3
- LOW: 1
- INFO: 1

## Findings

### HIGH

#### JF-401: Route and navigation assumptions drift from the verified Sprint 0.2 shell

**Severity:** HIGH

**Evidence**
- The deliverables table requires a new contact page at `website/frontend/app/contact/page.tsx` and claims Sprint 0.2 already stubbed `/contact`.
- The current verified route shell contains `/`, `/about`, `/blog`, `/activism`, `/assistant`, and other route stubs, but no `/contact` route or route-spec entry.
- The current navigation is implemented in the flat `components/SiteShell.tsx` file, not in `components/nav/` as the proposal implies.

**Impact**
- Sprint 1.1 is still feasible, but the proposal currently treats new route and nav work as if it were only placeholder replacement.
- That weakens feasibility estimation and can hide IA and navigation changes that should be reviewed explicitly.

**Required change**
- Amend the proposal to state clearly that `/contact` is a net-new route for Sprint 1.1.
- Update deliverable wording so navigation work extends the existing `SiteShell` pattern or explicitly justifies a new `components/nav/` structure.

#### JF-402: MDX publishing flow is underspecified relative to the actual frontend toolchain

**Severity:** HIGH

**Evidence**
- The proposal commits to MDX blog post rendering via `app/blog/[slug]/page.tsx` and `content/blog/*.mdx`.
- The current frontend package includes `gray-matter`, but it does not include an MDX compiler/runtime dependency such as `@next/mdx`, `next-mdx-remote`, or equivalent.
- The proposal names MDX as the chosen content system, but the technical gate does not call out the additional package/config work needed to actually render MDX in the App Router.

**Impact**
- The sprint remains feasible, but the publishing layer is more than a content-loader task; it also requires a rendering strategy and new dependency/config decisions.
- Without making that explicit, Hyde may under-scope the implementation and verification work.

**Required change**
- Add the MDX rendering strategy as an explicit implementation decision and deliverable.
- Narrow the acceptance criteria to repo-verifiable MDX rendering, not just frontmatter parsing.

### MEDIUM

#### JF-403: Proposal introduces a second content root without reconciling it with the existing `website/cms/` content shell

**Severity:** MEDIUM

**Evidence**
- Sprint 0.2 already created MDX shell content under `website/cms/` for pages, blog, activism, and other sections.
- Sprint 1.1 proposes a new content root under `website/frontend/content/blog/*.mdx`.
- The proposal does not explain whether `website/cms/` is being superseded, mirrored, or ignored for P1.

**Impact**
- Jekyll can implement either pattern, but the repo risks splitting editorial content across two parallel roots before a CMS decision is made.
- That will complicate later migration to a formal content system and weaken operator publishing guidance.

**Recommended change**
- Choose one canonical content root for P1 and state it explicitly.
- If `website/frontend/content/` is preferred for build-time loading, explain how `website/cms/` remains relevant or mark it deferred.

#### JF-404: Activism feed implementation lacks a concrete source-of-truth path and sample data contract

**Severity:** MEDIUM

**Evidence**
- The proposal correctly uses `ActivismUpdate` as a MIRRORS type, but it only names a loader module and status-feed component.
- There is no concrete file location specified for the public activism data files that the loader will read.
- Current repo state only contains an old shell file at `website/cms/activism/update-shell.mdx`; there is no machine-readable activism feed dataset yet.

**Impact**
- The page can be built, but Hyde’s acceptance criterion “status feed from ActivismUpdate content” is underspecified enough that implementation could devolve into hardcoded sample data.
- That would undercut the MIRRORS contract the proposal claims to preserve.

**Recommended change**
- Add an explicit public activism content source path and file format.
- If the first version is repo-local sample data, mark it clearly as a seed aligned to the `ActivismUpdate` contract.

#### JF-405: Newsletter subscription flow promises operator capability without defining persistence, review, or replay behavior

**Severity:** MEDIUM

**Evidence**
- The proposal says the subscribe API will create subscriber records locally and queue Postmark delivery later.
- It does not specify where subscriber records live, how duplicates are handled, or what operator-publishable workflow exists for reviewing those captures.
- Sprint 0.3 established a scaffold-mode pattern for provider seams, but this proposal does not give the same level of detail for newsletter storage.

**Impact**
- Jekyll can still ship a basic local capture seam, but the operator workflow remains vague.
- That makes “newsletter capture” sound more complete than it will actually be at commit time.

**Recommended change**
- Define a concrete local persistence artifact and minimal record schema for subscribers.
- State whether the Sprint 1.1 API only captures addresses, or also stages outbound confirmation messages for later provider activation.

### LOW

#### JF-406: Analytics instrumentation scope is too broad for a sprint already carrying content, IA, and publishing work

**Severity:** LOW

**Evidence**
- The sprint already includes multiple public pages, blog rendering, activism feed, newsletter capture, contact surface, and navigation changes.
- Analytics deliverables mention page views, signup conversion, and route performance, but the risk section treats provider choice as low-detail local logging.

**Impact**
- This does not block the sprint, but analytics can easily sprawl into an additional mini-platform if not tightly constrained.

**Recommended change**
- Narrow Sprint 1.1 analytics to a simple local event logger or one minimal abstraction layer, not a full instrumentation framework.

### INFO

#### JF-407: Sprint 1.1 is feasible if Hyde frames it as a content-and-trust launch, not a quasi-production marketing stack

**Severity:** INFO

**Evidence**
- Sprint 0.2 established a working Next.js shell and Sprint 0.3 added API-capable routing plus internal patterns for scaffold-mode integrations.
- The blueprint’s P1 goals explicitly prioritize public website, newsletter, blog, and activism surfaces.
- The proposal keeps booking, checkout, and commerce out of scope.

**Impact**
- The repo is ready for a disciplined public trust layer in Sprint 1.1.
- Success depends on keeping content, rendering, and local capture seams explicit rather than smuggling in undeclared platform work.

**Recommended change**
- Preserve the stewardship-first framing and tighten the proposal around one clear content root, one MDX rendering strategy, and one local newsletter persistence seam.

## Overall Assessment

Sprint 1.1 is technically feasible, but Hyde should correct proposal drift before implementation begins. The main issues are that the proposal overstates which routing/navigation pieces already exist, commits to MDX rendering without naming the actual rendering strategy, and leaves the activism/newsletter content seams less concrete than the repo-completable pattern established in Sprint 0.3. If Hyde tightens those points, Jekyll can implement the public trust layer cleanly in the next phase.
