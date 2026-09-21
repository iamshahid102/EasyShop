'use client';

import { cn } from '@/lib/utils/cn';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
    primary: 'bg-gradient-brand text-white shadow-[var(--shadow-brand-sm)]',
    soft: 'bg-[var(--color-brand-50)] text-[var(--color-brand-800)] border border-[var(--color-brand-200)]',
    secondary: 'bg-[var(--color-brand-accent)] text-white',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/25',
    warning: 'bg-[var(--color-warning)]/12 text-[var(--color-warning)] border border-[var(--color-warning)]/25',
    danger: 'bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/25',
    info: 'bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/25',
    outline: 'bg-transparent border-2 border-[var(--color-brand-300)] text-[var(--color-brand-700)]',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-semibold rounded-full tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
