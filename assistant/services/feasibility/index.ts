import { readFile } from 'fs/promises';

import { getRepoPath } from '../repo-root';
import type { FeasibilityCard } from '../types';

type PilotUnit = {
  unit_type: string;
  shell_cost_range: { low_usd: number; high_usd: number };
  site_prep_estimate: { low_usd: number; high_usd: number };
  utility_hookup_estimate: { low_usd: number; high_usd: number };
  target_adr: number;
  occupancy_assumption: number;
  annual_revenue_estimate: number;
};

type PilotModel = {
  units: PilotUnit[];
};

export type FeasibilitySnapshot = {
  cards: FeasibilityCard[];
};

function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

async function loadPilotModel(): Promise<PilotModel> {
  const raw = await readFile(getRepoPath('data', 'models', 'pilot_unit_model.json'), 'utf8');
  return JSON.parse(raw) as PilotModel;
}

export async function getFeasibilitySnapshot(): Promise<FeasibilitySnapshot> {
  const model = await loadPilotModel();
  const lowestCapex = model.units.reduce((current, candidate) => {
    const currentTotal = current.shell_cost_range.low_usd + current.site_prep_estimate.low_usd + current.utility_hookup_estimate.low_usd;
    const candidateTotal = candidate.shell_cost_range.low_usd + candidate.site_prep_estimate.low_usd + candidate.utility_hookup_estimate.low_usd;
    return candidateTotal < currentTotal ? candidate : current;
  });

  const highestRevenue = model.units.reduce((current, candidate) =>
    candidate.annual_revenue_estimate > current.annual_revenue_estimate ? candidate : current,
  );

  const workshopBreakEvenSeats = Math.ceil(1800 / 225);
  const equipmentPaybackMonths = Math.ceil(45000 / (320 * 10));

  return {
    cards: [
      {
        id: 'pilot-lowest-capex',
        title: 'Lowest-capex pilot path',
        value: lowestCapex.unit_type,
        note: `${formatUsd(lowestCapex.shell_cost_range.low_usd + lowestCapex.site_prep_estimate.low_usd + lowestCapex.utility_hookup_estimate.low_usd)} baseline before contingency.`,
      },
      {
        id: 'pilot-best-revenue',
        title: 'Strongest modeled annual revenue',
        value: formatUsd(highestRevenue.annual_revenue_estimate),
        note: `${highestRevenue.unit_type} at ${Math.round(highestRevenue.occupancy_assumption * 100)}% occupancy and ADR ${formatUsd(highestRevenue.target_adr)}.`,
      },
      {
        id: 'workshop-break-even',
        title: 'Workshop break-even example',
        value: `${workshopBreakEvenSeats} seats`,
        note: 'Assumes $225 average ticket and $1,800 fixed workshop cost.',
      },
      {
        id: 'equipment-payback',
        title: 'Equipment payback example',
        value: `${equipmentPaybackMonths} months`,
        note: 'Assumes $45k purchase, $320 day rate, and 10 paid days per month.',
      }
    ],
  };
}
