'use client';

import { useMemo, useState } from 'react';

import { CategoryFilter } from './CategoryFilter';
import { WorkshopCard } from './WorkshopCard';
import type { WorkshopProgram } from '@/lib/workshop/content-types';

export function WorkshopCatalog({ workshops }: { workshops: WorkshopProgram[] }) {
  const [category, setCategory] = useState<'all' | 'craft' | 'photography'>('all');
  const filtered = useMemo(() => (category === 'all' ? workshops : workshops.filter((workshop) => workshop.category === category)), [category, workshops]);

  return (
    <div className="space-y-6">
      <CategoryFilter value={category} onChange={setCategory} />
      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((workshop) => (
          <WorkshopCard key={workshop.slug} workshop={workshop} />
        ))}
      </div>
    </div>
  );
}
