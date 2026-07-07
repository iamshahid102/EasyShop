'use client';

import { cn } from '@/lib/utils/cn';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(`
        bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]
        ${paddings[padding]}
        ${hover ? 'hover:border-[var(--color-brand-primary)] hover:shadow-lg transition-all duration-300' : ''}
        ${className}
      `)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 pb-4 border-b border-[var(--color-border)] ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-bold text-[var(--color-brand-accent)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-[var(--color-border)] ${className}`}>
      {children}
    </div>
  );
}
