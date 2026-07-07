'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { FaCheck, FaDollarSign, FaShippingFast, FaShieldAlt, FaArrowRight, FaStar, FaTruck, FaBox } from 'react-icons/fa';

export default function Home() {
  useEffect(() => {
    // Simple intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <FaCheck className="w-6 h-6" />,
      title: 'Premium Quality',
      description: 'Curated selection of top-quality products from trusted brands worldwide.',
    },
    {
      icon: <FaDollarSign className="w-6 h-6" />,
      title: 'Best Prices',
      description: 'Competitive pricing with regular deals and exclusive member discounts.',
    },
    {
      icon: <FaShippingFast className="w-6 h-6" />,
      title: 'Fast Delivery',
      description: 'Lightning-fast shipping to your doorstep. Track your order in real-time.',
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Secure Shopping',
      description: 'Your data is protected with industry-leading security standards.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products' },
    { value: '99.9%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* ===== Hero Section — Premium Rosaline-Inspired ===== */}
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[var(--color-brand-accent)] via-[#2a2a2a] to-[var(--color-brand-primary-dark)] text-white overflow-hidden">
          {/* Decorative Gradient Orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--color-brand-primary)]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white/30 rounded-full" />
          <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-orange-400/40 rounded-full" />
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full" />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left z-10" data-animate="slide-left">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-7 border border-white/20 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-sm font-medium tracking-wide">New Arrivals Every Week</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-[1.05] tracking-tight text-white/80">
                  Discover Your
                  <span className="block mt-2 bg-gradient-to-r from-[var(--color-brand-primary-light)] via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                    Perfect Style
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-white/80 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Shop the latest trends with unbeatable prices. Quality products, fast shipping,
                  and exceptional service guaranteed for every purchase.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Link href="/products">
                    <Button size="xl" className="!bg-white !text-[var(--color-brand-accent)] !hover:bg-gray-100 shadow-2xl !hover:shadow-white/25 hover:scale-[1.03] transition-all duration-300 font-bold text-base px-10 py-4 rounded-xl group">
                      <span>Shop Now</span>
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="xl" variant="outline" className="!border-2 !border-white/40 !text-white !hover:bg-white/10 !hover:border-white/60 shadow-lg !hover:scale-[1.03] transition-all duration-300 font-medium text-base px-10 py-4 rounded-xl">
                      Learn More
                    </Button>
                  </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/15">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center sm:text-left">
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Visual - Premium Hero Image */}
              <div className="relative z-10" data-animate="slide-right">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                    alt="Premium Shopping Collection"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Floating Offer Card */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md text-gray-900 px-5 py-4 rounded-xl shadow-2xl animate-float">
                    <div className="text-2xl font-extrabold text-[var(--color-brand-primary)]">50% OFF</div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">First Order</div>
                  </div>

                  {/* Bottom Feature Card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FaStar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">Premium Products</div>
                          <div className="text-xs text-gray-500">Free Shipping Available</div>
                        </div>
                        <div className="flex -space-x-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Features Section ===== */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-bg-primary)]" data-animate="fade">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brand-accent)] mb-4">
                Premium Shopping Experience
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                We're committed to providing you with the best shopping experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 lg:p-8 hover:border-[var(--color-brand-primary)]/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-orange-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-brand-accent)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Categories Section ===== */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-bg-secondary)]" data-animate="fade">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-block px-4 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-brand-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Collections
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brand-accent)] mb-4">
                Shop by Category
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Explore our wide range of premium products
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[
                { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop', count: '120+ Products' },
                { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop', count: '200+ Products' },
                { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop', count: '80+ Products' },
                { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop', count: '150+ Products' }
              ].map((category, index) => (
                <Link
                  key={index}
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-2xl bg-[var(--color-bg-tertiary)]"
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-7">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1.5 group-hover:-translate-y-1 transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 mb-3">{category.count}</p>
                    <span className="inline-flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium group-hover:gap-3 transition-all duration-300">
                      Explore Now
                      <FaArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Services Banner ===== */}
        <section className="py-12 sm:py-16 bg-[var(--color-bg-primary)] border-y border-[var(--color-border)]" data-animate="fade">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {[
                { icon: FaTruck, title: 'Free Shipping', desc: 'On orders over Rs. 1,500' },
                { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure transactions' },
                { icon: FaBox, title: 'Easy Returns', desc: '30-day return policy' },
                { icon: FaStar, title: 'Premium Support', desc: '24/7 customer service' },
              ].map((service, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-bg-tertiary)] rounded-2xl flex items-center justify-center text-[var(--color-brand-primary)] group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all duration-500 shadow-sm">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-brand-accent)] mb-1.5">{service.title}</h4>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] text-white overflow-hidden" data-animate="fade">
          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight">
              Ready to Start Shopping?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-8 lg:mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of satisfied customers. Get exclusive access to new arrivals,
              special promotions, and member-only deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="xl" variant="secondary" className="bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-light)] shadow-2xl hover:scale-[1.03] transition-all duration-300 font-bold text-base px-10 py-4 rounded-xl group">
                  <span>Browse All Products</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="xl" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 shadow-lg hover:scale-[1.03] transition-all duration-300 font-medium text-base px-10 py-4 rounded-xl">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
