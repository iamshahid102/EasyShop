import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
      { label: 'Sale', href: '/products?sale=true' },
    ],
    support: [
      { label: 'Track Order', href: '/orders' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Our Blog', href: '/blog' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-[var(--color-brand-accent)] text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Join Our Newsletter</h3>
              <p className="text-[var(--color-text-inverse)]/60 text-sm max-w-md">Subscribe to get exclusive access to new arrivals, special promotions, and member-only deals.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <div className="flex-1 relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-inverse)]/60" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] text-white placeholder:text-[var(--color-text-inverse)]/60 text-sm transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-white font-semibold rounded-xl transition-all text-sm whitespace-nowrap shadow-lg shadow-orange-500/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-extrabold text-xl">E</span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold">EasyShop</span>
            </div>
            <p className="text-[var(--color-text-inverse)]/60 text-sm leading-relaxed max-w-sm mb-6">
              Your premium destination for quality products at unbeatable prices.
              Experience shopping redefined with curated collections, exceptional service,
              and a seamless experience from browse to delivery.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-inverse)]/60">
                <FaMapMarkerAlt className="w-4 h-4 text-[var(--color-brand-primary)] flex-shrink-0" />
                <span>123 Commerce Street, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-inverse)]/60">
                <FaPhone className="w-4 h-4 text-[var(--color-brand-primary)] flex-shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-inverse)]/60">
                <FaEnvelope className="w-4 h-4 text-[var(--color-brand-primary)] flex-shrink-0" />
                <span>support@easyshop.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-bold text-base mb-5 text-white">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-inverse)]/60 hover:text-[var(--color-brand-primary)] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-5 text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-inverse)]/60 hover:text-[var(--color-brand-primary)] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-5 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-inverse)]/60 hover:text-[var(--color-brand-primary)] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[var(--color-text-inverse)]/50 text-xs sm:text-sm text-center sm:text-left">
              &copy; {currentYear} EasyShop. All rights reserved. Crafted with care.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--color-text-inverse)]/50 hover:text-[var(--color-brand-primary)] text-xs sm:text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
