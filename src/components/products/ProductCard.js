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

    if (!user) {
      error('Please login to add items to cart');
      setTimeout(() => router.push('/login'), 1000);
      return;
    }

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
        className="group card-hover bg-[var(--color-bg-card)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-sm)] flex flex-col h-full"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-tertiary)]">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)]">
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
            <div className="absolute top-3 left-3 bg-gradient-brand text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-[var(--shadow-brand-sm)] tracking-wide">
              -{discount}%
            </div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md tracking-wide">
              NEW
            </div>
          )}

          {/* Out of Stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-[var(--color-brand-accent)]/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-[var(--color-brand-accent)] px-3.5 py-1.5 rounded-full font-bold text-xs shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end justify-center pb-4">
            <button
              onClick={handleQuickView}
              className="glass text-[var(--color-brand-accent)] px-4 py-2 rounded-full font-semibold text-xs translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white shadow-lg"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {product.brand && (
            <p className="text-[10px] sm:text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-[0.08em] mb-1">
              {product.brand}
            </p>
          )}

          <h5 className="font-semibold text-sm text-[var(--color-brand-accent)] mb-1.5 line-clamp-2 leading-snug group-hover:text-[var(--color-brand-primary)] transition-colors flex-1">
            {product.name}
          </h5>

          {/* Rating */}
          {product.ratings && product.ratings.count > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-3 h-3 ${
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
              <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
                {product.ratings.average.toFixed(1)}
              </span>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">
                ({product.ratings.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-base sm:text-lg font-extrabold text-[var(--color-brand-accent)] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-[var(--color-text-tertiary)] line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Low stock */}
          {product.stock > 0 && product.stock < 10 && (
            <p className="text-[10px] text-[var(--color-warning)] font-semibold mt-0.5">
              Only {product.stock} left in stock
            </p>
          )}

          {/* Add to Cart — always visible on mobile, reveal on hover on desktop */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="btn-shine w-full mt-3 py-2.5 bg-gradient-brand bg-gradient-brand-hover text-white font-semibold rounded-[var(--radius-md)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 shadow-[var(--shadow-brand-sm)] hover:shadow-[var(--shadow-brand)] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            {addingToCart ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
