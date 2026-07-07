'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();
  const productId = params.id;

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
    imageUrl: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        const product = data.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          comparePrice: product.comparePrice || '',
          category: product.category || '',
          brand: product.brand || '',
          stock: product.stock || 0,
          sku: product.sku || '',
          tags: product.tags?.join(', ') || '',
          featured: product.featured || false,
          imageUrl: product.images?.[0]?.url || '',
          isActive: product.isActive !== false,
        });
      } else {
        error('Product not found');
        router.push('/admin/products');
      }
    } catch (err) {
      console.error('Fetch product error:', err);
      error('Error loading product');
    } finally {
      setLoading(false);
    }
  };

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

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
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

    setSaveLoading(true);
    setErrors({});

    try {
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
        isActive: formData.isActive,
        ...(formData.tags && { tags: formData.tags.split(',').map((t) => t.trim()) }),
        ...(formData.imageUrl && {
          images: [{ url: formData.imageUrl, alt: formData.name }],
        }),
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        setErrors({ general: data.message || 'Failed to update product' });
      }
    } catch (error) {
      setErrors({ general: 'Error updating product. Please try again.' });
    } finally {
      setSaveLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      
    );
  }

  return (
    
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Edit Product</h1>
          <p className="text-zinc-600 mt-1">Update product information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input
                id="name"
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.description ? 'border-red-500' : 'border-zinc-300'
                  }`}
                  required
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <Input
                id="brand"
                name="brand"
                label="Brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="price"
                name="price"
                type="number"
                label="Price (Rs.)"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                step="0.01"
                required
              />

              <Input
                id="comparePrice"
                name="comparePrice"
                type="number"
                label="Compare at Price (Rs.)"
                value={formData.comparePrice}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.category ? 'border-red-500' : 'border-zinc-300'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home & Garden</option>
                  <option value="Sports">Sports & Outdoors</option>
                  <option value="Beauty">Beauty & Personal Care</option>
                  <option value="Toys">Toys & Games</option>
                  <option value="Food">Food & Beverages</option>
                </select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>

              <Input
                id="tags"
                name="tags"
                label="Tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="wireless, bluetooth, premium (comma separated)"
              />
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="stock"
                name="stock"
                type="number"
                label="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                required
              />

              <Input
                id="sku"
                name="sku"
                label="SKU"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <Input
              id="imageUrl"
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* Status & Options */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Status & Options</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-black focus:ring-2 focus:ring-black rounded"
                />
                <span className="font-medium text-zinc-900">Featured Product</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-black focus:ring-2 focus:ring-black rounded"
                />
                <span className="font-medium text-zinc-900">Active (Visible to customers)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" loading={saveLoading} className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
              disabled={saveLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    
  );
}
