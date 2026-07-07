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
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-semibold text-[var(--color-brand-accent)]"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          className={cn(`
            w-full px-4 py-3 pr-10
            border rounded-xl
            text-[var(--color-text-primary)]
            bg-[var(--color-bg-primary)]
            appearance-none
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 focus:border-[var(--color-brand-primary)]
            transition-all duration-200
            disabled:bg-[var(--color-bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-60
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)]'}
            ${className}
          `)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-[var(--color-text-secondary)]"
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
