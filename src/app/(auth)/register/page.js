'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt, FaBolt, FaStar } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/products');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'role') {
      setFormData({
        ...formData,
        role: checked ? 'admin' : 'user',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await register(formData.name, formData.email, formData.password, formData.role);

    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/products');
      }
    } else {
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  const benefits = [
    { icon: FaBolt, text: 'Free Signup' },
    { icon: FaShieldAlt, text: 'No Credit Card' },
    { icon: FaCheckCircle, text: 'Cancel Anytime' },
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
              Create Account
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-sm mx-auto">
              Join thousands of happy customers and start shopping today
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 animate-fadeIn">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-fadeIn" role="alert">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-red-800 text-sm">Registration Failed</p>
                      <p className="text-xs text-red-700 mt-1">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 sm:space-y-5">
                {/* Name Input */}
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  leftIcon={<FaUser className="w-4 h-4" />}
                />

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
                  helperText="Must be at least 6 characters"
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

                {/* Confirm Password Input */}
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  leftIcon={<FaLock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors duration-200"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  }
                />

                {/* Role Selection - DEVELOPMENT ONLY */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">DEV MODE ONLY</p>
                      <p className="text-[11px] text-yellow-700 mt-0.5">Admin role for testing. Remove in production!</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-brand-primary)] transition-all duration-200 group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="role"
                        checked={formData.role === 'admin'}
                        onChange={handleChange}
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
                    <div className="flex-1">
                      <span className="font-semibold text-sm text-[var(--color-brand-accent)]">Register as Admin</span>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">Access product & order management</p>
                    </div>
                    {formData.role === 'admin' && (
                      <Badge variant="primary" size="sm">ADMIN</Badge>
                    )}
                  </label>
                </div>
              </div>

              {/* Role Indicator */}
              <div className="text-center">
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Creating account as:{' '}
                  <span className="font-bold text-[var(--color-brand-accent)]">
                    {formData.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )}
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-xs sm:text-sm text-[var(--color-text-tertiary)] bg-white">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <Link href="/login">
                <Button type="button" variant="outline" size="lg" className="w-full text-base">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In Instead
                </Button>
              </Link>
            </form>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-[var(--color-text-tertiary)] mt-6 sm:mt-8 px-4 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] font-semibold transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] font-semibold transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Premium Branding Panel */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-[var(--color-brand-primary)] via-orange-700 to-[var(--color-brand-accent)] overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-1/3 w-2.5 h-2.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center items-center text-white p-8 sm:p-12 lg:p-16 text-center w-full">
          {/* Join Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 sm:mb-8 border border-white/20 shadow-2xl animate-float">
            <FaUser className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
            Join Our Community
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-8 sm:mb-10 max-w-md leading-relaxed">
            Create an account today and unlock exclusive benefits, personalized recommendations, and special offers.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-sm w-full">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '10K+', label: 'Products' },
              { value: '99.9%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-extrabold mb-0.5">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Benefits Row */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                <benefit.icon className="w-4 h-4 text-green-400" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
