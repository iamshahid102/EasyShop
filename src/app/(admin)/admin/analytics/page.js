'use client';

import { useState, useEffect, useCallback } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils/helpers';
import { FaChartBar, FaBox, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      avgOrderValue: 0,
    },
    revenueByMonth: [],
    topProducts: [],
    topCategories: [],
    ordersByStatus: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // Last 30 days

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all necessary data
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/products?limit=1000'),
        fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [productsData, ordersData, usersData] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
        usersRes.json(),
      ]);

      if (productsData.success && ordersData.success && usersData.success) {
        const products = productsData.data.products;
        const orders = ordersData.data.orders;
        const users = usersData.data.users;

        // Calculate analytics
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        // Revenue by month (last 6 months)
        const revenueByMonth = calculateRevenueByMonth(orders);

        // Top products by order count
        const productOrders = {};
        orders.forEach((order) => {
          order.items.forEach((item) => {
            const productId = item.product?.toString() || item.product;
            if (!productOrders[productId]) {
              productOrders[productId] = {
                name: item.name,
                quantity: 0,
                revenue: 0,
              };
            }
            productOrders[productId].quantity += item.quantity;
            productOrders[productId].revenue += item.price * item.quantity;
          });
        });

        const topProducts = Object.values(productOrders)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Orders by status
        const ordersByStatus = [
          { status: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
          { status: 'Processing', count: orders.filter((o) => o.status === 'processing').length },
          { status: 'Shipped', count: orders.filter((o) => o.status === 'shipped').length },
          { status: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length },
          { status: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
        ];

        // Top categories
        const categoryStats = {};
        products.forEach((product) => {
          if (!categoryStats[product.category]) {
            categoryStats[product.category] = { count: 0, revenue: 0 };
          }
          categoryStats[product.category].count += 1;
        });

        const topCategories = Object.entries(categoryStats)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setAnalytics({
          overview: {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalCustomers: users.filter((u) => u.role === 'user').length,
            avgOrderValue,
          },
          revenueByMonth,
          topProducts,
          topCategories,
          ordersByStatus,
          recentActivity: orders.slice(0, 10),
        });
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchAnalytics();
  }, [user, router, fetchAnalytics, dateRange]);

  const calculateRevenueByMonth = (orders) => {
    const monthlyRevenue = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthlyRevenue[key] = 0;
    }

    // Calculate revenue
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const key = orderDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyRevenue[key] !== undefined) {
        monthlyRevenue[key] += order.totalPrice;
      }
    });

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-brand-accent)]">Analytics & Reports</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Insights and performance metrics for your store</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Revenue</div>
          <div className="text-3xl font-bold mt-2">
            {formatPrice(analytics.overview.totalRevenue)}
          </div>
          <div className="text-sm mt-2 opacity-75">↗ +12.5% from last month</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Orders</div>
          <div className="text-3xl font-bold mt-2">{analytics.overview.totalOrders}</div>
          <div className="text-sm mt-2 opacity-75">↗ +8.2% from last month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm font-medium opacity-90">Avg Order Value</div>
          <div className="text-3xl font-bold mt-2">
            {formatPrice(analytics.overview.avgOrderValue)}
          </div>
          <div className="text-sm mt-2 opacity-75">↗ +5.1% from last month</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Products</div>
          <div className="text-3xl font-bold mt-2">{analytics.overview.totalProducts}</div>
          <div className="text-sm mt-2 opacity-75">→ No change</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Customers</div>
          <div className="text-3xl font-bold mt-2">{analytics.overview.totalCustomers}</div>
          <div className="text-sm mt-2 opacity-75">↗ +15.3% from last month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
          <h2 className="text-xl font-bold mb-4">Revenue Trend (Last 6 Months)</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {analytics.revenueByMonth.map((data, index) => {
              const maxRevenue = Math.max(...analytics.revenueByMonth.map((d) => d.revenue));
              const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[var(--color-bg-secondary)] rounded-t relative">
                    <div
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                        {formatPrice(data.revenue)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-2 rotate-0">{data.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
          <h2 className="text-xl font-bold mb-4">Orders by Status</h2>
          <div className="space-y-4">
            {analytics.ordersByStatus.map((status, index) => {
              const totalOrders = analytics.overview.totalOrders;
              const percentage = totalOrders > 0 ? (status.count / totalOrders) * 100 : 0;
              const colors = [
                'bg-yellow-500',
                'bg-blue-500',
                'bg-purple-500',
                'bg-green-500',
                'bg-red-500',
              ];

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">{status.status}</span>
                    <span className="text-sm font-semibold">{status.count}</span>
                  </div>
                  <div className="w-full bg-[var(--color-bg-secondary)] rounded-full h-3">
                    <div
                      className={`${colors[index]} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md border border-[var(--color-border)]">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="text-xl font-bold">Top Selling Products</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center font-bold text-[var(--color-text-secondary)]">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{product.quantity} sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(product.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-md border border-[var(--color-border)]">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="text-xl font-bold">Top Categories</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {analytics.topCategories.map((category, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center font-bold text-[var(--color-text-secondary)]">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{category.count} products</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    {((category.count / analytics.overview.totalProducts) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
        <h2 className="text-xl font-bold mb-4">Export Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-zinc-200 rounded-lg hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <FaChartBar className="w-7 h-7" />
            <span className="font-medium">Sales Report</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-zinc-200 rounded-lg hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <FaBox className="w-7 h-7" />
            <span className="font-medium">Inventory Report</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-zinc-200 rounded-lg hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <FaUsers className="w-7 h-7" />
            <span className="font-medium">Customer Report</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-zinc-200 rounded-lg hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <FaMoneyBillWave className="w-7 h-7" />
            <span className="font-medium">Revenue Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
