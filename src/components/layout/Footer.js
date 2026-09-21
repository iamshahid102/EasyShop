import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

function LinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-base mb-5 text-white tracking-tight">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-white/55 hover:text-white text-sm transition-colors duration-300"
            >
              <span className="w-0 group-hover:w-3 h-px bg-[var(--color-brand-primary-light)] transition-all duration-300 rounded-full" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    <footer className="relative bg-[var(--color-brand-accent)] text-white mt-auto overflow-hidden">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] bg-[var(--color-brand-primary)]/15 blur-3xl rounded-full" />

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
                Join Our Newsletter
              </h3>
              <p className="text-white/55 text-sm max-w-md">
                Subscribe to get exclusive access to new arrivals, special promotions, and member-only deals.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <div className="flex-1 relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white/15 text-white placeholder:text-white/45 text-sm transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="btn-shine px-7 py-3.5 bg-gradient-brand bg-gradient-brand-hover text-white font-semibold rounded-[var(--radius-md)] transition-all duration-300 text-sm whitespace-nowrap shadow-[var(--shadow-brand-sm)] hover:shadow-[var(--shadow-brand)] hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="EasyShop — Home" className="group inline-flex mb-5">
              <Logo
                invert
                className="h-14 sm:h-16 transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-7">
              Your premium destination for quality products at unbeatable prices.
              Experience shopping redefined with curated collections, exceptional service,
              and a seamless experience from browse to delivery.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-7">
              <div className="flex items-center gap-3 text-sm text-white/55">
                <FaMapMarkerAlt className="w-4 h-4 text-[var(--color-brand-primary-light)] flex-shrink-0" />
                <span>123 Commerce Street, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/55">
                <FaPhone className="w-4 h-4 text-[var(--color-brand-primary-light)] flex-shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/55">
                <FaEnvelope className="w-4 h-4 text-[var(--color-brand-primary-light)] flex-shrink-0" />
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
                  className="w-10 h-10 bg-white/10 border border-white/10 hover:bg-gradient-brand hover:border-transparent rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-brand-sm)]"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Shop" links={footerLinks.shop} />
          <LinkColumn title="Support" links={footerLinks.support} />
          <LinkColumn title="Company" links={footerLinks.company} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/45 text-xs sm:text-sm text-center sm:text-left">
              &copy; {currentYear} EasyShop. All rights reserved. Crafted with care.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/45 hover:text-white text-xs sm:text-sm transition-colors duration-300"
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
