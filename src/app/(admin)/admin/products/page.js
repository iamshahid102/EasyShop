'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/helpers';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();
  const confirmDialog = useConfirmDialog();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '-createdAt',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, filters.search, filters.category, filters.sort, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        sort: filters.sort,
      });

      const res = await fetch(`/api/admin/products?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination((prev) => ({ ...prev, ...data.data.pagination }));
      } else {
        setProducts([]);
        // Show error to user
        if (data.message.includes('token') || data.message.includes('auth')) {
          error(`Authentication Error: ${data.message}. Please login again.`);
          router.push('/login');
        } else {
          error(`Error: ${data.message}`);
        }
      }
    } catch (err) {
      console.error('[ERROR] Fetch products error:', err);
      setProducts([]);
      error('Failed to fetch products. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(productId);
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        success('Product deleted successfully!');
        fetchProducts(); // Refresh list
      } else {
        error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      error('Error deleting product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-accent)]">Products Management</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Manage your product catalog - add, edit, or remove products
            </p>
          </div>
          <Link href="/admin/products/add">
            <Button size="lg">
              <span className="text-xl mr-2">+</span> Add Product
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Total Products</div>
            <div className="text-3xl font-bold mt-2">{pagination.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">In Stock</div>
            <div className="text-3xl font-bold mt-2 text-green-600">
              {products.filter((p) => p.stock > 0).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Out of Stock</div>
            <div className="text-3xl font-bold mt-2 text-red-600">
              {products.filter((p) => p.stock === 0).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Categories</div>
            <div className="text-3xl font-bold mt-2">
              {new Set(products.map((p) => p.category)).size}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[var(--color-border)]">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
            />

            <select
              value={filters.category}
              onChange={(e) => {
                setFilters({ ...filters, category: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => {
                setFilters({ ...filters, sort: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
            >
              <option value="-createdAt">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="price">Price Low-High</option>
              <option value="-price">Price High-Low</option>
              <option value="stock">Stock Low-High</option>
            </select>

            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md border border-[var(--color-border)] overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-primary)]"></div>
              <p className="ml-4 text-[var(--color-text-secondary)]">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[var(--color-border)]">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-[var(--color-bg-tertiary)]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[var(--color-bg-secondary)] rounded flex-shrink-0">
                              {product.images?.[0]?.url && (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-[var(--color-brand-accent)]">{product.name}</div>
                              <div className="text-sm text-[var(--color-text-tertiary)] truncate max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-xs rounded">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold">{formatPrice(product.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`font-semibold ${
                              product.stock === 0
                                ? 'text-red-600'
                                : product.stock < 10
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}
                          >
                            {product.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.isActive ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/edit/${product._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              disabled={deleteLoading === product._id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-[var(--color-bg-tertiary)] px-6 py-4 flex items-center justify-between border-t border-[var(--color-border)]">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} products
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-xl text-[var(--color-text-secondary)] mb-2">No products found</p>
              <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
                {filters.search || filters.category
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first product'}
              </p>
              <Link href="/admin/products/add">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
  );
}
