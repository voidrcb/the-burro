---
title: "Sprint 3.1 Proposal — Bilingual Support and Internationalisation"
project: "Big Bend Burro"
sprint_id: "3.1"
phase_id: "P3"
phase_name: "Mature Operation"
status: "draft_for_review"
proposal_format: "what-how-why-review"
estimated_duration_weeks: 4
source_artifacts:
  - "Big_Bend_Burro_Blueprint_Final.json"
  - "Big_Bend_Burro_Pro_Draft_White_Paper_Suite.docx"
---

# Sprint 3.1 Proposal — Bilingual Support and Internationalisation

## Proposal intent

Add carefully reviewed Spanish-language support to the public platform and selected assistant flows so the project can serve a broader audience without lowering factual control or operational clarity.

## Proposal basis

- Blueprint phase P3 build scope includes bilingual support and feature registry item F014 plans Spanish-language support for selected routes and assistant flows.
- Conversation material includes an explicit desire to learn Spanish and regionally relevant cross-border context.
- Boquillas and broader borderland context make Spanish support strategically coherent once the base product is stable.
- The blueprint defers bilingual support until later, which signals quality and review matter more than speed here.

## What

### In scope

- Internationalize the frontend structure and content system for English and Spanish.
- Translate selected high-value routes such as about, stay basics, workshops, etiquette/logistics, and selected assistant answers.
- Create a translation review workflow and translation-memory foundation.
- Ensure Burro can operate in bilingual mode for approved content surfaces.

### Deliverables

- Locale-ready frontend routing or translation system.
- Initial bilingual content set for selected routes.
- Translation review workflow and memory store.
- Bilingual assistant prompt and response controls.

### Out of scope

- No raw machine-translation rollout across the entire platform without review.
- No full bilingual coverage for every archival blog post unless explicitly chosen.
- No assumption that cross-border operational products automatically launch with language support.

## How

### Implementation approach

1. Internationalize the content layer first so translation is not scattered across component files.
2. Use reviewed source strings and translation memory rather than ad hoc per-page translation. The goal is consistency, especially for safety, policy, and logistics language.
3. Start with the routes where language support creates the most operational value and least factual drift risk.
4. Add a review state to translations: draft, reviewed, approved, deprecated.
5. Constrain Burro’s bilingual response set to approved memories and reviewed phrases where correctness matters.
6. Test all critical flows in both languages, especially forms, booking-related messages, and error states.

### Data and system contracts touched

- `translation memory`
- `localized page content objects`
- `review status on translations`
- `assistant bilingual phrase/control set`

## Why

- This sprint broadens accessibility while respecting the project’s maturity rule: only do this once the base system is stable enough to translate accurately.
- It also matches the borderland context instead of treating the platform as culturally generic.
- Doing this late is smart. Poor translation on a fragile MVP would hurt trust more than the absence of translation.
- By this phase, the project should have enough operational clarity to preserve nuance across languages.

## Review

### Questions to resolve before commit

- Which routes are mandatory in the first Spanish release, and which should remain English-only until later?
- Do you want human translation review entirely manual, or supported by machine-first suggestions plus approval?
- Should Burro default to English with a language toggle, or detect and shift automatically?

### Dependencies

- Stable public content system
- Translation tooling choice
- Approved terminology list

### Definition of done

- Selected public routes are available in Spanish and preserve meaning, tone, and policy clarity.
- Operators can review and update translations without code edits.
- Burro can answer approved bilingual queries without inventing untranslated policy.
- Critical forms and messaging behave correctly across languages.

### What this sprint unlocks next

- Advanced CRM and Recommendation Engine
- Partner Network Expansion and Event Operations
