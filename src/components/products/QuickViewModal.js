'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatPrice, calculateDiscount } from '@/lib/utils/helpers';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { success, error } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.comparePrice);
  const hasImages = product.images && product.images.length > 0;
  const savings = product.comparePrice ? product.comparePrice - product.price : 0;

  const handleAddToCart = async () => {
    if (!user) {
      error('Please login to add items to cart');
      onClose();
      setTimeout(() => router.push('/login'), 1000);
      return;
    }

    if (product.stock < quantity) {
      error(`Only ${product.stock} items available in stock`);
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);

    if (result.success) {
      success(`${product.name} added to cart!`);
      setQuantity(1);
      onClose();
    } else {
      error(result.error || 'Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const handleViewFullDetails = () => {
    onClose();
    router.push(`/products/${product._id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
        {/* Left: Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-[var(--color-bg-tertiary)] rounded-2xl overflow-hidden">
            {hasImages ? (
              <Image
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20 text-[var(--color-border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="danger" size="md">
                  -{discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="success" size="md">
                  NEW
                </Badge>
              )}
            </div>

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-lg px-6 py-3">
                  <p className="text-[var(--color-base-accent-2)] font-bold">Out of Stock</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {hasImages && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[var(--color-base-accent-1)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-4">
          {/* Brand */}
          {product.brand && (
            <Badge variant="outline" size="sm">
              {product.brand}
            </Badge>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-[var(--color-brand-accent)] leading-tight">
            {product.name}
          </h2>

          {/* Rating */}
          {product.ratings && product.ratings.count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratings.average)
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
              <span className="text-sm font-semibold">{product.ratings.average.toFixed(1)}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                ({product.ratings.count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-[var(--color-brand-primary)]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-[var(--color-text-secondary)] line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-green-600 font-semibold text-sm">
                You save {formatPrice(savings)} ({discount}%)
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <Badge variant="default">
              {product.category}
            </Badge>
            <Badge
              variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}
            >
              {product.stock > 10
                ? '✓ In Stock'
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : 'Out of Stock'}
            </Badge>
          </div>

          {/* Description */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-[var(--color-text-secondary)] text-sm line-clamp-4">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[var(--color-brand-accent)] mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-[var(--color-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-[var(--color-bg-tertiary)] transition-colors font-bold"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x-2 border-[var(--color-border)] font-bold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-[var(--color-base-background-2)] transition-colors font-bold"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {product.stock} available
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {product.stock > 0 && (
              <Button
                onClick={handleAddToCart}
                loading={addingToCart}
                className="w-full"
                size="lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </Button>
            )}

            <Button
              onClick={handleViewFullDetails}
              variant="outline"
              size="md"
              className="w-full"
            >
              View Full Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
