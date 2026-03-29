# Sprint 2.1 Recap: Itinerary Builder and Retreat Hosting

**Sprint**: 2.1
**Completed**: 2026-03-18
**Owner**: Jekyll (implementation closure)

## Summary

Sprint 2.1 delivers the internal-first itinerary builder and retreat hosting foundation. All deliverables specified in the approved proposal are complete, with quality gates passing.

## Amendments Applied

| ID | Amendment | Status |
|----|-----------|--------|
| A-2.1.1 | Internal-first end-to-end; no public self-serve itinerary builder | Applied |
| A-2.1.2 | Shareable output is permalink/HTML first; PDF optional | Applied |
| A-2.1.3 | ExperienceProduct supersedes legacy Experience type | Applied |
| A-2.1.4 | CapacityHold uses expiry-on-read/write, no background job | Applied |
| A-2.1.5 | /assistant/itinerary extends assistant shell pattern | Applied |
| A-2.1.6 | Quality gates: lint, typecheck, build; test N/A | Verified |

## Deliverables

### Type Contracts

| Contract | Location | Status |
|----------|----------|--------|
| ExperienceProduct | `lib/experience/types.ts` | Complete |
| Month (literal union) | `lib/experience/types.ts` | Added |
| ItineraryComponent | `lib/itinerary/types.ts` | Complete |
| ItineraryDraft | `lib/itinerary/types.ts` | Complete |
| GroupBooking | `lib/itinerary/types.ts` | Complete |
| CapacityHold | `lib/itinerary/types.ts` | Complete |
| PackagePricingRule | `lib/itinerary/types.ts` | Complete |
| ItineraryConfirmation | `lib/itinerary/types.ts` | Complete |

### Validation Engine

| Feature | Location | Status |
|---------|----------|--------|
| Component validation | `lib/itinerary/engine.ts:73-159` | Complete |
| Seasonality checks | `lib/itinerary/engine.ts:135-137` | Complete |
| Pricing rules | `lib/itinerary/engine.ts:170-199` | Complete |
| Hold expiry utility | `lib/itinerary/engine.ts:201-203` | Complete |

### Store Layer (Expiry-on-Read/Write)

| Operation | Location | Status |
|-----------|----------|--------|
| expireHoldIfNeeded | `lib/itinerary/store.ts:52-64` | Complete |
| listCapacityHolds | `lib/itinerary/store.ts:66-70` | Complete |
| listActiveCapacityHolds | `lib/itinerary/store.ts:72-75` | Complete |
| listItineraryDrafts | `lib/itinerary/store.ts:77-80` | Complete |
| syncCapacityHoldsForDraft | `lib/itinerary/store.ts:125-164` | Complete |
| reviewItineraryDraft | `lib/itinerary/store.ts:166-233` | Complete |
| createGroupBooking | `lib/itinerary/store.ts:245-285` | Complete |

### Public Routes

| Route | Path | Status |
|-------|------|--------|
| Experience catalog | `/experiences` | Complete |
| Experience detail | `/experiences/[slug]` | Complete |

### Internal Routes

| Route | Path | Status |
|-------|------|--------|
| Itinerary composer | `/assistant/itinerary` | Complete |
| Shareable draft | `/assistant/itinerary/[shareSlug]` | Complete |

### API Endpoints

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/assistant/itinerary/drafts` | GET/POST | Complete |
| `/api/assistant/itinerary/generate` | POST | Complete |
| `/api/assistant/itinerary/groups` | GET/POST | Complete |
| `/api/assistant/itinerary/review` | POST | Complete |

## Quality Gate Evidence

```
pnpm typecheck
> tsc --noEmit
(no errors)

pnpm lint
> next lint
No ESLint warnings or errors

pnpm build
> next build
Compiled successfully
Generating static pages (54/54)
```

## Type Fix Applied

The formatMonth function in `lib/itinerary/engine.ts` was returning `string` instead of the `Month` literal union type, causing TypeScript errors at lines 136 and 165 where seasonality checks used `includes()`.

**Fix**:
1. Exported `Month` type from `lib/experience/types.ts`
2. Changed formatMonth return type to `Month`
3. Used typed MONTHS constant array to ensure valid return values

```typescript
// Before
function formatMonth(date: string): string {
  return ['jan', 'feb', ...][parseDate(date).getUTCMonth()];
}

// After
const MONTHS: readonly Month[] = ['jan', 'feb', ...] as const;
function formatMonth(date: string): Month {
  return MONTHS[parseDate(date).getUTCMonth()];
}
```

## Key Decisions Applied

| Decision | Description |
|----------|-------------|
| DEC-028 | ExperienceProduct contract supersession |
| DEC-029 | Itinerary contract canonical paths |
| DEC-030 | CapacityHold expiry model (expiry-on-read/write) |
| DEC-031 | Internal-first itinerary builder |
| DEC-032 | Shareable draft output strategy (HTML/permalink first) |
| DEC-033 | Retreats as package subtype |

## No Blockers

Sprint 2.1 implementation is complete with no outstanding blockers.

## Next Sprint

Sprint 2.2: Public Equipment Rental
