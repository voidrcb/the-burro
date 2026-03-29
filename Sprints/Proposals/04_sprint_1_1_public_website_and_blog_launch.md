---
title: "Sprint 1.1 Proposal — Public Website and Blog Launch"
project: "Big Bend Burro"
sprint_id: "1.1"
phase_id: "P1"
phase_name: "MVP Launch"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 1.1 Proposal — Public Website and Blog Launch

## Proposal intent

Turn the staging shell into a credible public-facing site that explains the project, establishes trust, and starts the publishing rhythm that the white paper treats as essential.

## Proposal basis

- Blueprint P1 build scope includes the public website and activation includes newsletter and blog.
- White paper Part III says the website is the public operating surface and must keep publishing construction notes, photo essays, and updates.
- The activism hub is an immediate page priority in the white paper and feature flag set.
- Program principle: activate customer-facing features gradually and preserve the conservation identity.

## What

### In scope

- Build the home page, story/about surface, blog index and post flow, core contact surface, and initial activism landing pages.
- Implement newsletter capture and operator-publishable blog/update workflows.
- Publish the first clear story of what Big Bend Burro is, what it is not, and why the project is being built deliberately.
- Prepare the site to support later stay, workshop, and shop flows without needing major nav or IA changes.

### Deliverables

- Public home page with narrative and routing.
- About/story page for Chuck and Susan plus stewardship framing.
- Blog/update system with categories for field notes, construction, workshops, and preservation.
- Newsletter signup capture with welcome flow stub or first live sequence.
- Initial activism page and status feed structure.

### Out of scope

- No live stay booking funnel yet.
- No e-commerce checkout yet.
- No attempt to publish every future page at once.

## How

### Implementation approach

1. Use the route and component shell from Sprint 0.2, but now replace placeholders with decision-grade copy and visual hierarchy.
2. Implement publishing through the chosen content system so operators can add posts without waiting on code changes for every update.
3. Treat the activism section as a content model, not a static page. The update feed, call-to-action text, and background explainers should be separate content types so the message can evolve quickly.
4. Wire newsletter capture to the email/newsletter provider even if the full automation program is still minimal.
5. Optimize for phone-first reading and low-friction storytelling. The first public site should feel trustworthy, not crowded.
6. Ship analytics instrumentation for page views, signup conversion, and basic route performance so future sprints have a baseline.

### Data and system contracts touched

- `blog post schema`
- `newsletter subscriber event`
- `activism update content model`
- `page and hero media metadata`

## Why

- This sprint starts demand cultivation before the revenue systems are fully online, which matches the long-lead nature of Big Bend travel.
- It also creates the narrative layer that the white paper calls critical: construction updates, seasonal notes, photo essays, and preservation context.
- Without this sprint, later booking and workshop features would sit on top of a site with weak trust and weak story.
- It is also the cleanest way to introduce the project publicly while the operations remain intentionally small.

## Review

### Questions to resolve before commit

- Do you want the first public release to include the activism hub immediately, or ship it as a soft-launched secondary route after the base story pages are stable?
- Should the initial content cadence target weekly posts, biweekly posts, or ‘publish only when there is something meaningful’?
- Do you want the home page to emphasize stays first, workshops first, or stewardship first?

### Dependencies

- Sprint 0.2 route shell and content model
- Approved public copy and photo selection
- Newsletter provider choice

### Definition of done

- A visitor can understand the project, navigate core pages, and sign up for updates without friction.
- Operators can publish a post or update without developer intervention once the flow is learned.
- The public site passes basic accessibility, responsive-layout, and performance smoke tests.
- The activism section can be updated without rewriting page code.

### What this sprint unlocks next

- Lodging Booking Flow
- Workshops and Equipment Operations Prep
