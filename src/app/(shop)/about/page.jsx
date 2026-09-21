'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <>
        {/* Hero Section */}
        <section className="relative bg-gradient-dark text-white overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[var(--color-brand-primary)] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight text-white">About EasyShop</h1>
            <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
              Your trusted online marketplace for quality products at unbeatable prices.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-10 sm:py-14 bg-[var(--color-bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-accent)] mb-4">Transforming Online Shopping</h2>
                <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mb-4">
                  At EasyShop, we&apos;re on a mission to make online shopping accessible, affordable, and enjoyable for everyone.
                </p>
                <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
                  Since our founding, we&apos;ve been committed to curating the best products from trusted brands.
                </p>
              </div>
              <div className="relative bg-[var(--color-bg-secondary)] rounded-2xl aspect-video flex items-center justify-center border border-[var(--color-border)] overflow-hidden">
                {/* <FaShoppingBag className="w-20 h-20 text-[var(--color-text-tertiary)]" /> */}
                <Image
                  src="https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg"
                  alt="Apparel"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-10 sm:py-14 bg-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-accent)]">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((val, i) => {
                const Icon = val.icon;
                return (
                  <div key={i} className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-[var(--color-brand-50)] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-brand transition-all duration-300">
                      <Icon className="w-6 h-6 text-[var(--color-brand-primary)] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-brand-accent)] mb-2">{val.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 sm:py-14 bg-[var(--color-bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-accent)]">Our Impact</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-brand-accent)] mb-1.5">{stat.value}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-10 sm:py-14 bg-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-accent)] mb-3">Behind EasyShop</h2>
              <p className="text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto">A dedicated team passionate about delivering the best online shopping experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-brand rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[var(--shadow-brand-sm)]">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-brand-accent)] mb-1">{member.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-12 sm:py-16 bg-gradient-brand text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Shop?</h2>
            <p className="text-base sm:text-lg text-white/85 mb-6 max-w-2xl mx-auto">Explore thousands of premium products.</p>
            <Link href="/products" className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-light)] text-white font-bold rounded-xl transition-all hover:scale-[1.03] shadow-2xl">
              <span>Start Shopping</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>    </>
  );
}
