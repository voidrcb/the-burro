import { getExperienceProductById, listBookableExperienceProducts, listPackagePricingRules } from '@/lib/content/experiences';
import { getUnitById } from '@/lib/content/units';
import { getWorkshopProgramBySlug } from '@/lib/content/workshops';
import type { ExperienceProduct, Month } from '@/lib/experience/types';
import type { CapacityHold, ItineraryComponent, PackagePricingRule } from '@/lib/itinerary/types';

const HOLD_DURATION_MS = 72 * 60 * 60 * 1000;

function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

const MONTHS: readonly Month[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

function formatMonth(date: string): Month {
  return MONTHS[parseDate(date).getUTCMonth()];
}

export function expandDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = parseDate(start);
  const endDate = parseDate(end);

  while (cursor <= endDate) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function rangesOverlap(left: string[], right: string[]): boolean {
  return left.some((date) => right.includes(date));
}

function componentNightCount(component: ItineraryComponent): number {
  return Math.max(component.dates.length - 1, 1);
}

function getApplicablePricingRules(
  components: ItineraryComponent[],
  allRules: PackagePricingRule[],
  groupSize: number,
  startDate: string,
): PackagePricingRule[] {
  return allRules.filter((rule) => {
    if (rule.validFrom && startDate < rule.validFrom) {
      return false;
    }
    if (rule.validTo && startDate > rule.validTo) {
      return false;
    }

    if (rule.triggerType === 'group_size') {
      return typeof rule.triggerValue === 'number' && groupSize >= rule.triggerValue;
    }

    if (rule.triggerType === 'min_nights') {
      const nights = components.filter((component) => component.type === 'lodging').reduce((total, component) => total + componentNightCount(component), 0);
      return typeof rule.triggerValue === 'number' && nights >= rule.triggerValue;
    }

    if (rule.triggerType === 'component_combo') {
      return typeof rule.triggerValue === 'string' && components.some((component) => component.type === rule.triggerValue);
    }

    if (rule.triggerType === 'seasonal') {
      return typeof rule.triggerValue === 'string' && formatMonth(startDate) === rule.triggerValue;
    }

    return false;
  });
}

export async function validateItineraryComponents(
  components: ItineraryComponent[],
  activeHolds: CapacityHold[],
  range: { start: string; end: string },
): Promise<{ errors: string[]; notes: string[]; fallbackSuggestions: string[] }> {
  const errors: string[] = [];
  const notes: string[] = [];
  const fallbackSuggestions = new Set<string>();
  const rangeDates = expandDateRange(range.start, range.end);
  const hasExperience = components.some((component) => component.type === 'experience');
  const hasAnchor = components.some((component) => component.type === 'lodging' || component.type === 'workshop');

  if (!hasExperience || !hasAnchor) {
    errors.push('Sprint 2.1 MVP packages require an experience plus either lodging or a workshop anchor.');
  }

  for (const component of components) {
    if (!component.dates.every((date) => rangeDates.includes(date))) {
      errors.push(`${component.title} includes dates outside the itinerary range.`);
    }

    if (component.type === 'lodging') {
      const unit = await getUnitById(component.refId);
      if (!unit || unit.status === 'private') {
        errors.push(`${component.title} is not available for itinerary composition.`);
        continue;
      }

      const overlappingHolds = activeHolds.filter(
        (hold) => hold.componentType === 'lodging' && hold.componentId === component.refId && rangesOverlap(hold.dates, component.dates),
      );
      if (overlappingHolds.length > 0) {
        errors.push(`${component.title} already has a provisional hold for part of this date range.`);
      }
      notes.push(`${component.title} keeps remote-arrival and private-zone policies in the itinerary summary.`);
    }

    if (component.type === 'workshop') {
      const [workshopSlug, sessionId] = component.refId.split('::');
      const program = workshopSlug ? await getWorkshopProgramBySlug(workshopSlug) : null;
      const session = program?.schedule.find((entry) => entry.id === sessionId);
      if (!program || !session) {
        errors.push(`${component.title} could not be resolved to a workshop session.`);
        continue;
      }

      const heldSeats = activeHolds
        .filter((hold) => hold.componentType === 'workshop' && hold.componentId === component.refId && rangesOverlap(hold.dates, component.dates))
        .reduce((total, hold) => total + hold.quantity, 0);
      if (session.status !== 'open' || session.spotsAvailable - heldSeats < component.quantity) {
        errors.push(`${component.title} does not have enough remaining seats for this draft.`);
      }
      notes.push(`${component.title} uses the published intake and waiver requirements already proven in Sprint 1.3.`);
    }

    if (component.type === 'experience') {
      const experience = await getExperienceProductById(component.refId);
      if (!experience || experience.status === 'private' || experience.status === 'coming-soon') {
        errors.push(`${component.title} is not ready for itinerary packaging.`);
        continue;
      }

      const month = formatMonth(component.dates[0]);
      if (!experience.seasonality.available.includes(month)) {
        errors.push(`${component.title} is outside its supported seasonality window.`);
      }

      const reservedSeats = activeHolds
        .filter((hold) => hold.componentType === 'experience' && hold.componentId === component.refId && rangesOverlap(hold.dates, component.dates))
        .reduce((total, hold) => total + hold.quantity, 0);

      if (reservedSeats + component.quantity > experience.maxGroupSize) {
        errors.push(`${component.title} exceeds the current scaffold-mode group capacity.`);
        const alternatives = await suggestAlternativeExperiences(experience, component.dates[0]);
        alternatives.forEach((alternative) => fallbackSuggestions.add(alternative));
      }

      notes.push(`${component.title} departs from ${experience.meetingPoint} and requires ${experience.waiverRequired ? 'a waiver' : 'no separate waiver'}.`);
    }
  }

  return {
    errors,
    notes,
    fallbackSuggestions: [...fallbackSuggestions],
  };
}

async function suggestAlternativeExperiences(source: ExperienceProduct, startDate: string): Promise<string[]> {
  const month = formatMonth(startDate);
  const experiences = await listBookableExperienceProducts();
  return experiences
    .filter((candidate) => candidate.id !== source.id && candidate.category === source.category && candidate.seasonality.available.includes(month))
    .slice(0, 2)
    .map((candidate) => `${candidate.name} (${candidate.locationSummary})`);
}

export async function applyPricingRules(
  components: ItineraryComponent[],
  manualAdjustment: { type: 'discount' | 'surcharge'; amount: number; reason: string } | undefined,
  groupSize: number,
  startDate: string,
): Promise<{ totalPrice: number; pricingRuleIds: string[] }> {
  const baseTotal = components.reduce((total, component) => total + component.priceAtDraft, 0);
  const rules = await listPackagePricingRules();
  const applicableRules = getApplicablePricingRules(components, rules, groupSize, startDate);

  let adjustedTotal = baseTotal;
  for (const rule of applicableRules) {
    if (rule.adjustmentType === 'percentage_discount') {
      adjustedTotal -= adjustedTotal * (rule.adjustmentValue / 100);
    } else if (rule.adjustmentType === 'fixed_discount') {
      adjustedTotal -= rule.adjustmentValue;
    } else {
      adjustedTotal += rule.adjustmentValue;
    }
  }

  if (manualAdjustment) {
    adjustedTotal += manualAdjustment.type === 'discount' ? -manualAdjustment.amount : manualAdjustment.amount;
  }

  return {
    totalPrice: Math.max(0, Number(adjustedTotal.toFixed(2))),
    pricingRuleIds: applicableRules.map((rule) => rule.id),
  };
}

export function getHoldExpiry(createdAt = new Date()): string {
  return new Date(createdAt.getTime() + HOLD_DURATION_MS).toISOString();
}
