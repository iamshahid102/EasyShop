'use client';

import { cn } from '@/lib/utils/cn';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}) {
  const baseStyles = cn(`
    group/btn inline-flex items-center justify-center gap-2.5
    font-semibold leading-none tracking-tight
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
    active:scale-[0.97]
    select-none
    ${fullWidth ? 'w-full' : ''}
  `);

  const variants = {
    primary: cn(`
      btn-shine
      bg-gradient-brand bg-gradient-brand-hover
      text-white
      focus-visible:ring-[var(--color-brand-primary)]
      shadow-[var(--shadow-brand-sm)]
      hover:shadow-[var(--shadow-brand)]
      hover:-translate-y-0.5
    `),

    secondary: cn(`
      bg-[var(--color-brand-accent)]
      text-white
      hover:bg-[var(--color-brand-accent-light)]
      focus-visible:ring-[var(--color-brand-accent)]
      shadow-sm hover:shadow-lg
      hover:-translate-y-0.5
    `),

    outline: cn(`
      border-2 border-[var(--color-brand-300)]
      text-[var(--color-brand-700)]
      hover:border-[var(--color-brand-primary)]
      hover:bg-[var(--color-brand-50)]
      focus-visible:ring-[var(--color-brand-primary)]
      hover:-translate-y-0.5
    `),

    ghost: cn(`
      text-[var(--color-text-secondary)]
      hover:bg-[var(--color-bg-tertiary)]
      hover:text-[var(--color-text-primary)]
      focus-visible:ring-[var(--color-brand-primary)]
    `),

    danger: cn(`
      bg-[var(--color-error)]
      text-white
      hover:brightness-95
      focus-visible:ring-[var(--color-error)]
      shadow-sm hover:shadow-lg
      hover:-translate-y-0.5
    `),

    /* Solid white — for buttons sitting on dark / gradient surfaces.
       Replaces ad-hoc `!bg-white !hover:bg-...` overrides, whose `!hover:`
       syntax Tailwind never generated, so the hover state was dead. */
    light: cn(`
      bg-white text-[var(--color-brand-accent)]
      shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]
      hover:bg-[var(--color-brand-50)]
      hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)]
      hover:-translate-y-0.5
      focus-visible:ring-white
    `),

    /* Transparent w/ white hairline — secondary action on dark surfaces */
    onDark: cn(`
      border-2 border-white/25 text-white
      bg-white/5 backdrop-blur-sm
      hover:bg-white/12 hover:border-white/55
      focus-visible:ring-white
      hover:-translate-y-0.5
    `),
  };

  const sizes = {
    xs: 'px-3.5 py-2 text-xs rounded-[var(--radius-sm)]',
    sm: 'px-5 py-2.5 text-sm rounded-[var(--radius-md)]',
    md: 'px-6 py-3 text-sm rounded-[var(--radius-md)]',
    lg: 'px-7 py-3.5 text-base rounded-[var(--radius-lg)]',
    xl: 'px-9 py-4 text-base sm:text-lg rounded-[var(--radius-xl)]',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
