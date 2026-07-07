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

      <textarea
        rows={rows}
        className={cn(`
          w-full px-4 py-3
          border rounded-xl
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-tertiary)]
          bg-[var(--color-bg-primary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 focus:border-[var(--color-brand-primary)]
          transition-all duration-200
          resize-y
          disabled:bg-[var(--color-bg-tertiary)] disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)]'}
          ${className}
        `)}
        {...props}
      />

      <FormError error={error} />

      {helperText && !error && (
        <p className="text-sm text-[var(--color-base-text)]">{helperText}</p>
      )}
    </div>
  );
}
