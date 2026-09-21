'use client';

import { cn } from '@/lib/utils/cn';
import FormError from './FormError';

export default function Textarea({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  rows = 4,
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

      <textarea
        rows={rows}
        className={cn(
          `
          w-full px-4 py-3
          border rounded-[var(--radius-md)]
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-tertiary)]
          bg-[var(--color-bg-primary)]
          shadow-[var(--shadow-xs)]
          hover:border-[var(--color-border-dark)]
          focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-primary)]/15 focus:border-[var(--color-brand-primary)]
          transition-all duration-200
          resize-y
          disabled:bg-[var(--color-bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/15 focus:border-[var(--color-error)]' : 'border-[var(--color-border)]'}
        `,
          className
        )}
        {...props}
      />

      <FormError error={error} />

      {helperText && !error && (
        <p className="text-sm text-[var(--color-text-tertiary)]">{helperText}</p>
      )}
    </div>
  );
}
