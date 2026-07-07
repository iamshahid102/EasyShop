'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ImageUploader from '@/components/ui/ImageUploader';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    brand: '',
    stock: '',
    sku: '',
    tags: '',
    featured: false,
  });

  const [imageFiles, setImageFiles] = useState([]); // File objects
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for auth context to load
    if (loading) {
      return; // Still checking auth in context
    }

    if (!user) {
      router.push('/login?redirect=/admin/products/add');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    // Auth check passed
    setCheckingAuth(false);
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImagesSelected = (files) => {
    setImageFiles(files);
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }

    if (imageFiles.length === 0) {
      newErrors.images = 'At least one product image is required';
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
    setUploadProgress(0);

    try {
      // Step 1: Upload images to Cloudinary
      const uploadedImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];

        const { uploadImageToCloudinary } = await import('@/lib/utils/cloudinary');
        const result = await uploadImageToCloudinary(file, 'products');

        uploadedImages.push({
          url: result.url,
          alt: `${formData.name} - Image ${i + 1}`,
          publicId: result.publicId,
        });

        // Update progress
        setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
      }

      // Step 2: Create product with uploaded image URLs
      const token = localStorage.getItem('token');

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        ...(formData.comparePrice && { comparePrice: parseFloat(formData.comparePrice) }),
        category: formData.category,
        ...(formData.brand && { brand: formData.brand }),
        stock: parseInt(formData.stock),
        ...(formData.sku && { sku: formData.sku }),
        featured: formData.featured,
        ...(formData.tags && { tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
        images: uploadedImages,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setErrors({ general: data.message || 'Failed to create product' });
      }
    } catch (error) {
      console.error('[ERROR] Create product error:', error);
      setErrors({ general: error.message || 'Error creating product. Please try again.' });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (checkingAuth) {
    return <LoadingPage />;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Books', label: 'Books' },
    { value: 'Home', label: 'Home & Garden' },
    { value: 'Sports', label: 'Sports & Outdoors' },
    { value: 'Beauty', label: 'Beauty & Personal Care' },
    { value: 'Toys', label: 'Toys & Games' },
    { value: 'Food', label: 'Food & Beverages' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-base-background-1)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-base-accent-2)]">Add New Product</h1>
          <p className="text-[var(--color-base-text)] mt-2 text-lg">
            Create a new product in your catalog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Error Creating Product</p>
                  <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-base-border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--color-base-accent-1)] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-base-accent-2)]">Product Images</h2>
                <p className="text-sm text-[var(--color-base-text)]">Upload high-quality images (max 5)</p>
              </div>
            </div>

            <ImageUploader
              onImagesSelected={handleImagesSelected}
              folder="products"
              maxFiles={5}
            />

            {errors.images && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.images}
              </p>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-base-border)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-base-accent-2)] mb-6">Basic Information</h2>
            <div className="space-y-5">
              <Input
                id="name"
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g. Premium Wireless Headphones"
                required
              />

              <Textarea
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Detailed product description..."
                rows={5}
                required
              />

              <Input
                id="brand"
                name="brand"
                label="Brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony, Apple, Nike"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-base-border)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-base-accent-2)] mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="price"
                name="price"
                type="number"
                label="Price (Rs.)"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="999"
                step="0.01"
                required
                helperText="Selling price of the product"
              />

              <Input
                id="comparePrice"
                name="comparePrice"
                type="number"
                label="Compare at Price (Rs.)"
                value={formData.comparePrice}
                onChange={handleChange}
                placeholder="1299"
                step="0.01"
                helperText="Original price (shows discount)"
              />
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-base-border)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-base-accent-2)] mb-6">Organization</h2>
            <div className="space-y-5">
              <Select
                id="category"
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                options={categories}
                required
              />

              <Input
                id="tags"
                name="tags"
                label="Tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="wireless, bluetooth, premium (comma separated)"
                helperText="Add tags to help customers find this product"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-base-border)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-base-accent-2)] mb-6">Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="stock"
                name="stock"
                type="number"
                label="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                placeholder="100"
                required
                helperText="Available quantity"
              />

              <Input
                id="sku"
                name="sku"
                label="SKU (Stock Keeping Unit)"
                value={formData.sku}
                onChange={handleChange}
                placeholder="WH-PRO-001"
                helperText="Unique product identifier"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-xl shadow-md border border-[var(--color-base-border)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-base-accent-2)] mb-6">Additional Options</h2>
            <label className="flex items-start gap-4 cursor-pointer p-4 border-2 border-[var(--color-base-border)] rounded-xl hover:border-[var(--color-base-accent-1)] transition-all">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 mt-0.5 text-[var(--color-base-accent-1)] focus:ring-2 focus:ring-[var(--color-base-accent-1)] rounded"
              />
              <div className="flex-1">
                <span className="font-semibold text-[var(--color-base-accent-2)]">Featured Product</span>
                <p className="text-sm text-[var(--color-base-text)] mt-1">
                  Display this product prominently in featured sections on the homepage
                </p>
              </div>
              {formData.featured && (
                <span className="px-3 py-1 bg-[var(--color-base-accent-1)] text-white text-xs font-bold rounded-full">
                  FEATURED
                </span>
              )}
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Upload Progress Indicator */}
            {loading && uploadProgress > 0 && (
              <div className="w-full mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-semibold text-blue-800">
                    Uploading images to Cloudinary... {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create Product
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/admin/products')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
