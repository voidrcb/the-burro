'use client';

import type { IntakeSchemaDefinition } from '@/lib/workshop/content-types';

export function IntakeForm({
  schema,
  value,
  disabled,
  onChange,
}: {
  schema: IntakeSchemaDefinition;
  value: Record<string, string | number | boolean>;
  disabled?: boolean;
  onChange: (next: Record<string, string | number | boolean>) => void;
}) {
  return (
    <div className="space-y-4">
      {schema.questions.map((question) => (
        <label key={question.questionId} className="block text-sm font-semibold text-text-strong">
          {question.label}
          {question.type === 'long_text' ? (
            <textarea
              disabled={disabled}
              value={String(value[question.questionId] ?? '')}
              onChange={(event) => onChange({ ...value, [question.questionId]: event.target.value })}
              rows={4}
              className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
            />
          ) : question.type === 'single_select' ? (
            <select
              disabled={disabled}
              value={String(value[question.questionId] ?? '')}
              onChange={(event) => onChange({ ...value, [question.questionId]: event.target.value })}
              className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
            >
              <option value="">Select one</option>
              {(question.options ?? []).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : question.type === 'boolean' ? (
            <div className="mt-2 flex gap-3">
              {[true, false].map((option) => (
                <button
                  key={String(option)}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...value, [question.questionId]: option })}
                  className={value[question.questionId] === option ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse' : 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong'}
                >
                  {option ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          ) : (
            <input
              type={question.type === 'number' ? 'number' : 'text'}
              disabled={disabled}
              value={String(value[question.questionId] ?? '')}
              onChange={(event) => onChange({ ...value, [question.questionId]: question.type === 'number' ? Number(event.target.value) || 0 : event.target.value })}
              className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
            />
          )}
        </label>
      ))}
    </div>
  );
}
