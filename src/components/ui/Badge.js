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
    primary: 'bg-[var(--color-brand-primary)] text-white',
    secondary: 'bg-[var(--color-brand-accent)] text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    outline: 'bg-transparent border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
        className={cn(`
        inline-flex items-center justify-center gap-1.5
        font-semibold rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `)}
      {...props}
    >
      {children}
    </span>
  );
}
