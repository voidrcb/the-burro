# Sprint 3.1 HYDE Review Findings

**Sprint:** 3.1 - Bilingual Support and Internationalisation
**Reviewer:** HYDE (Critical Review Agent)
**Review Date:** 2026-03-19
**Proposal:** `Sprints/Proposals/12_sprint_3_1_bilingual_support_and_internationalisation.md`

---

## Executive Summary

Sprint 3.1 proposes adding Spanish-language support to the platform through reviewed translations rather than raw machine translation. This is strategically appropriate for the Big Bend/Boquillas borderland context.

The proposal correctly emphasizes quality over coverage and defers to stability before translation. However, implementation requires explicit routing strategy, translation state lifecycle, and Burro bilingual behavior specifications.

**Disposition:** APPROVED WITH AMENDMENTS

---

## Findings

### HF-3101: Locale Routing Strategy Undefined

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "Locale-ready frontend routing or translation system" without specifying:
- URL structure: `/es/about` vs. `?lang=es` vs. subdomain
- Default language handling
- Language persistence (cookie, URL, session)
- SEO implications (hreflang tags, canonical URLs)

The existing Next.js app router structure needs explicit i18n configuration.

**Recommendation:** Use path-based locale routing (`/es/...`) with Next.js i18n configuration. English remains default at root paths. Language preference persisted via cookie with URL override.

---

### HF-3102: Translation Review State Machine Missing

**Type:** MISSING_SPEC
**Severity:** BLOCKING

The proposal mentions "draft, reviewed, approved, deprecated" states but does not define:
- State transition rules
- Who can transition (translator, reviewer, operator)
- Machine-translation source tracking
- Human-edit flag

**Recommendation:** Define `TranslationRecord` schema with:
- `id: string`
- `sourceKey: string` (stable identifier)
- `sourceLocale: 'en'`
- `targetLocale: 'es'`
- `sourceText: string`
- `translatedText: string`
- `status: 'draft' | 'reviewed' | 'approved' | 'deprecated'`
- `machineTranslated: boolean`
- `humanEdited: boolean`
- `reviewedBy: string | null`
- `reviewedAt: string | null`

---

### HF-3103: Critical Content Identification

**Type:** CLARIFICATION_NEEDED
**Severity:** BLOCKING

The proposal mentions "routes where language support creates the most operational value and least factual drift risk" but does not enumerate them.

**Mandatory first-release routes should be:**
1. `/about` - Brand identity (high value)
2. `/stay` catalog - Core product (high value)
3. `/policies` and etiquette - Safety critical (low drift tolerance)
4. `/contact` - Operational (high value)
5. Booking confirmation emails - Transactional (critical)
6. Error states and form validation messages - UX critical

**Deferred routes:**
- Blog posts (low priority, high volume)
- Activism feed (English-native content)
- Workshop descriptions (operator can translate ad-hoc)

**Recommendation:** Define explicit route tier list (Tier 1 mandatory, Tier 2 recommended, Tier 3 deferred) before translation work begins.

---

### HF-3104: Translation Memory Storage Pattern

**Type:** MISSING_SPEC
**Severity:** IMPORTANT

The proposal mentions "translation-memory foundation" without specifying:
- Storage format (JSON files, JSONL, database)
- Directory structure (`cms/translations/`, `data/translations/`)
- Key naming convention
- Namespace organization (by route, by component, by domain)

**Recommendation:** Use file-based translation memory at `cms/translations/{locale}/` with namespace subdirectories. Keys should be stable identifiers using dot notation (e.g., `nav.home`, `booking.confirmation.title`).

---

### HF-3105: Burro Bilingual Behavior Constraints

**Type:** CLARIFICATION_NEEDED
**Severity:** IMPORTANT

The proposal states Burro should "operate in bilingual mode for approved content surfaces" and "answer approved bilingual queries without inventing untranslated policy."

This requires explicit specification of:
- Language detection mechanism
- Response language selection logic
- Approved phrase set boundaries
- Fallback behavior for untranslated queries

**Recommendation:** Burro should:
1. Detect query language (simple heuristic: starts with Spanish greeting or contains Spanish keywords)
2. Check for approved translation of response template
3. If approved translation exists: respond in detected language
4. If no translation: respond in English with brief Spanish acknowledgment
5. NEVER generate machine-translated policy or safety content on-the-fly

---

### HF-3106: Form and Error State Translation

**Type:** INTEGRATION_RISK
**Severity:** IMPORTANT

Forms across the application use inline validation messages. Translation requires:
- Centralized validation message strings
- Form field labels externalized
- Error state translations (network errors, validation failures)

Current form implementations likely have hardcoded English strings.

**Recommendation:** Create `lib/i18n/messages.ts` with typed message dictionaries. Refactor forms to use message keys. This should be done as foundational work before route-specific translations.

---

### HF-3107: CMS Content Translation Strategy

**Type:** CLARIFICATION_NEEDED
**Severity:** ADVISORY

CMS content at `cms/experiences/`, `cms/workshops/`, `cms/units/` contains prose descriptions. Two approaches:
1. Duplicate files with locale suffix (`experience-name.es.json`)
2. Add locale field inside existing files (`description_es: string`)

**Recommendation:** Use locale suffix approach (`*.es.json`) for full content translation. Keeps English canonical, avoids schema changes to existing types.

---

### HF-3108: Quality Assurance Process

**Type:** MISSING_SPEC
**Severity:** ADVISORY

Translation quality requires review process. The proposal mentions "human translation review entirely manual, or supported by machine-first suggestions."

**Recommendation:** Machine-first with mandatory human review for Tier 1 content. Track `machineTranslated` and `humanEdited` flags. Require `humanEdited: true` before `status: 'approved'` for policy/safety content.

---

## Questions Resolved

Based on architectural consistency:

1. **Mandatory routes for first Spanish release:** Tier 1 as defined in HF-3103 (about, stay catalog, policies, contact, booking emails, error states).

2. **Human vs. machine translation:** Machine-first with human review. `TranslationRecord` tracks both flags. Policy content requires human edit.

3. **Burro language behavior:** Detect and match when translation exists. Fallback to English with Spanish acknowledgment. Never generate untranslated policy.

---

## Amendments Required

### A-3.1.1: Locale Routing Strategy
Path-based routing with Next.js i18n (`/es/...`). English at root. Cookie persistence with URL override.

### A-3.1.2: Translation Record Schema
Define `TranslationRecord` type with status lifecycle (4 states), machine/human tracking, and reviewer attribution.

### A-3.1.3: Route Tier Classification
Define Tier 1 (mandatory), Tier 2 (recommended), Tier 3 (deferred) route lists for translation prioritization.

### A-3.1.4: Translation Memory Storage
File-based at `cms/translations/{locale}/` with namespace organization and stable dot-notation keys.

### A-3.1.5: Burro Bilingual Constraints
Language detection, approved-phrase-only responses, English fallback with acknowledgment, no generated policy translation.

### A-3.1.6: Message Externalization
Create `lib/i18n/messages.ts` with typed message dictionaries for forms, errors, and UI strings.

---

## Key Decisions

- **DEC-053:** Path-based locale routing (`/es/...`)
- **DEC-054:** Translation record state machine (4 states)
- **DEC-055:** Tier 1/2/3 route classification for translation priority
- **DEC-056:** File-based translation memory at `cms/translations/`
- **DEC-057:** Burro bilingual behavior constraints (approved phrases only)
- **DEC-058:** Message externalization pattern for i18n

---

## Approval

**Status:** APPROVED WITH AMENDMENTS

All six amendments (A-3.1.1 through A-3.1.6) are required for implementation. Three findings are BLOCKING and must have type definitions before translation work begins.

---

*Reviewed by: HYDE (Critical Review Agent)*
*Workflow: dual-brain sprint*
