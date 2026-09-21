'use client';

import { cn } from '@/lib/utils/cn';
import FormError from './FormError';

export default function Select({
  label,
  error,
  options = [],
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-semibold text-[var(--color-text-primary)]"
        >
          {label}
          {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          className={cn(
            `
            w-full px-4 py-3 pr-11
            border rounded-[var(--radius-md)]
            text-[var(--color-text-primary)]
            bg-[var(--color-bg-primary)]
            appearance-none
            shadow-[var(--shadow-xs)]
            hover:border-[var(--color-border-dark)]
            focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-primary)]/15 focus:border-[var(--color-brand-primary)]
            transition-all duration-200
            disabled:bg-[var(--color-bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-60
            ${error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/15 focus:border-[var(--color-error)]' : 'border-[var(--color-border)]'}
          `,
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-tertiary)]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <FormError error={error} />
    </div>
  );
}
