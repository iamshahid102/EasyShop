'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/helpers';

export default function AdminCustomersPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
      });

      const res = await fetch(`/api/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setCustomers(data.data.users);
        setPagination((prev) => ({ ...prev, ...data.data.pagination }));
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.role]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchCustomers();
  }, [user, router, fetchCustomers]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-brand-accent)]">Customers Management</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">View and manage all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
          <div className="text-[var(--color-text-secondary)] text-sm font-medium">Total Users</div>
          <div className="text-3xl font-bold mt-2">{pagination.total}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
          <div className="text-[var(--color-text-secondary)] text-sm font-medium">Customers</div>
          <div className="text-3xl font-bold mt-2 text-blue-600">
            {customers.filter((c) => c.role === 'user').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)]">
          <div className="text-[var(--color-text-secondary)] text-sm font-medium">Admins</div>
          <div className="text-3xl font-bold mt-2 text-purple-600">
            {customers.filter((c) => c.role === 'admin').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
          />

          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
          >
            <option value="">All Roles</option>
            <option value="user">Customers</option>
            <option value="admin">Admins</option>
          </select>

          <Button onClick={fetchCustomers}>Refresh</Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-primary)]"></div>
          </div>
        ) : customers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--color-border)]">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-[var(--color-bg-tertiary)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center font-semibold text-[var(--color-text-secondary)]">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--color-brand-accent)]">{customer.name}</div>
                            {customer.phone && (
                              <div className="text-sm text-[var(--color-text-secondary)]">{customer.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--color-brand-accent)]">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            customer.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {customer.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {customer.isVerified ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <span className="text-[var(--color-text-tertiary)] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Not Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:underline text-sm">
                          View Details
                        </button>
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
                  {pagination.total} customers
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
            <p className="text-xl text-[var(--color-text-secondary)]">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
