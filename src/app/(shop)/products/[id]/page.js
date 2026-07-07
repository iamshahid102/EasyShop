"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, calculateDiscount } from "@/lib/utils/helpers";
import { FaMinus, FaPlus, FaShoppingBag, FaBolt, FaChevronRight, FaStar } from 'react-icons/fa';

export default function ProductDetailPage({ params }) {
  // Unwrap the params promise (Next.js 15+)
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/public/products/${productId}`);
      const data = await res.json();

      if (data.success) {
        setProduct(data.data);
      } else {
        router.push("/products");
      }
    } catch (err) {
      console.error("Fetch product error:", err);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      error('Please login to add items to cart');
      setTimeout(() => router.push(`/login?redirect=/products/${productId}`), 1500);
      return;
    }

    if (product.stock < quantity) {
      error(`Only ${product.stock} items available in stock`);
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);

    if (result.success) {
      success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
      setQuantity(1); // Reset quantity after adding
    } else {
      error(result.error || 'Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (user) {
      setTimeout(() => router.push('/cart'), 800);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!product) {
    return null;
  }

  const discount = calculateDiscount(product.price, product.comparePrice);
  const hasImages = product.images && product.images.length > 0;
  const savings = product.comparePrice
    ? product.comparePrice - product.price
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-brand-primary)] transition-colors font-medium"
              >
                Home
              </Link>
              <FaChevronRight className="w-3 h-3 text-[var(--color-text-tertiary)]" />
              <Link
                href="/products"
                className="hover:text-[var(--color-brand-primary)] transition-colors font-medium"
              >
                Products
              </Link>
              <FaChevronRight className="w-3 h-3 text-[var(--color-text-tertiary)]" />
              <span className="text-[var(--color-brand-accent)] font-semibold truncate">
                {product.name}
              </span>
            </div>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border border-[var(--color-border)]">
                {hasImages ? (
                  <Image
                    src={product.images[selectedImage]?.url}
                    alt={product.images[selectedImage]?.alt || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-secondary)]">
                    <svg
                      className="w-32 h-32 text-[var(--color-border)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <Badge variant="danger" size="lg">
                      {discount}% OFF
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="success" size="lg">
                      NEW
                    </Badge>
                  )}
                </div>

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-xl px-8 py-4 shadow-2xl">
                      <p className="text-[var(--color-brand-accent)] font-bold text-xl">
                        Out of Stock
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {hasImages && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 bg-white rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === index
                          ? "border-[var(--color-brand-primary)] shadow-md ring-2 ring-[var(--color-brand-primary)]/20"
                          : "border-[var(--color-border)]"
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

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              {product.brand && (
                <Badge variant="outline" size="md">
                  {product.brand}
                </Badge>
              )}

              {/* Title */}
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-brand-accent)] mb-2 leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.ratings && product.ratings.count > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.ratings.average)
                              ? "text-[var(--color-rating-filled)]"
                              : "text-[var(--color-rating-empty)]"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-base-accent-2)]">
                      {product.ratings.average.toFixed(1)}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      ({product.ratings.count}{" "}
                      {product.ratings.count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 sm:p-5 border border-[var(--color-border)]">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
                  <span className="text-xl sm:text-2xl font-bold text-[var(--color-brand-primary)]">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice &&
                    product.comparePrice > product.price && (
                      <span className="text-xl text-[var(--color-text-tertiary)] line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                </div>
                {savings > 0 && (
                  <p className="text-green-600 font-semibold">
                    You save {formatPrice(savings)} ({discount}%)
                  </p>
                )}
              </div>

              {/* Category & Stock Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="default">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {product.category}
                </Badge>
                <Badge
                  variant={
                    product.stock > 10
                      ? "success"
                      : product.stock > 0
                        ? "warning"
                        : "danger"
                  }
                >
                  {product.stock > 10
                    ? "✓ In Stock"
                    : product.stock > 0
                      ? `Only ${product.stock} left!`
                      : "Out of Stock"}
                </Badge>
              </div>

              {/* Description */}
              <div className="border-t border-b border-[var(--color-border)] py-4 sm:py-5">
                <h2 className="text-sm sm:text-base font-bold text-[var(--color-brand-accent)] mb-2 sm:mb-3">
                  Product Description
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector & Add to Cart */}
              {product.stock > 0 && (
                <div className="space-y-4 bg-white rounded-xl p-6 border-2 border-[var(--color-brand-primary)] shadow-lg">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-brand-accent)] mb-3">
                      Select Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-[var(--color-border)] rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-6 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-8 py-3 border-x-2 border-[var(--color-border)] font-bold text-xl min-w-[80px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-6 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
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

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      loading={addingToCart}
                      className="flex-1"
                      size="xl"
                      variant="primary"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to Cart
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      loading={addingToCart}
                      size="xl"
                      variant="secondary"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-brand-accent)] mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  SKU:{" "}
                  <span className="font-mono font-semibold text-[var(--color-brand-accent)]">
                    {product.sku}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="mt-12 bg-white rounded-2xl shadow-lg border border-[var(--color-border)] p-8">
                <h2 className="text-lg sm:text-xl font-bold text-[var(--color-brand-accent)] mb-6">
                  Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start gap-4 pb-4 border-b border-[var(--color-border)]"
                      >
                        <span className="font-semibold text-[var(--color-brand-accent)] min-w-[140px]">
                          {key}:
                        </span>
                        <span className="text-[var(--color-text-secondary)] flex-1">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
