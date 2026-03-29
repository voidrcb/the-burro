---
title: "Sprint 0.2 Proposal — Design System and Website Shell"
project: "Big Bend Burro"
sprint_id: "0.2"
phase_id: "P0"
phase_name: "Foundation"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 0.2 Proposal — Design System and Website Shell

## Proposal intent

Create the visual and structural foundation for the future public site so that later sprints can ship pages, content, and commerce flows without redesigning the whole platform every time.

## Proposal basis

- Blueprint phase P0 includes a starter site design system and a private prototype website or staging site.
- Delivery plan seeds B005-B006 call for design tokens, media manifests, and a staging site shell with route stubs and a CMS model.
- White paper Part III emphasizes Susan’s photography, desert-derived palettes, clean typography, and a website that is useful before it is flashy.
- Design system in the blueprint already defines six palette sets and route intentions for stay, workshops, dark-sky, activism, blog, plan, and assistant.

## What

### In scope

- Create the initial design tokens for color, type, spacing, buttons, card rhythm, and dark-sky-safe contrast.
- Create the media manifest for approved photos, including source file, intended use, and public/private sharing status.
- Stand up the frontend application shell with route stubs for the core site architecture.
- Choose and model the first CMS or MDX content shape for pages, blog posts, activism updates, experiences, and workshops.
- Create the internal vendor and permit registry interface if it makes sense to share the same admin surface as the site shell.

### Deliverables

- Token file and theme primitives.
- Media manifest with approved image metadata.
- Working staging site with empty but structured routes.
- CMS schema or content model for pages and update streams.
- Component starter set for hero, story block, FAQ, content section, and newsletter capture.

### Out of scope

- No real booking, checkout, or newsletter sending yet.
- No deep animation or branding exploration beyond the approved direction.
- No attempt to make the staging shell look fully launched.

## How

### Implementation approach

1. Translate the blueprint’s palette sets into a token layer the frontend can consume directly. Use semantic names such as surface, accent, desert, night, and warning instead of hard-coding colors throughout components.
2. Build the staging app in the long-term site stack: Next.js, TypeScript, and Tailwind. That prevents a throwaway prototype and keeps early UI work reusable.
3. Create route shells for the exact long-term structure, even when the pages only contain placeholder copy and route-purpose notes.
4. Implement a content abstraction early. Whether you choose MDX first or a headless CMS first, the content model should already know the difference between a workshop, a stay unit, an activism update, and a blog post.
5. Keep the admin model simple. Operators should eventually edit content without developer help, but in this sprint the focus is schema clarity, not fancy editorial tooling.
6. Use the media manifest to enforce public/private image separation so private home-zone images do not leak into public layouts by accident.

### Data and system contracts touched

- `design token seed file`
- `media manifest`
- `page/content schema`
- `vendor and permit registry records if included`

## Why

- This sprint prevents visual drift. Without it, each feature sprint becomes a mini-redesign and slows delivery.
- It gives the public-facing system a skeleton before real content and booking logic arrive, which matches the white paper’s ‘elegant, useful, staged’ website recommendation.
- It also protects the Susan-photo-led identity from being diluted by generic southwestern styling.
- Most importantly, it lets later sprints focus on flows and content, not foundational layout decisions.

## Review

### Questions to resolve before commit

- Do you want to begin with MDX-first content for speed, or a headless CMS for earlier operator editing?
- Should the vendor and permit registry share the same admin shell as the site content system, or stay separate as a pure internal tool?
- Do you want route placeholders to include light draft copy now, or remain skeletal until copy review?

### Dependencies

- Approved photo set and public/private image decisions
- Decision on content-management direction
- Sprint 0.1 workspace structure

### Definition of done

- The staging site runs locally or in a staging environment and exposes all intended primary routes.
- Design tokens exist for typography, palette, spacing, and core components.
- Approved photos are cataloged with intended-use metadata.
- Content entities can be created for at least static pages, blog entries, activism updates, and workshop shells.

### What this sprint unlocks next

- Sandbox Integrations and Internal Assistant
- Public Website and Blog Launch
