'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaBolt, FaCheckCircle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectTo = searchParams?.get('redirect') || '/products';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/products');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.user.role === 'admin') {
        router.push(redirectTo.startsWith('/admin') ? redirectTo : '/admin/dashboard');
      } else {
        router.push(redirectTo === '/login' ? '/products' : redirectTo);
      }
    } else {
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  const features = [
    { icon: FaBolt, text: 'Fast Checkout' },
    { icon: FaShieldAlt, text: 'Secure Shopping' },
    { icon: FaCheckCircle, text: 'Order Tracking' },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-secondary)]">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Logo & Header */}
          <div className="text-center mb-8 sm:mb-10">
            <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-xl group-hover:shadow-orange-500/30 group-hover:scale-105 transition-all duration-300">
                <span className="text-white font-extrabold text-2xl">E</span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-brand-accent)]">
                EasyShop
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-brand-accent)] mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-sm mx-auto">
              Sign in to your account to continue your shopping journey
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 animate-fadeIn">
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-fadeIn" role="alert">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-red-800 text-sm">Login Failed</p>
                      <p className="text-xs text-red-700 mt-1">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                leftIcon={<FaEnvelope className="w-4 h-4" />}
              />

              {/* Password Input */}
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                leftIcon={<FaLock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[var(--color-border)] rounded-md peer-checked:border-[var(--color-brand-primary)] peer-checked:bg-[var(--color-brand-primary)] transition-all duration-200 group-hover:border-[var(--color-brand-primary)]/50" />
                    <svg
                      className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)] select-none">Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-base"
                loading={loading}
              >
                {!loading && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs sm:text-sm text-[var(--color-text-tertiary)] bg-white">
                    New to EasyShop?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Link href="/register">
                <Button type="button" variant="outline" size="lg" className="w-full text-base">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create New Account
                </Button>
              </Link>
            </form>
          </div>

          {/* Trust Elements */}
          <div className="text-center mt-8 sm:mt-10 animate-fadeIn">
            <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-3 sm:mb-4">Trusted by 50,000+ customers</p>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--color-text-tertiary)]">
                  <feature.icon className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Premium Branding Panel */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-[var(--color-brand-accent)] via-[#2a2a2a] to-[var(--color-brand-primary-dark)] overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-br from-[var(--color-brand-primary)]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-1/3 w-2.5 h-2.5 bg-orange-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-orange-300/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center items-center text-white p-8 sm:p-12 lg:p-16 text-center w-full">
          {/* Floating Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 border border-white/10 shadow-2xl max-w-sm w-full animate-float">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Welcome Back!</h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Sign in to access your personalized shopping experience, track orders, and discover exclusive deals.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '10K+', label: 'Products' },
              { number: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-extrabold text-white mb-1">{stat.number}</div>
                <div className="text-[11px] sm:text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <FaCheckCircle className="w-4 h-4 text-green-400" />
              <span>Free Shipping Over Rs. 1,500</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <FaShieldAlt className="w-4 h-4 text-orange-400" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
