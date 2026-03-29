import { readFile } from 'fs/promises';

import { getCmsPath } from '@/lib/server/repo';

import { rateRulesetSchema, type LodgingUnit, type RateRuleset, type SeasonalRate } from './stay-types';

const rateFilePath = getCmsPath('rates', 'seasonal.json');

type UnitRate = SeasonalRate['rates'][number];

export type ResolvedRate = {
  nightly: number;
  cleaningFee: number;
  weeklyDiscount?: number;
  seasonName: string;
  seasonId: string;
  defaultApplied: boolean;
  isBlackoutDate: boolean;
};

export type PriceQuote = ResolvedRate & {
  checkIn: string;
  checkOut: string;
  nights: number;
  totalEstimate: number;
  blackoutDates: string[];
  isBlackout: boolean;
};

function mmddToDayOfYear(mmdd: string): number {
  const [month, day] = mmdd.split('-').map(Number);
  const date = new Date(Date.UTC(2028, month - 1, day));
  const start = new Date(Date.UTC(2028, 0, 1));
  return Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;
}

function isoToDayOfYear(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(Date.UTC(year, 0, 1));
  return Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;
}

function seasonCoversDay(season: SeasonalRate, dayOfYear: number): boolean {
  const start = mmddToDayOfYear(season.startDate);
  const end = mmddToDayOfYear(season.endDate);
  return start <= end ? dayOfYear >= start && dayOfYear <= end : dayOfYear >= start || dayOfYear <= end;
}

function collectCoverageDays(season: SeasonalRate): number[] {
  const start = mmddToDayOfYear(season.startDate);
  const end = mmddToDayOfYear(season.endDate);

  if (start <= end) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  return [
    ...Array.from({ length: 366 - start + 1 }, (_, index) => start + index),
    ...Array.from({ length: end }, (_, index) => index + 1),
  ];
}

function validateNonOverlappingSeasons(ruleset: RateRuleset): void {
  const claimed = new Map<number, string>();

  for (const season of ruleset.seasons) {
    for (const day of collectCoverageDays(season)) {
      const existing = claimed.get(day);
      if (existing) {
        throw new Error(`Season overlap detected between "${existing}" and "${season.seasonId}".`);
      }
      claimed.set(day, season.seasonId);
    }
  }
}

function resolveUnitRate(season: SeasonalRate, unit: LodgingUnit): UnitRate | null {
  return season.rates.find((rate) => rate.unitId === unit.id) ?? null;
}

export async function getRateRuleset(): Promise<RateRuleset> {
  const raw = await readFile(rateFilePath, 'utf8');
  const parsed = rateRulesetSchema.parse(JSON.parse(raw));
  validateNonOverlappingSeasons(parsed);
  return parsed;
}

export async function resolveRateForDate(unit: LodgingUnit, isoDate: string): Promise<ResolvedRate> {
  const ruleset = await getRateRuleset();
  const dayOfYear = isoToDayOfYear(isoDate);
  const season = ruleset.seasons.find((candidate) => seasonCoversDay(candidate, dayOfYear));
  const isBlackoutDate = season?.blackoutDates?.includes(isoDate) ?? false;

  if (season) {
    const unitRate = resolveUnitRate(season, unit);
    if (unitRate) {
      return {
        nightly: unitRate.nightly,
        cleaningFee: unitRate.cleaningFee,
        weeklyDiscount: unitRate.weeklyDiscount,
        seasonName: season.name,
        seasonId: season.seasonId,
        defaultApplied: false,
        isBlackoutDate,
      };
    }
  }

  return {
    nightly: ruleset.defaultRate.nightly,
    cleaningFee: ruleset.defaultRate.cleaningFee,
    seasonName: 'Default rate',
    seasonId: 'default-rate',
    defaultApplied: true,
    isBlackoutDate,
  };
}

export async function getPriceSummary(unit: LodgingUnit): Promise<{ low: number; high: number }> {
  const ruleset = await getRateRuleset();
  const rates = ruleset.seasons
    .flatMap((season) => season.rates.filter((rate) => rate.unitId === unit.id).map((rate) => rate.nightly))
    .concat(ruleset.defaultRate.nightly);

  return {
    low: Math.min(...rates),
    high: Math.max(...rates),
  };
}

export function estimateStayTotal(
  rate: Pick<ResolvedRate, 'nightly' | 'cleaningFee' | 'weeklyDiscount'>,
  nightCount: number,
): number {
  const base = rate.nightly * nightCount;
  const weeklyDiscount = rate.weeklyDiscount && nightCount >= 7 ? base * rate.weeklyDiscount : 0;
  return Math.max(0, base - weeklyDiscount + rate.cleaningFee);
}

export function getNightCount(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end.getTime() - start.getTime()) / 86400000);
}

export async function getPriceQuote(unit: LodgingUnit, checkIn?: string, checkOut?: string): Promise<PriceQuote> {
  const resolvedCheckIn = checkIn ?? new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10);
  const resolvedCheckOut = checkOut ?? new Date(Date.now() + 23 * 86400000).toISOString().slice(0, 10);
  const nights = Math.max(1, getNightCount(resolvedCheckIn, resolvedCheckOut));
  const rate = await resolveRateForDate(unit, resolvedCheckIn);
  const ruleset = await getRateRuleset();
  const season = ruleset.seasons.find((candidate) => candidate.seasonId === rate.seasonId);

  return {
    ...rate,
    checkIn: resolvedCheckIn,
    checkOut: resolvedCheckOut,
    nights,
    totalEstimate: estimateStayTotal(rate, nights),
    blackoutDates: season?.blackoutDates ?? [],
    isBlackout: rate.isBlackoutDate,
  };
}
