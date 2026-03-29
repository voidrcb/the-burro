# Big Bend Burro — Unified Sprint Proposal

## Review Draft

This document is a detailed sprint proposal for the Burro project. It is written for review, not as a code spec. It intentionally leaves out dates, durations, and schedule language.

The purpose of this sprint is to turn the current Burro direction into a single, coherent implementation package that covers the major site, workflow, assistant, commerce, and documentation changes already identified.

---

## 1. Executive Summary

The Burro should not be treated as a collection of disconnected pages and experiments. It should operate as one coordinated system with four clear jobs:

1. Present Big Bend Burro as a premium, conservation-grounded destination brand.
2. Convert interest into stays, workshops, rentals, inquiries, and curated product sales.
3. Reduce operational friction for Chuck and Susan through simple workflows and assistant support.
4. Keep the business technically manageable by using structured content, proven SaaS tools, and guarded automation.

This sprint proposal therefore combines:

- public site improvements
- booking and checkout improvements
- operational workflow improvements
- Burro assistant improvements
- content and documentation cleanup
- analytics, partner, accessibility, and resilience improvements

The core recommendation is simple:

**build one clean operating system for Burro, not a patchwork of pages, forms, and manual side processes.**

---

## 2. Sprint Objective

Deliver a reviewable, implementation-ready package that upgrades Burro across the full technical and site surface so the project can move from scaffolded presentation into a cleaner, more usable operating platform.

This sprint should produce a system that:

- has one source of truth for prices, offers, policies, and feature status
- supports live or activation-ready commerce flows
- gives guests a clearer booking and planning path
- gives Chuck and Susan simpler operator workflows
- makes Burro useful as a practical assistant, not just a concept
- strengthens the conservation and dark-sky identity instead of treating it as side copy
- remains realistic for a remote, utility-constrained, seasonally sensitive Big Bend business

---

## 3. Strategic Rationale

Burro’s business model is not a single offer. It is a blended place-based platform built from stays, workshops, selected rental income, artisan commerce, photography, and conservation-grounded storytelling. The website is meant to be the public operating surface for those offers, and Burro itself is meant to start as a practical operating assistant using a SaaS-first stack before any heavy custom platform work.

That means the sprint cannot just “improve the site.” It has to align the following layers at the same time:

- business model
- site information architecture
- content and offer hierarchy
- forms, bookings, and checkout logic
- operator workflows
- assistant knowledge and guardrails
- analytics and review loops

This sprint also has to reflect the real-world constraints present in the project materials:

- Big Bend demand is seasonal, with spring and shoulder periods carrying the strongest commercial value.
- The Chisos Basin closure shifts gateway demand outward and creates opportunity for differentiated off-park stays and experiences.
- Equipment rental economics work best when delivery, availability, and simplicity are part of the offer.
- Heavy fragile goods are harder to scale online, so workshops and curated commerce should be prioritized over broad catalog expansion.
- The border-wall and dark-sky issues are not side topics; they are directly connected to the project’s place, brand, and economic future.
- The owners’ real-world concerns include land/probate uncertainty, water/infrastructure work, remote access, and a desire to build at a human pace.

---

## 4. Guiding Rules for the Sprint

### Rule 1: One source of truth

Rates, product names, workshop details, equipment status, and feature flags should not live in multiple conflicting places. The site, the user guide, the Burro assistant, and the internal data model must all read from the same approved content source.

### Rule 2: SaaS first, custom where it matters

Do not custom-build commodity functions that already have mature providers. Use platform tools for bookings, payments, email, and rental scheduling wherever that reduces technical burden.

### Rule 3: Deterministic operations around AI

Burro can draft, summarize, route, and assist. It should not silently control critical external actions. Money movement, booking changes, policy statements, and high-risk publishing should remain behind deterministic workflows and human approval.

### Rule 4: Remote-first usability

The site and workflows must account for weak connectivity, heavy mobile use, long-drive guests, and operators who are not highly technical.

### Rule 5: Conservation is product logic, not decorative copy

Dark-sky protection, water realities, wildlife respect, and border-wall impacts belong inside the product and content system because they change how guests evaluate the place.

### Rule 6: Do not overpromise unresolved physical inventory

If land, utilities, staging, or additional units depend on unresolved title, probate, water, or construction work, the public site must not imply certainty that does not yet exist.

---

## 5. Sprint Outcomes

At the end of this sprint, Burro should be reviewable as a system with the following outcomes:

- a coherent public site with clearer routes, stronger conversion paths, and better mobile behavior
- cleaned and unified business data across pages and assistant knowledge
- activation-ready or live payment and deposit flows
- a more complete stay / workshop / rental / shop guest journey
- assistant workflows that are practical, approved, and grounded in controlled content
- improved operator documentation and support materials
- analytics, QA, and review systems that let the project improve without guessing

---

## 6. Full Sprint Scope

### 6.1 Workstream A — Canonical Content and Data Normalization

#### What

Create a single approved content and data layer for Burro that drives:

- public site copy
- pricing displays
- workshop details
- equipment and rental details
- shop product details
- feature status labels
- assistant knowledge and operator help content

#### How

- Build a structured content registry in Markdown + JSON.
- Normalize all public offers into canonical records.
- Reconcile all conflicting prices, equipment lists, product names, workflow descriptions, and feature states.
- Create shared objects for:
  - accommodations
  - workshops
  - equipment assets
  - shop products
  - steel-building inquiries
  - conservation updates
  - operator workflow states
- Add status fields such as:
  - active
  - manual follow-up
  - coming soon
  - hidden
  - unavailable
- Connect the site, docs, and Burro prompt/knowledge files to this registry.

#### Why

The current project materials show conflicting values and descriptions across the user guide, GPT files, and operating content. That creates operator confusion, guest confusion, and assistant drift. The sprint needs one approved source layer before any serious automation or activation.

#### Deliverables

- canonical content/data map
- normalized offer registry
- shared pricing/seasonality objects
- structured feature-flag table
- documentation of what changed and why

#### Acceptance criteria

- no conflicting public rates remain in the approved content set
- equipment lists match the actual intended offer
- workshop names, capacities, and pricing logic are consistent across site and assistant assets
- feature status messaging is consistent everywhere

---

### 6.2 Workstream B — Commerce and Payment Activation Layer

#### What

Move Burro from placeholder payment signaling into a real or activation-ready payment system for:

- stays
- workshops
- curated shop purchases
- deposits where needed
- optional donation / support flows

#### How

- Connect lodging to Lodgify or approved lodging provider.
- Connect workshops and shop checkout to Stripe.
- Add deposit logic where applicable.
- Define payment state machine:
  - draft
  - pending
  - deposit received
  - paid in full
  - refunded
  - cancelled
- Replace purely decorative payment stubs where activation is approved.
- Preserve clear manual handoff messaging only where activation is intentionally deferred.
- Add transactional email and receipt handling.

#### Why

The site is currently carrying “Coming Soon” messaging and visual payment placeholders. That is useful for scaffolding, but it does not create a clean operating model. This sprint should turn the commerce layer into something that is either live or clearly activation-ready without mixed signals.

#### Deliverables

- Stripe configuration plan and integration map
- Lodging payment handoff map
- workshop checkout flow
- shop checkout flow
- deposit/refund rules
- payment-state content and operator notes

#### Acceptance criteria

- checkout logic is consistent across all payment-bearing paths
- operators can see payment state without guessing
- manual follow-up only exists where intentionally retained
- public messaging does not overstate what is live

---

### 6.3 Workstream C — Unified Booking and Guest Journey

#### What

Create a clearer end-to-end guest journey from discovery to confirmation for:

- stays
- workshops
- rentals
- shop purchases
- custom inquiries

#### How

- Create a unified booking and inquiry framework.
- Standardize forms, confirmation states, follow-up templates, and reminders.
- Add guest profile or guest-history support where practical.
- Build consistent pre-arrival, pre-session, and post-purchase workflows.
- Support bundled logic where appropriate:
  - stay + workshop
  - stay + stargazing
  - workshop + shop follow-up
  - rental + delivery
- Define what belongs in a guest account area versus what stays email-driven.

#### Why

The white paper frames the website as the public operating surface, not just a brochure. The guest journey therefore has to feel connected. Right now the site risks feeling like several separate funnels. This sprint should make Burro feel like one destination business.

#### Deliverables

- booking/inquiry journey map
- confirmation and reminder templates
- guest data model for history and follow-up
- bundled-experience flow logic
- cancellation/reschedule/refund workflow rules

#### Acceptance criteria

- each guest-facing offer has a clear next step
- each confirmed action produces the correct follow-up state
- operators can tell what happened without checking several unrelated systems

---

### 6.4 Workstream D — Public Site Architecture and Route Upgrades

#### What

Upgrade the public site so every major route has a sharper job, clearer offer structure, better conversion path, and stronger trust cues.

#### How

Rework the public route set as a coordinated architecture:

- `/` home / story / conversion hub
- `/stay`
- `/workshops`
- `/experiences`
- `/rentals`
- `/steel-buildings`
- `/shop`
- `/dark-sky`
- `/activism`
- `/about`
- `/journal` or `/blog`
- `/contact`
- supporting FAQ, policy, arrival, and seasonal guidance pages

For each route:

- define the page job
- define primary CTA
- define secondary CTA
- define trust content
- define proof elements
- define next-step connections to other routes

#### Why

The current materials correctly describe the site as a public front door. That requires strong page purpose. The site should not feel like a collection of topics. It should feel like a guided path into the right offer.

#### Deliverables

- revised route map
- page-purpose matrix
- CTA map
- internal cross-link plan
- revised nav and footer structure
- mobile-first content hierarchy by route

#### Acceptance criteria

- every core public page has one clear main job
- navigation reflects business priorities, not internal development history
- mobile users can understand the offer and take action without friction

---

### 6.5 Workstream E — Dark-Sky, Mapping, and Trip-Planning Tools

#### What

Build the trip-planning and dark-sky support surfaces that make Burro genuinely useful for Big Bend visitors.

#### How

- Create a dark-sky planning module with:
  - moon-phase awareness
  - meteor shower and event references
  - viewing guidance
  - seasonal conditions
- Add trip-planning content around:
  - road conditions
  - water and supply planning
  - limited cell coverage
  - what to bring
  - safety expectations
- Add a map or route-planning experience that reflects the remote-access reality.
- Add arrival and logistics content that can be cached or downloaded.
- Create offline-friendly key pages and downloadable guidance where practical.

#### Why

Big Bend is not a normal destination. Guests need utility, not just inspiration. The trip-planning layer is therefore part of product delivery, not just support content. It also reinforces the premium value of Burro by reducing uncertainty before arrival.

#### Deliverables

- dark-sky information module
- event/calendar structure
- route and arrival guidance set
- logistics FAQ
- offline-friendly key information surfaces

#### Acceptance criteria

- visitors can understand the remote-access reality before booking
- dark-sky content clearly links to stays and workshops
- guests receive useful planning information, not generic travel copy

---

### 6.6 Workstream F — Workshops and Artisan Commerce System

#### What

Turn workshops and artisan commerce into a cleaner, more defensible system built around premium experience-led value instead of broad fragile-product expansion.

#### How

- Separate the business into two clear commerce lanes:
  - **experience lane**: workshops, retreats, small-group creative sessions
  - **curated product lane**: prints, giftables, selected pottery, selected decorative tile
- Keep installation-tile / heavier custom work as an inquiry-led lane rather than broad public checkout.
- Add workshop-specific components:
  - dates
  - capacity
  - waitlist
  - intake questions
  - materials notes
  - waiver handling
  - confirmation and reminder flows
- Add curated shop logic:
  - filtered categories
  - inventory status
  - shipping profile
  - pickup options
  - limited-batch logic
- Add sample, commission, and custom inquiry paths where appropriate instead of forcing everything through direct checkout.

#### Why

The research is clear that heavy fragile goods are punishing online, while premium workshops can outperform product-only economics in this context. The sprint should therefore reinforce the strongest commercial model: experience first, curated commerce second.

#### Deliverables

- workshop data model
- registration flow
- waitlist logic
- waiver/intake logic
- curated shop product model
- shipping/pickup rules
- custom inquiry path for non-standard work

#### Acceptance criteria

- workshop flow is clearer than current manual capture
- the shop does not pretend to be a broad catalog when that is not the strategy
- product messaging reflects shipping reality and creative value honestly

---

### 6.7 Workstream G — Equipment Rental and Steel Buildings Operations

#### What

Turn rentals and steel buildings into strong service workflows that fit Chuck’s actual strengths and the local market shape.

#### How

For rentals:

- build asset records
- define availability and inspection states
- build request / quote / confirmation logic
- build delivery logic
- add deposit and agreement handling
- support maintenance notes and utilization tracking

For steel buildings:

- strengthen the page and inquiry system
- capture structured inquiry fields such as:
  - building type
  - size
  - intended use
  - location
  - budget/timeline
  - notes
- add proof content such as examples, process, and scope clarity

#### Why

The research supports a small, delivery-aware equipment offer with strong local moat potential, not a sprawling fleet. The steel-building service is also one of the cleanest immediate practical offers tied to Chuck’s credibility. Both need stronger workflows and better public framing.

#### Deliverables

- rental asset model
- inspection and maintenance workflow
- request / quote form logic
- delivery rules
- utilization reporting fields
- steel-building structured inquiry flow
- revised steel-building service content

#### Acceptance criteria

- rentals can be managed without hidden manual steps
- inspection and deposit processes are explicit
- steel-building leads arrive in a useful structured format
- public service description is clear about what is consultation/brokering versus direct construction

---

### 6.8 Workstream H — Burro Assistant, Knowledge, and Guardrails

#### What

Upgrade Burro from a loose GPT concept into a governed, practical assistant layer for both operators and guest support.

#### How

- Rebuild Burro around approved knowledge packs and structured routing.
- Use canonical Markdown/JSON content as the answer base.
- Separate assistant functions into modes:
  - operator support
  - guest FAQ and planning support
  - drafting support
  - workflow support
  - conservation/advocacy support
- Implement strict assistant operating rules:
  - answer from approved content
  - no silent policy invention
  - no silent external actions
  - human approval for high-risk changes
- Add assistant workflows for:
  - booking confirmations
  - workshop reminders
  - rental follow-ups
  - guest question drafting
  - blog/update drafting
  - activism brief drafting
- Update the Custom GPT file set so it reflects the real site and workflow state.

#### Why

The white paper is explicit: Burro should begin as an operating assistant, not a speculative moonshot. This sprint should therefore make Burro useful in controlled ways that save Chuck and Susan time without turning the assistant into a governance risk.

#### Deliverables

- revised Burro operating model
- updated knowledge pack structure
- updated GPT instructions/routing set
- approved workflow prompts
- guardrail and approval rules
- assistant-to-site content dependency map

#### Acceptance criteria

- Burro uses approved content and consistent feature states
- Burro is better at drafting and organizing than at guessing
- operator-facing use cases are materially easier after the update

---

### 6.9 Workstream I — Partner, CRM, and Analytics Layer

#### What

Build the lightweight business operations layer that lets Burro learn from activity and support growth without chaos.

#### How

- Create a simple CRM-style lead and guest record structure.
- Add operator view of:
  - inquiries
  - bookings
  - workshop signups
  - rental requests
  - shop purchases
  - follow-up status
- Create partner records and a partner content structure for:
  - guides
  - outfitters
  - local makers
  - excursion partners
- Add analytics events for:
  - CTA clicks
  - inquiry submissions
  - checkout starts
  - checkout completions
  - workshop interest
  - lead sources
  - newsletter signups
- Build initial dashboard logic around key business signals.

#### Why

The business cannot improve if every decision stays anecdotal. The site, forms, and assistant need a light but real operations layer so Burro can support follow-up, understand demand, and show what is working.

#### Deliverables

- CRM schema
- partner registry schema
- analytics event map
- dashboard requirements
- lead and follow-up status structure

#### Acceptance criteria

- operators can identify the next actions for real leads and guests
- the site captures useful events instead of just pageviews
- partner information can be managed without scattered notes

---

### 6.10 Workstream J — Accessibility, Performance, Offline Resilience, and QA

#### What

Make the upgraded Burro experience more robust, more accessible, and more dependable under real usage conditions.

#### How

- run accessibility audit and fix key blockers
- improve keyboard flow, labels, contrast, alt text, and form clarity
- optimize images and route loading
- add offline-friendly and cached content where useful
- test mobile behavior thoroughly
- test low-bandwidth and interrupted-connection scenarios
- create QA checklists for all major flows
- add backup/export patterns for critical operator data

#### Why

A remote destination business cannot rely on ideal connection conditions or perfect operator confidence. Resilience is part of product quality. Accessibility is also part of professionalism and guest trust.

#### Deliverables

- accessibility issue log and fixes
- performance tuning pass
- offline/cached-content plan
- mobile QA pass
- operator fallback/export plan
- end-to-end test checklist

#### Acceptance criteria

- core flows remain understandable on mobile
- key information is available even when connection quality is poor
- forms and CTAs are more usable for real humans, not just developers

---

### 6.11 Workstream K — Documentation, Operator Support, and Rollout Readiness

#### What

Upgrade the documentation so the site, Burro, and operational flows are actually usable by Chuck and Susan without hidden assumptions.

#### How

- revise the operator user guide
- remove placeholders and unresolved instructions
- add missing procedures:
  - cancellations
  - refunds
  - reschedules
  - payment checks
  - order handling
  - offline fallback
  - data security basics
- add screenshots or visual placeholders for future screenshots
- update Burro setup and knowledge docs to match the live system
- create concise operator quick-reference sheets

#### Why

A better system still fails if the operators do not have a clear way to use it. The documentation needs to match the build, stay readable, and reduce dependence on ad hoc support.

#### Deliverables

- revised operator user guide
- revised Burro setup documentation
- revised knowledge base files
- quick-reference operator cheat sheet
- support/troubleshooting matrix

#### Acceptance criteria

- no critical workflow is described as “Ryan can show you later”
- common scenarios have written procedures
- docs reflect the real feature set and live status

---

## 7. Site Changes by Route

This section translates the workstreams into route-level expectations.

### `/`

**What changes**
- stronger story hierarchy
- clearer next-step paths into stay / workshop / dark-sky / conservation
- stronger proof of place, purpose, and credibility

**Why**
The home page must act as a router and trust builder, not just a hero image with general copy.

### `/stay`

**What changes**
- clear accommodation model
- availability and booking path
- logistics and road reality messaging
- cancellation and arrival guidance

**Why**
Stays are a core revenue anchor and need less ambiguity.

### `/workshops`

**What changes**
- premium workshop framing
- dates, seats, intake, waitlist, deposits
- cross-sell into stays and shop follow-up

**Why**
Workshops are one of the best margin layers and should be treated as a primary commercial surface.

### `/experiences`

**What changes**
- cleaner packaging of night-first, river, guided, and future partner experiences
- stronger messaging around seasonal fit
- clearer separation of owned vs partner-led experiences

**Why**
The research shows experience white space and the importance of product clarity.

### `/rentals`

**What changes**
- asset-specific pages or cards
- request / quote / delivery logic
- inspection and deposit expectations

**Why**
Rental value depends on trust, clarity, and availability.

### `/steel-buildings`

**What changes**
- stronger service explanation
- structured inquiry capture
- clearer scope and process

**Why**
This is a practical operator-aligned offer that can produce qualified leads quickly.

### `/shop`

**What changes**
- curated product logic
- cleaner inventory states
- better shipping/pickup language
- strong distinction between gift/decor and custom inquiry work

**Why**
The shop should support the brand without turning into a fulfillment burden.

### `/dark-sky`

**What changes**
- planning utility
- astronomy/event logic
- viewing guidance
- links into workshops and stays

**Why**
Dark sky is one of the region’s defining advantages and deserves a stronger functional page.

### `/activism`

**What changes**
- clearer issue framing
- update structure
- action paths
- economic and conservation explanation

**Why**
The issue is tied to the project’s value system and place-based economic future.

### `/journal` or `/blog`

**What changes**
- publishing rhythm
- categories for construction, field notes, dark-sky updates, workshops, activism, and product drops

**Why**
Burro needs a living narrative layer, not a static launch site.

### `/contact`

**What changes**
- cleaner routing of inquiry types
- lead categorization
- better follow-up state handling

**Why**
The contact page should reduce manual sorting and improve response quality.

---

## 8. Technical Implementation Shape

This sprint proposal is not a code spec, but it should still define the intended technical shape.

### Recommended implementation pattern

- **frontend:** Next.js App Router, TypeScript, Tailwind
- **content layer:** canonical Markdown + JSON registry or very light CMS
- **lodging:** Lodgify or approved lodging platform
- **payments:** Stripe
- **rentals:** Booqable or structured internal rental workflow if direct booking remains deferred
- **email:** transactional provider + templates
- **automation:** Zapier or n8n style workflow layer
- **analytics:** simple privacy-respectful analytics + server-side events where needed
- **assistant:** approved knowledge packs + deterministic orchestration + guarded prompting

### Core implementation rules

- content IDs must remain stable
- price and policy data must not be duplicated by hand across pages
- forms must write into structured objects, not email-only chaos
- external tool calls must remain behind deterministic logic and approval controls
- assistant retrieval must reference approved content, not floating drafts

---

## 9. Data and Content Model Changes Required

The sprint should formalize at least these records:

- accommodation record
- workshop program record
- workshop session record
- rental asset record
- product record
- guest record
- inquiry record
- booking / registration / order record
- steel-building inquiry record
- partner record
- activism update record
- follow-up task record
- feature-status record

Each should include:

- stable ID
- public status
- operator status where needed
- owner / steward
- pricing or price logic
- fulfillment or follow-up state
- timestamps

---

## 10. Review and Approval Checklist

This sprint should not be approved until the following decisions are reviewed:

### Business and offer decisions

- approve final public offer hierarchy
- approve which units, workshops, and products are public now
- approve what remains inquiry-only
- approve how strongly conservation/activism is foregrounded

### Technical decisions

- approve SaaS stack choices
- approve assistant operating boundaries
- approve whether guest accounts are in this sprint or staged behind the same architecture
- approve analytics event set

### Content decisions

- approve route-level page purpose
- approve tone and trust language
- approve remote-access and caution messaging
- approve curated vs broad-commerce language

### Operator decisions

- approve the level of automation allowed without manual review
- approve documentation structure and operator workflows
- approve cancellation/refund/reschedule rules

---

## 11. Risks and Controls

### Risk: scope becomes too broad and incoherent

**Control**
Keep one canonical business model and one content/data layer underneath everything.

### Risk: public site promises more than the physical project can currently support

**Control**
Tie all public inventory states to approved availability and unresolved land/utility constraints.

### Risk: Burro becomes too magical and not trustworthy

**Control**
Keep Burro inside approved knowledge, drafting support, and deterministic workflow support.

### Risk: commerce goes live without operational clarity

**Control**
Pair payment activation with explicit state handling, emails, refunds, and operator instructions.

### Risk: shop complexity outruns reality

**Control**
Keep curated commerce narrow and lean into workshop-led value.

### Risk: remote conditions break user trust

**Control**
Design for mobile, weak connectivity, offline utility, and plain-language logistics.

### Risk: conservation messaging becomes vague or performative

**Control**
Use approved facts, clear action paths, and place-based economic framing.

---

## 12. Items That Should Not Quietly Expand During This Sprint

This proposal is comprehensive, but the following items should only expand if specifically approved during review:

- broad commodity tile ecommerce
- large fleet rental-yard ambitions
- custom Burro platform work that replaces stable SaaS unnecessarily
- a full live-stream network beyond foundational architecture
- speculative public promises tied to unresolved land, probate, or utility assumptions
- generic marketplace expansion that dilutes the Big Bend positioning

---

## 13. Definition of Done

This sprint is done when Burro is reviewable as one coordinated system rather than a set of disconnected pages and concepts.

That means:

- the site structure is coherent
- the data layer is unified
- the assistant is grounded and controlled
- bookings, workshops, rentals, and shop flows make operational sense
- documentation matches the real system
- accessibility and mobile behavior are materially improved
- the business story, conversion logic, and conservation identity reinforce each other

---

## 14. Recommended Approval Decision

Approve this sprint if the goal is to create a single, reviewable Burro operating platform that aligns:

- business model
- site architecture
- content logic
- guest conversion flows
- operator workflows
- assistant support
- conservation framing

Do **not** approve it as a generic “site refresh.” It is a system alignment sprint.

---

## 15. Source Basis for This Proposal

This proposal was built from the project’s current internal planning and research materials, including:

- **Big Bend Burro Pro Draft White Paper Suite**
  - for the project thesis, SaaS-first Burro logic, website role, and operator-paced build direction
- **Big Bend & Terlingua Tourism Encyclopedia**
  - for seasonality, market gaps, dark-sky demand, Chisos closure effects, and trip-planning realities
- **Brewster County Equipment Rental Economics**
  - for the delivery-led rental moat, utilization logic, and why a small, disciplined equipment offer fits the region better than a large fleet strategy
- **Industrial Ceramic Tile vs. Handmade Art Tile & Pottery**
  - for the split between installation tile and gift/decor commerce, and why curated artisan sales should not be treated like commodity ecommerce
- **Handicrafts Market, Artisan Economics, and the Big Bend Workshop Opportunity**
  - for the workshop-first business case and the premium craft-experience logic
- **Big Bend Border-Wall Controversy**
  - for the economic, ecological, and dark-sky stakes that justify conservation and activism as core site content
- **03-08 conversation transcript, highlights, and summary**
  - for owner intent around remote access, tourism ideas, river integration, skid-steer and water-project realities, dark-sky concerns, and land/probate complications
- **Metalminds L3 Source of Truth**
  - for the deterministic orchestration, canonical content, lane separation, and policy-gated automation approach that should shape Burro’s assistant and knowledge workflows

---

## 16. Final Note

This proposal is intentionally detailed so it can be reviewed as a serious build document before code is changed. It is designed to align the vision without pretending the build is just a theme update or a small content pass.

The right outcome is a Burro platform that feels simple to use, clear to understand, and disciplined underneath.

