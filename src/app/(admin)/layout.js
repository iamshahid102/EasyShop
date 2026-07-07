'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { FaChartBar, FaBox, FaShoppingCart, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaChartBar },
    { name: 'Products', href: '/admin/products', icon: FaBox },
    { name: 'Orders', href: '/admin/orders', icon: FaShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: FaUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FaChartLine },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
  ];

  // Check if a nav item is active (exact match or nested route)
  const isActive = (href) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Top Navigation Bar - Admin only */}
      <nav className="bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <span className="text-white font-extrabold text-sm">E</span>
                </div>
                <span className="text-lg font-extrabold text-[var(--color-brand-accent)] tracking-tight">
                  EasyShop
                </span>
              </Link>
              <span className="px-2.5 py-1 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] text-[10px] font-bold rounded-md uppercase tracking-wider">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[var(--color-bg-tertiary)] rounded-xl">
                <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-brand-accent)]">
                  {user?.name}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={logout} className="text-xs">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation - Admin only */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-3 sticky top-8">
              <nav className="space-y-0.5">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-[var(--color-brand-primary)] text-white shadow-md shadow-orange-500/20'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-brand-accent)]'
                      }`}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      <span className="font-semibold text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Links at Bottom */}
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-brand-accent)] transition-all"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Store
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
