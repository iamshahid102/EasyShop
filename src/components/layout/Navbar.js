'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import { FaBars, FaTimes, FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close search on escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsSearchOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Customer navigation links
  const isCustomer = !user || user.role === 'user';
  const showOrdersLink = user?.role === 'user';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    // Only show Orders for logged-in customers
    ...(showOrdersLink ? [{ label: 'Orders', href: '/orders' }] : []),
  ];

  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md'
            : 'bg-white/95 backdrop-blur-xl shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] shadow-lg shadow-orange-500/20">
                <span className="text-white font-extrabold text-lg">E</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--color-brand-accent)]">
                EasyShop
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'text-[var(--color-brand-primary)] bg-[var(--color-bg-tertiary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Admin Link — only shown to admin users */}
              {user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Admin
                    <span className="px-2 py-0.5 bg-[var(--color-brand-primary)] text-white text-[9px] font-bold rounded-md uppercase tracking-wider">
                      Panel
                    </span>
                  </span>
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-300"
                aria-label="Search"
              >
                <FaSearch className="w-4 h-4" />
              </button>

              {/* Cart - Only for customers (never for admins) */}
              {isCustomer && (
                <Link
                  href="/cart"
                  className="relative p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-300"
                >
                  <FaShoppingBag className="w-4 h-4" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-brand-primary)] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth - Desktop */}
              {user ? (
                <div className="hidden md:flex items-center gap-3 ml-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--color-bg-tertiary)]">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold max-w-[100px] truncate text-[var(--color-text-primary)]">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-semibold rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-red-50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <Link href="/login">
                    <Button size="sm" variant="ghost">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" variant="primary">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-400 overflow-hidden border-t border-[var(--color-border)] ${
            isMobileMenuOpen ? 'max-h-[600px] opacity-100 bg-white' : 'max-h-0 opacity-0 bg-white'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-1">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'text-[var(--color-brand-primary)] bg-[var(--color-bg-tertiary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Cart link in mobile menu for customers */}
            {isCustomer && (
              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-all"
              >
                <FaShoppingBag className="w-4 h-4" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="px-2 py-0.5 bg-[var(--color-brand-primary)] text-white text-[10px] font-bold rounded-full">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Orders link in mobile for logged-in customers */}
            {showOrdersLink && (
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-all"
              >
                My Orders
              </Link>
            )}

            {/* Admin link in mobile */}
            {user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-all"
              >
                Admin Dashboard
                <span className="px-2 py-0.5 bg-[var(--color-brand-primary)] text-white text-[9px] font-bold rounded-md uppercase">Panel</span>
              </Link>
            )}

            <div className="border-t border-[var(--color-border)] my-3 pt-3">
              {user ? (
                <div className="px-4 space-y-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{user.name}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 text-sm font-semibold text-[var(--color-error)] hover:bg-red-50 rounded-xl transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" variant="ghost" fullWidth>
                      <FaUser className="w-4 h-4" /> Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[120px] px-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-2xl animate-fadeInUp">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] p-2 flex items-center gap-2">
              <FaSearch className="w-5 h-5 text-[var(--color-text-tertiary)] ml-3 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-4 text-base bg-transparent border-none outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-colors text-[var(--color-text-tertiary)]"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-[72px] lg:h-[80px]" />
    </>
  );
}
