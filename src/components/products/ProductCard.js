'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils/helpers';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { success, error } = useToast();
  const [showQuickView, setShowQuickView] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const discount = calculateDiscount(product.price, product.comparePrice);

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      error('Please login to add items to cart');
      setTimeout(() => router.push('/login'), 1000);
      return;
    }

    // Check stock
    if (product.stock === 0) {
      error('This product is out of stock');
      return;
    }

    setAddingToCart(true);

    try {
      const result = await addToCart(product._id, 1);

      if (result.success) {
        success(`${product.name} added to cart!`);
      } else {
        error(result.error || 'Failed to add to cart');
      }
    } catch (err) {
      error('Something went wrong. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <Link
        href={`/products/${product._id}`}
        className="group bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-brand-primary)] transition-all duration-300 overflow-hidden hover:shadow-lg flex flex-col h-full"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-tertiary)]">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)]">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-[var(--color-brand-primary)] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
              -{discount}%
            </div>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-[var(--color-brand-accent)] px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
              NEW
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2 sm:pb-3">
            <button
              onClick={handleQuickView}
              className="bg-white text-[var(--color-brand-accent)] px-3 py-2 rounded-lg font-semibold text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[var(--color-brand-primary)] hover:text-white shadow-lg"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
          {/* Brand */}
          {product.brand && (
            <p className="text-[10px] sm:text-xs font-semibold text-[var(--color-brand-primary)] uppercase tracking-wide mb-0.5">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h5 className="font-semibold text-xs sm:text-sm text-[var(--color-brand-accent)] mb-1 line-clamp-2 leading-tight group-hover:text-[var(--color-brand-primary)] transition-colors flex-1">
            {product.name}
          </h5>

          {/* Rating */}
          {product.ratings && product.ratings.count > 0 && (
            <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                      index < Math.floor(product.ratings.average)
                        ? 'text-[var(--color-rating-filled)]'
                        : 'text-[var(--color-rating-empty)]'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-brand-accent)]">
                {product.ratings.average.toFixed(1)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--color-text-secondary)]">
                ({product.ratings.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm sm:text-base font-bold text-[var(--color-brand-accent)]">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[10px] sm:text-xs text-[var(--color-text-tertiary)] line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          {product.stock > 0 && product.stock < 10 && (
            <p className="text-[8px] sm:text-[9px] text-orange-600 font-medium mt-0.5 sm:mt-1">
              Only {product.stock} left in stock
            </p>
          )}

          {/* Add to Cart Button - Appears on Hover */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="w-full mt-2 sm:mt-2.5 py-1.5 sm:py-2 bg-[var(--color-brand-primary)] text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--color-brand-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-[10px] sm:text-xs flex items-center justify-center gap-1.5"
          >
            {addingToCart ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
