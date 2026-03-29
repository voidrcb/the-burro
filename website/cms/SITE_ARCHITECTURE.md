# Big Bend Burro - Public Site Architecture

**Version:** 1.1.0
**Last Updated:** 2026-03-28
**Purpose:** Define public route responsibilities, conversion paths, and supporting detail pages.

---

## Scope

This document covers public-facing routes in `website/frontend/app/`.
Internal operator routes under `/assistant` are intentionally excluded except where they influence a public handoff.

---

## Primary Public Routes

| Route | Job | Primary CTA | Secondary CTA |
|-------|-----|-------------|---------------|
| `/` | establish trust and route people into offers | Browse stays | View experiences |
| `/stay` | convert visitors into lodging handoff | View accommodations | Ask a question |
| `/workshops` | convert visitors into workshop registration | Register | View schedule |
| `/experiences` | generate experience interest | Explore experiences | Book a stay |
| `/shop` | convert visitors into product interest and checkout | Browse collection | View cart |
| `/dark-sky` | educate and upsell dark-sky offers | Explore workshops | Plan your visit |
| `/rentals` | convert qualified visitors into quote requests | Request a quote | View specs |
| `/steel-buildings` | capture consultation leads | Contact Chuck | Learn the process |
| `/activism` | educate and mobilize supporters | Take action | Learn more |
| `/about` | build trust | Contact us | Read the journal |
| `/blog` | support search and storytelling | Read posts | Explore related offers |
| `/contact` | capture general inquiries | Send message | Call or email |
| `/plan` | start itinerary and package planning | Start planning | Contact us |

---

## Supporting Detail Routes

| Route Pattern | Job |
|---------------|-----|
| `/stay/[slug]` | show a specific lodging unit with pricing context |
| `/stay/[slug]/book` | capture lodging intent and hand off to Lodgify |
| `/workshops/[slug]` | sell a specific workshop |
| `/workshops/[slug]/register` | capture workshop registration |
| `/experiences/[slug]` | explain a specific experience and route to follow-up |
| `/shop/[slug]` | product detail and add-to-cart |
| `/shop/checkout` | order capture and manual payment handoff |
| `/rentals/[slug]` | asset detail, specs, and quote CTA |
| `/rentals/request` | public quote request form |
| `/activism/updates/[slug]` | detail page for activism updates |

---

## Navigation Truth

### Primary Nav
`Home | About | Journal | Activism | Stay | Experiences | Workshops | Steel Buildings | Shop | Contact`

### Footer Priorities
- Explore: stay, workshops, experiences, steel buildings, shop
- Connect: contact, journal, newsletter placeholder
- Legal: placeholder only until policy pages exist

---

## Mobile Priorities

### Catalog Pages
1. Headline and trust context
2. Primary CTA
3. Status and price summary
4. First media asset
5. Logistics and FAQ blocks

### Transaction Pages
1. Clear title and what happens next
2. Required form inputs only
3. Payment / fulfillment explanation
4. Confirmation state

---

## Cross-Link Strategy

| From | To | Reason |
|------|----|--------|
| Stay | Workshops | turn lodging into higher-value activity planning |
| Workshops | Shop | offer related products after the experience |
| Dark Sky | Stay | encourage overnight stays for sky viewing |
| Dark Sky | Workshops | connect astronomy interest to instruction |
| Experiences | Plan | move custom requests into itinerary planning |
| Rentals | Steel Buildings | cross-sell Chuck's construction-related service |
| Shop | Workshops | connect products back to Susan's teaching lane |

---

## Current Gaps

- Public privacy and terms pages are not built yet.
- Newsletter flow exists as capture infrastructure but not as a finished public lane.
- Product detail pages still use lightweight image treatment; dedicated product photography would improve conversion.

*Site Architecture v1.1.0 - post-mortem aligned after Sprints 15 and 16*
