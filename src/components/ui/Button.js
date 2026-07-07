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
    inline-flex items-center justify-center gap-2.5
    font-semibold leading-none
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    active:scale-[0.97]
    select-none
    ${fullWidth ? 'w-full' : ''}
  `);

  const variants = {
    primary: cn(`
      bg-[var(--color-brand-primary)]
      text-white
      hover:bg-[var(--color-brand-primary-dark)]
      focus:ring-[var(--color-brand-primary)]
      shadow-[0_2px_8px_rgba(221,107,32,0.25)]
      hover:shadow-[0_4px_16px_rgba(221,107,32,0.35)]
    `),

    secondary: cn(`
      bg-[var(--color-brand-accent)]
      text-white
      hover:bg-[var(--color-brand-accent-light)]
      focus:ring-[var(--color-brand-accent)]
      shadow-sm hover:shadow-md
    `),

    outline: cn(`
      border-2 border-[var(--color-brand-primary)]
      text-[var(--color-brand-primary)]
      hover:bg-[var(--color-brand-primary)]
      hover:text-white
      focus:ring-[var(--color-brand-primary)]
    `),

    ghost: cn(`
      text-[var(--color-text-secondary)]
      hover:bg-[var(--color-bg-tertiary)]
      hover:text-[var(--color-text-primary)]
      focus:ring-[var(--color-brand-primary)]
    `),

    danger: cn(`
      bg-[var(--color-error)]
      text-white
      hover:bg-[#b91c1c]
      focus:ring-[var(--color-error)]
      shadow-sm hover:shadow-md
    `),
  };

  const sizes = {
    xs: 'px-3.5 py-2 text-xs rounded-[var(--radius-sm)]',
    sm: 'px-5 py-2.5 text-sm rounded-[var(--radius-md)]',
    md: 'px-7 py-3 text-base rounded-[var(--radius-md)]',
    lg: 'px-8 py-3.5 text-lg rounded-[var(--radius-lg)]',
    xl: 'px-10 py-4 text-xl rounded-[var(--radius-lg)]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
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
