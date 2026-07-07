'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils/helpers';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login');
      return;
    }

    if (user && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [user, cart, router, authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country) newErrors.country = 'Country is required';

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

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await clearCart();
        router.push(`/orders/${data.data._id}`);
      } else {
        setErrors({ general: data.message });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !cart || !user) {
    return <LoadingPage />;
  }

  const shippingThreshold = 1500;
  const freeShipping = cart.subtotal >= shippingThreshold;
  const shippingPrice = freeShipping ? 0 : 150;
  const totalPrice = cart.total + shippingPrice;

  const countries = [
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
  ];

  const paymentMethods = [
    {
      value: 'cod',
      label: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      value: 'card',
      label: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      value: 'easypaisa',
      label: 'EasyPaisa',
      description: 'Mobile wallet payment',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: 'jazzcash',
      label: 'JazzCash',
      description: 'Mobile wallet payment',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* Progress Steps */}
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-green-700">Cart</span>
              </div>
              <div className="w-12 h-0.5 bg-[var(--color-brand-primary)]" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="text-sm font-semibold text-[var(--color-brand-primary)]">Checkout</span>
              </div>
              <div className="w-12 h-0.5 bg-[var(--color-border)]" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-text-secondary)] font-bold">
                  3
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-brand-accent)] mb-6">
            Complete Your Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-red-800">Order Failed</p>
                        <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address Section */}
                <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                        Shipping Address
                      </h2>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      id="street"
                      name="street"
                      label="Street Address"
                      placeholder="123 Main Street, Apt 4B"
                      value={formData.street}
                      onChange={handleChange}
                      error={errors.street}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="city"
                        name="city"
                        label="City"
                        placeholder="Karachi"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                        required
                      />

                      <Input
                        id="state"
                        name="state"
                        label="State / Province"
                        placeholder="Sindh"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="zipCode"
                        name="zipCode"
                        label="ZIP / Postal Code"
                        placeholder="75500"
                        value={formData.zipCode}
                        onChange={handleChange}
                        error={errors.zipCode}
                        required
                      />

                      <Select
                        id="country"
                        name="country"
                        label="Country"
                        value={formData.country}
                        onChange={handleChange}
                        error={errors.country}
                        options={countries}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                        Payment Method
                      </h2>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Choose your preferred payment option
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.paymentMethod === method.value
                          ? 'border-[var(--color-brand-primary)] bg-orange-50/50'
                          : 'border-[var(--color-border)] hover:border-[var(--color-brand-primary)]/50 hover:bg-[var(--color-bg-secondary)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleChange}
                          className="w-5 h-5 mt-0.5 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="text-[var(--color-brand-primary)]">{method.icon}</div>
                            <span className="font-semibold text-[var(--color-brand-accent)]">
                              {method.label}
                            </span>
                            {formData.paymentMethod === method.value && (
                              <Badge variant="primary" size="sm">Selected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {method.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <Button type="submit" size="xl" className="w-full rounded-xl" loading={loading}>
                  Place Order - {formatPrice(totalPrice)}
                </Button>

                <p className="text-center text-sm text-[var(--color-text-secondary)]">
                  By placing your order, you agree to our{' '}
                  <a href="/terms" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
                    Terms & Conditions
                  </a>
                </p>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-6 lg:p-8 sticky top-24">
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)] mb-6">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pb-6 border-b border-[var(--color-border)]">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-[var(--color-bg-secondary)] rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0]?.url ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-[var(--color-border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">                          <p className="font-medium text-sm text-[var(--color-brand-accent)] line-clamp-2">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                        <p className="text-sm font-bold text-[var(--color-brand-primary)] mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(cart.tax)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Shipping</span>
                    {freeShipping ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">{formatPrice(shippingPrice)}</span>
                    )}
                  </div>
                  <div className="border-t-2 border-[var(--color-border)] pt-3 flex justify-between">
                    <span className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">Total</span>
                    <span className="text-xl font-bold text-[var(--color-brand-primary)]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free & easy returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
