'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils/helpers';
import { FaBox, FaShoppingCart, FaMoneyBillWave, FaExclamationTriangle, FaPlus, FaList, FaChartBar, FaUsers } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch products (admin endpoint)
      const productsRes = await fetch('/api/admin/products?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsData = await productsRes.json();

      // Fetch orders (admin endpoint)
      const ordersRes = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();

      if (productsData.success && ordersData.success) {
        const products = productsData.data.products;
        const orders = ordersData.data.orders;

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const lowStock = products.filter((p) => p.stock < 10 && p.stock > 0).length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          lowStock,
          recentOrders: orders.slice(0, 5),
          topProducts: products
            .sort((a, b) => (b.ratings?.count || 0) - (a.ratings?.count || 0))
            .slice(0, 5),
        });
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-zinc-100 text-zinc-800';
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-primary)]"></div>
        </div>
      
    );
  }

  return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-brand-accent)]">Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Welcome back, {user.name}! Here's your store overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Total Products</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-brand-accent)] mt-2">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center">
                <FaBox className="w-6 h-6 text-[var(--color-brand-primary)]" />
              </div>
            </div>
            <Link href="/admin/products" className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] mt-4 inline-block transition-colors">
              View all products →
            </Link>
          </div>

          {/* Total Orders */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-brand-accent)] mt-2">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center">
                <FaShoppingCart className="w-6 h-6 text-[var(--color-brand-primary)]" />
              </div>
            </div>
            <Link href="/admin/orders" className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] mt-4 inline-block transition-colors">
              View all orders →
            </Link>
          </div>

          {/* Total Revenue */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-brand-accent)] mt-2">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="w-6 h-6 text-[var(--color-brand-primary)]" />
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-4">From {stats.totalOrders} orders</p>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Low Stock Items</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600 mt-2">{stats.lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-4">Products with &lt;10 stock</p>
          </div>
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)]">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold text-[var(--color-brand-accent)]">Recent Orders</h2>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order._id} className="p-4 hover:bg-[var(--color-bg-secondary)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--color-brand-accent)]">#{order.orderNumber}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{order.user?.name || 'Guest'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--color-brand-accent)]">{formatPrice(order.totalPrice)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--color-text-tertiary)]">No orders yet</div>
              )}
            </div>
            <div className="p-4 border-t border-[var(--color-border)]">
              <Link href="/admin/orders" className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors">
                View all orders →
              </Link>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)]">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold text-[var(--color-brand-accent)]">Top Rated Products</h2>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {stats.topProducts.length > 0 ? (
                stats.topProducts.map((product) => (
                  <div key={product._id} className="p-4 hover:bg-[var(--color-bg-secondary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex-shrink-0 overflow-hidden">
                        {product.images?.[0]?.url && (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-brand-accent)] truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-yellow-600 font-medium">★ {product.ratings?.average?.toFixed(1) || '0.0'}</span>
                          <span className="text-sm text-[var(--color-text-tertiary)]">({product.ratings?.count || 0} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-[var(--color-brand-accent)]">{formatPrice(product.price)}</p>
                        <p className="text-sm text-[var(--color-text-tertiary)]">Stock: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--color-text-tertiary)]">No products yet</div>
              )}
            </div>
            <div className="p-4 border-t border-[var(--color-border)]">
              <Link href="/admin/products" className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors">
                View all products →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-brand-accent)] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/products/add"
              className="flex flex-col items-center gap-3 p-5 border-2 border-[var(--color-border)] rounded-2xl hover:border-[var(--color-brand-primary)]/50 hover:bg-[var(--color-bg-secondary)] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                <FaPlus className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-[var(--color-brand-accent)]">Add Product</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex flex-col items-center gap-3 p-5 border-2 border-[var(--color-border)] rounded-2xl hover:border-[var(--color-brand-primary)]/50 hover:bg-[var(--color-bg-secondary)] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                <FaList className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-[var(--color-brand-accent)]">Manage Products</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex flex-col items-center gap-3 p-5 border-2 border-[var(--color-border)] rounded-2xl hover:border-[var(--color-brand-primary)]/50 hover:bg-[var(--color-bg-secondary)] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                <FaChartBar className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-[var(--color-brand-accent)]">View Orders</span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex flex-col items-center gap-3 p-5 border-2 border-[var(--color-border)] rounded-2xl hover:border-[var(--color-brand-primary)]/50 hover:bg-[var(--color-bg-secondary)] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                <FaUsers className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm text-[var(--color-brand-accent)]">Customers</span>
            </Link>
          </div>
        </div>
      </div>
  );
}
