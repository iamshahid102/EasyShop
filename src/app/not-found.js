import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-6">
            Error 404
          </span>
          <h1 className="text-8xl sm:text-9xl font-extrabold text-[var(--color-brand-primary)] mb-4 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-accent)] mb-3">
            Page Not Found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
          <div className="mb-8">
            <svg className="w-48 h-48 mx-auto text-[var(--color-border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.97]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] font-semibold rounded-xl hover:bg-[var(--color-brand-primary)] hover:text-white transition-all duration-300 active:scale-[0.97]"
          >
            Browse Products
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Products', 'Cart', 'Orders', 'Login'].map((page) => (
              <Link
                key={page}
                href={`/${page.toLowerCase()}`}
                className="text-sm text-[var(--color-brand-primary)] hover:underline font-medium"
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
