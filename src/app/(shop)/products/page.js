'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '-createdAt',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.sort, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        sort: filters.sort,
      });

      const res = await fetch(`/api/public/products?${params}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination({
          ...pagination,
          ...data.data.pagination,
        });
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Books', label: 'Books' },
    { value: 'Home', label: 'Home & Living' },
    { value: 'Sports', label: 'Sports & Outdoors' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-ratings.average', label: 'Top Rated' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-brand-accent)] via-[#2a2a2a] to-[var(--color-brand-primary-dark)] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white/70 font-extrabold mb-3 tracking-tight">Shop All Products</h1>
            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Discover amazing products at unbeatable prices
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          {/* Filters Section */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-md border border-[var(--color-border)] p-5 sm:p-6 lg:p-8 mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                Filter & Search
              </h3>
              {(filters.search || filters.category) && (
                <button
                  onClick={() => {
                    setFilters({ search: '', category: '', sort: filters.sort });
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 focus:border-[var(--color-brand-primary)] transition-all bg-[var(--color-bg-primary)]"
                  />
                  <svg
                    className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-base-text)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Select */}
              <div className="relative">
                <select
                  value={filters.category}                    onChange={(e) => {
                    setFilters({ ...filters, category: e.target.value });
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 focus:border-[var(--color-brand-primary)] appearance-none bg-[var(--color-bg-primary)] transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-base-text)] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={filters.sort}                    onChange={(e) => {
                    setFilters({ ...filters, sort: e.target.value });
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 focus:border-[var(--color-brand-primary)] appearance-none bg-[var(--color-bg-primary)] transition-all"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-base-text)] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </form>

            {/* Active Filters */}
            {(filters.search || filters.category) && (
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--color-border)]">
                <span className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Active Filters:</span>
                {filters.search && (
                  <Badge variant="primary">
                    Search: {filters.search}
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="primary">
                    {categories.find((c) => c.value === filters.category)?.label}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
                Showing                <span className="font-semibold text-[var(--color-brand-accent)]">{products.length}</span> of{' '}
                <span className="font-semibold text-[var(--color-brand-accent)]">{pagination.total}</span> products
              </p>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
              <LoadingSpinner size="xl" />
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-4 font-medium">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-6 sm:py-8 border-t border-[var(--color-base-border)]">
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    Page {pagination.page} of {pagination.pages}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="text-xs sm:text-sm"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden xs:inline">Previous</span>
                    </Button>

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => setPagination({ ...pagination, page: pageNum })}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              pageNum === pagination.page
                                ? 'bg-[var(--color-base-accent-1)] text-white shadow-md'
                                : 'bg-white text-[var(--color-base-text)] border border-[var(--color-base-border)] hover:border-[var(--color-base-accent-1)]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.pages}
                      className="text-xs sm:text-sm"
                    >
                      <span className="hidden xs:inline">Next</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </>            ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-brand-accent)] mb-2">
                No Products Found
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setFilters({ search: '', category: '', sort: '-createdAt' });
                  setPagination({ ...pagination, page: 1 });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
