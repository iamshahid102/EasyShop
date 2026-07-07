'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import { formatPrice, formatDate } from '@/lib/utils/helpers';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();
  const confirmDialog = useConfirmDialog();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, filters.status, filters.search, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        let filteredOrders = data.data.orders;

        // Client-side filtering
        if (filters.status) {
          filteredOrders = filteredOrders.filter((o) => o.status === filters.status);
        }

        if (filters.search) {
          filteredOrders = filteredOrders.filter(
            (o) =>
              o.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
              o.user?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              o.user?.email.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setOrders(filteredOrders);
        setPagination((prev) => ({ ...prev, ...data.data.pagination }));
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      setUpdateLoading(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          ...(trackingNumber && { trackingNumber }),
        }),
      });

      const data = await res.json();

      if (data.success) {
        success('Order status updated successfully!');
        fetchOrders();
      } else {
        error(data.message || 'Failed to update order');
      }
    } catch (err) {
      error('Error updating order');
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    };

    const nextStatus = statusFlow[currentStatus];

    if (!nextStatus) {
      error('Order is already in final state');
      return;
    }

    if (nextStatus === 'shipped') {
      const trackingNumber = await confirmDialog.prompt({
        title: 'Enter Tracking Number',
        message: 'Please enter the tracking number for this shipment:',
        placeholder: 'e.g., TRK123456789',
        confirmText: 'Update Status',
        cancelText: 'Cancel',
      });

      if (trackingNumber) {
        updateOrderStatus(orderId, nextStatus, trackingNumber);
      }
    } else {
      const confirmed = await confirmDialog.confirm({
        title: 'Update Order Status',
        message: `Update order status to "${nextStatus}"?`,
        confirmText: 'Update',
        cancelText: 'Cancel',
        variant: 'info',
      });

      if (confirmed) {
        updateOrderStatus(orderId, nextStatus);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-[var(--color-bg-secondary)] text-zinc-800 border-zinc-200';
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-brand-accent)]">Orders Management</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">View and manage all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">All Orders</div>
            <div className="text-3xl font-bold mt-2">{orders.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold mt-2 text-yellow-600">
              {orders.filter((o) => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Processing</div>
            <div className="text-3xl font-bold mt-2 text-blue-600">
              {orders.filter((o) => o.status === 'processing').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Shipped</div>
            <div className="text-3xl font-bold mt-2 text-purple-600">
              {orders.filter((o) => o.status === 'shipped').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)] text-sm font-medium">Delivered</div>
            <div className="text-3xl font-bold mt-2 text-green-600">
              {orders.filter((o) => o.status === 'delivered').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by order number, name, or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
            />

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button onClick={fetchOrders}>Refresh</Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md border border-[var(--color-border)] overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-primary)]"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--color-border)]">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-[var(--color-bg-tertiary)]">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold">#{order.orderNumber}</div>
                          <div className="text-sm text-[var(--color-text-secondary)]">
                            {formatDate(order.createdAt)}
                          </div>
                          {order.trackingNumber && (
                            <div className="text-xs text-blue-600 mt-1">
                              Track: {order.trackingNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{order.user?.name || 'Guest'}</div>
                          <div className="text-sm text-[var(--color-text-secondary)]">{order.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{order.items.length} items</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{formatPrice(order.totalPrice)}</div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          {order.paymentMethod.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </Link>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(order._id, order.status)}
                              disabled={updateLoading === order._id}
                              className="text-green-600 hover:underline text-sm disabled:opacity-50"
                            >
                              {updateLoading === order._id ? 'Updating...' : 'Update Status'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-[var(--color-text-secondary)]">No orders found</p>
            </div>
          )}
        </div>
      </div>
    
  );
}
