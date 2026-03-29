'use client';

import type { WorkshopProgram } from '@/lib/workshop/content-types';

type Category = 'all' | 'craft' | 'photography';

export function CategoryFilter({ value, onChange }: { value: Category; onChange: (next: Category) => void }) {
  const options: Category[] = ['all', 'craft', 'photography'];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={value === option ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse' : 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong'}
        >
          {option === 'all' ? 'All workshops' : option === 'craft' ? 'Craft' : 'Photography'}
        </button>
      ))}
    </div>
  );
}
