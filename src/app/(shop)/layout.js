import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * Shared storefront layout.
 *
 * Navbar and Footer live here (not inside each page) so they are NOT unmounted
 * and re-mounted on every navigation between storefront routes. Only the page
 * content inside <main> is swapped by Next.js.
 */
export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
