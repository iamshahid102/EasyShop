'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FaShoppingBag, FaBullseye, FaHeart, FaSeedling } from 'react-icons/fa';

export default function AboutPage() {
  const features = [
    { icon: FaBullseye, title: 'Quality First', desc: 'We carefully select every product to ensure it meets our high standards for quality and durability.' },
    { icon: FaHeart, title: 'Customer Focused', desc: 'Your satisfaction is our priority. We are here to help with any questions or concerns you may have.' },
    { icon: FaSeedling, title: 'Sustainability', desc: 'We are committed to sustainable practices and partnering with eco-conscious brands whenever possible.' },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '5K+', label: 'Products' },
    { value: '50+', label: 'Brands' },
    { value: '4.8', label: 'Avg Rating' },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder' },
    { name: 'Mike Chen', role: 'Head of Operations' },
    { name: 'Emily Davis', role: 'Customer Lead' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[var(--color-brand-accent)] via-[#2a2a2a] to-[var(--color-brand-primary-dark)] text-white overflow-hidden py-20 sm:py-24">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-orange-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider mb-6 border border-white/20">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white/80">About EasyShop</h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Your trusted online marketplace for quality products at unbeatable prices.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-4">Our Mission</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-accent)] mb-6">Transforming Online Shopping</h2>
                <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed mb-4">
                  At EasyShop, we&apos;re on a mission to make online shopping accessible, affordable, and enjoyable for everyone.
                </p>
                <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed">
                  Since our founding, we&apos;ve been committed to curating the best products from trusted brands.
                </p>
              </div>
              <div className="bg-[var(--color-bg-secondary)] rounded-2xl aspect-video flex items-center justify-center border border-[var(--color-border)]">
                {/* <FaShoppingBag className="w-20 h-20 text-[var(--color-text-tertiary)]" /> */}
                <img src="https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg" alt="Apparel" className="object-cover w-full h-full rounded-2xl aspect-video" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-4">What We Stand For</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-accent)]">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((val, i) => {
                const Icon = val.icon;
                return (
                  <div key={i} className="bg-[var(--color-bg-card)] p-8 rounded-2xl border border-[var(--color-border)] hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-[var(--color-brand-primary)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-brand-accent)] mb-3">{val.title}</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 bg-[var(--color-bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-4">By The Numbers</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-accent)]">Our Impact</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[var(--color-brand-accent)] mb-2">{stat.value}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 sm:py-20 bg-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-4">Our Team</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-accent)] mb-4">Behind EasyShop</h2>
              <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">A dedicated team passionate about delivering the best online shopping experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="bg-[var(--color-bg-card)] p-8 rounded-2xl border border-[var(--color-border)] text-center hover:shadow-lg transition-all group">
                  <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-brand-accent)] mb-1">{member.name}</h3>
                  <p className="text-[var(--color-text-secondary)]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Shop?</h2>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">Explore thousands of premium products.</p>
            <Link href="/products" className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-light)] text-white font-bold rounded-xl transition-all hover:scale-[1.03] shadow-2xl">
              <span>Start Shopping</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
