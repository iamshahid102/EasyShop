'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatPrice } from '@/lib/utils/helpers';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading, updateCartItem, removeFromCart } = useCart();
  const confirmDialog = useConfirmDialog();
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || cartLoading) {
    return <LoadingPage />;
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItems({ ...updatingItems, [itemId]: true });
    await updateCartItem(itemId, newQuantity);
    setUpdatingItems({ ...updatingItems, [itemId]: false });
  };

  const handleRemove = async (itemId) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      setUpdatingItems({ ...updatingItems, [itemId]: true });
      await removeFromCart(itemId);
      setUpdatingItems({ ...updatingItems, [itemId]: false });
    }
  };

  const shippingThreshold = 1500;
  const freeShipping = cart?.subtotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 150;
  const remainingForFreeShipping = shippingThreshold - (cart?.subtotal || 0);

  // Empty Cart State
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 ">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-5 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14 text-[var(--color-text-tertiary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-brand-accent)] mb-3 sm:mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6 sm:mb-7 text-base sm:text-lg">
              Looks like you haven't added anything to your cart yet. Start shopping now!
            </p>
            <Link href="/products">
              <Button size="lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-brand-accent)] via-[#2a2a2a] to-[var(--color-brand-primary-dark)] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <h1 className="text-4xl sm:text-2xl lg:text-3xl text-white/70 font-extrabold mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-white/70">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Free Shipping Progress Bar */}
          {!freeShipping && remainingForFreeShipping > 0 && (
            <div className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs sm:text-sm font-semibold text-green-800">
                  Add {formatPrice(remainingForFreeShipping)} more to get FREE shipping!
                </p>
              </div>
              <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${(cart.subtotal / shippingThreshold) * 100}%` }}
                />
              </div>
            </div>
          )}

          {freeShipping && (
            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-xs sm:text-sm font-semibold text-green-800 flex items-center gap-2">
                Congratulations! You've unlocked FREE shipping!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md border border-[var(--color-border)] p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-3 sm:gap-4 lg:gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product?._id}`}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-[var(--color-bg-secondary)] rounded-lg flex-shrink-0 overflow-hidden group"
                    >
                      {item.product?.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[var(--color-border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product?._id}`}>
                        <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[var(--color-brand-accent)] mb-1 sm:mb-2 hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2">
                          {item.product?.name}
                        </h3>
                      </Link>

                      {item.product?.brand && (
                        <Badge variant="default" size="sm" className="mb-2 sm:mb-3 text-xs">
                          {item.product.brand}
                        </Badge>
                      )}

                      <p className="text-base sm:text-lg font-bold text-[var(--color-brand-primary)] mb-2 sm:mb-3 lg:mb-4">
                        {formatPrice(item.price)}
                        <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-normal ml-1 sm:ml-2">
                          each
                        </span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className="flex items-center border-2 border-[var(--color-border)] rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={updatingItems[item._id] || item.quantity <= 1}
                            className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base"
                          >
                            −
                          </button>
                          <span className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 border-x-2 border-[var(--color-border)] font-bold min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={updatingItems[item._id]}
                            className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={updatingItems[item._id]}
                          className="flex items-center gap-1.5 sm:gap-2 text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50 text-xs sm:text-sm"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total - Hidden on mobile, shown on larger screens */}
                    <div className="hidden sm:block text-right">
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-1">Subtotal</p>
                      <p className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-[var(--color-border)] p-4 sm:p-5 lg:sticky lg:top-24">
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)] mb-4 sm:mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 sm:mb-5">
                  <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(cart.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(cart.tax)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                    <span>Shipping</span>
                    {freeShipping ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">{formatPrice(shippingCost)}</span>
                    )}
                  </div>

                  <div className="border-t-2 border-[var(--color-border)] pt-3 flex justify-between">
                    <span className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">Total</span>
                    <span className="text-xl font-bold text-[var(--color-brand-primary)]">
                      {formatPrice(cart.total + shippingCost)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full mb-2 sm:mb-3 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="outline" size="md" className="w-full text-sm sm:text-base">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[var(--color-border)] space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Safe Payment Options</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Easy Returns</span>
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
