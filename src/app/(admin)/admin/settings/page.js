'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaStore, FaCreditCard, FaTruck, FaEnvelope, FaLock, FaGlobe } from 'react-icons/fa';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-brand-accent)]">Settings</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your store settings and configurations</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4 flex items-center justify-center"><FaStore /></div>
            <h3 className="text-lg font-bold mb-2">Store Information</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Update store name, logo, and contact details</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4 flex items-center justify-center"><FaCreditCard /></div>
            <h3 className="text-lg font-bold mb-2">Payment Methods</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Configure payment gateways and options</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4 flex items-center justify-center"><FaTruck /></div>
            <h3 className="text-lg font-bold mb-2">Shipping Settings</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Manage shipping zones and rates</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4 flex items-center justify-center"><FaEnvelope /></div>
            <h3 className="text-lg font-bold mb-2">Email Templates</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Customize order confirmation and notification emails</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4 flex items-center justify-center"><FaLock /></div>
            <h3 className="text-lg font-bold mb-2">Security</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Two-factor authentication and security settings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[var(--color-border)] hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4 flex items-center justify-center"><FaGlobe /></div>
            <h3 className="text-lg font-bold mb-2">Integrations</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Connect third-party services and APIs</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold mb-1">Settings Page Under Development</p>
              <p className="text-sm">
                Advanced settings configuration will be available soon. Currently, you can manage products, orders, and customers from their respective pages.
              </p>
            </div>
          </div>
        </div>
      </div>
    
  );
}
