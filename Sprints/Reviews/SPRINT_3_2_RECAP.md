# Sprint 3.2 Recap: Advanced CRM and Recommendation Engine

**Sprint**: 3.2 (A-3.2)
**Status**: COMPLETE
**Implementation Date**: 2026-03-19
**Quality Gate**: PASSED (lint, typecheck, build)

---

## Summary

Implemented a comprehensive CRM system with customer profile management, unified event history, rule-based recommendations, and lifecycle automation. The system supports identity resolution across email aliases and external system IDs without requiring data migration.

---

## Deliverables Completed

### A-3.2.1 - Customer Profile Schema (DEC-059)
**File**: `lib/crm/types.ts` (lines 1-88)

- `CustomerProfile` schema with:
  - Stable `profileId` for identity
  - `primaryEmail` (normalized) and `aliasEmails` array
  - `externalIds` array for Lodgify, Stripe, Postmark mappings
  - Basic info fields (displayName, firstName, lastName, phone)
  - Communication preferences (see A-3.2.4)
  - Tags for segmentation
  - Computed stats (populated on read)
  - Merge history audit trail

### A-3.2.2 - Unified Event History Query Layer (DEC-060)
**File**: `lib/crm/history.ts`

- Query layer across existing event sources WITHOUT data migration
- Sources: guest-events, analytics, rentals, shop
- Functions:
  - `getEventHistory()` - filtered by email, profileId, eventTypes, dates
  - `getEventCountsByType()` - aggregate counts
  - `getEventDateRange()` - first/last event timestamps
  - `getActiveEmails()` - unique emails with recent activity
- Cross-source normalization via email

### A-3.2.3 - Recommendation Engine (DEC-061)
**File**: `lib/crm/types.ts` (lines 90-170), `lib/crm/store.ts`

- Rule schema with:
  - Conditions: `has_event`, `event_count_gte`, `recency_within`, `seasonality_match`, `has_tag`, `missing_event`
  - Actions: `suggest_product`, `add_tag`, `trigger_followup`, `suppress_marketing`
  - Priority-based conflict resolution
  - Validity period support
- Recommendation output with dismiss/accept workflow

### A-3.2.4 - Communication Preferences (DEC-062)
**File**: `lib/crm/types.ts` (lines 36-47)

- Explicit marketing opt-in (default false)
- Workshop notifications (default true)
- Follow-up allowed (default true, opt-out)
- Unsubscribe tracking with reason
- Consent audit (source, timestamp)

### A-3.2.5 - Lifecycle Automation (DEC-063)
**File**: `lib/crm/types.ts` (lines 172-261)

- Trigger conditions: `event_created`, `booking_confirmed`, `registration_complete`, `purchase_complete`, `days_since_event`, `days_before_date`
- Delay specification (hours/days)
- Action types: `send_email`, `create_followup_draft`, `add_tag`, `create_task`
- Cancel conditions: `event_exists`, `booking_cancelled`, `unsubscribed`, `manual`
- `requiresConsent` flag for marketing automations
- Scheduled run tracking

### A-3.2.6 - Extended Event Types (DEC-064)
**File**: `lib/crm/types.ts` (lines 263-288)

New event types:
- `rental`, `rental_quote`, `donation`
- `recommendation_accepted`, `recommendation_dismissed`
- `consent_updated`, `profile_merged`
- `tag_added`, `tag_removed`

---

## API Routes Created

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/crm/profiles` | GET, POST | List profiles, create profile, get-or-create |
| `/api/crm/profiles/[id]` | GET, PATCH | Get profile (with stats), update preferences, unsubscribe, merge |
| `/api/crm/history` | GET | Query unified event history, get active emails |
| `/api/crm/recommendations` | GET, POST, PATCH | List recommendations/rules, create rules, dismiss/accept |

---

## HYDE Amendments Applied

| # | Amendment | Applied |
|---|-----------|---------|
| 1 | History query layer without migration | Yes - queries existing stores directly |
| 2 | externalIdMappingSchema for integrations | Yes - source enum includes lodgify, stripe, postmark, manual |
| 3 | Merge history audit trail | Yes - profileMergeRecordSchema with eventsMigrated count |
| 4 | Query by profileId or email | Yes - HistoryQueryOptions supports both |
| 5 | Consent audit timestamps | Yes - consentUpdatedAt, consentSource fields |
| 6 | Scheduled automation run tracking | Yes - scheduledAutomationRunSchema with status lifecycle |
| 7 | Cancel conditions for automations | Yes - cancelConditionSchema with multiple types |
| 8 | requiresConsent flag | Yes - boolean flag on LifecycleAutomation |

---

## Store Functions (lib/crm/store.ts)

### Profile Operations
- `createCustomerProfile()` - with email normalization and duplicate check
- `getProfile()`, `getProfileByEmail()` - lookup by ID or email
- `updateProfile()` - general updates
- `listProfiles()` - sorted by updatedAt
- `getOrCreateProfile()` - idempotent upsert
- `mergeProfiles()` - consolidates aliases, tags, external IDs
- `updateCommunicationPreferences()` - with consent timestamp
- `unsubscribeProfile()` - sets opt-out with reason
- `computeProfileStats()` - aggregates from event history

### Recommendation Operations
- `createRecommendationRule()`, `getRecommendationRule()`, `listRecommendationRules()`
- `updateRecommendationRule()`
- `createRecommendation()`, `listRecommendations()`
- `dismissRecommendation()`, `acceptRecommendation()`

### Automation Operations
- `createLifecycleAutomation()`, `listLifecycleAutomations()`
- `scheduleAutomationRun()`, `listPendingRuns()`

---

## Data Storage

```
data/crm/
  profiles/{profileId}.json
  rules/{ruleId}.json
  recommendations/{recId}.json
  automations/{autoId}.json
  scheduled-runs/{runId}.json
```

---

## Quality Gates

| Check | Status | Notes |
|-------|--------|-------|
| pnpm lint | PASS | Existing warnings only |
| pnpm typecheck | PASS | Fixed createCustomerProfile signature |
| pnpm build | PASS | 76 pages generated |

---

## Notes

1. **No data migration**: The unified event history layer queries existing stores (guest-events, analytics, rental, shop) at read time rather than copying data.

2. **Email normalization**: Uses existing `normalizeGuestEmail()` from events module for consistent identity matching.

3. **Profile stats computed on read**: Stats are calculated from event history when requested via `?stats=true` query parameter.

4. **Recommendation generation**: Rules define conditions/actions but actual recommendation generation requires a separate `/api/crm/recommendations/generate` endpoint (noted in POST response).
