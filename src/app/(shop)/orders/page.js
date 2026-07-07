"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate } from "@/lib/utils/helpers";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { FaHourglass, FaCog, FaTruck, FaCheckCircle, FaTimesCircle, FaBox } from "react-icons/fa";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/customer/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", label: "Pending", icon: FaHourglass },
      processing: { variant: "info", label: "Processing", icon: FaCog },
      shipped: { variant: "primary", label: "Shipped", icon: FaTruck },
      delivered: { variant: "success", label: "Delivered", icon: FaCheckCircle },
      cancelled: { variant: "danger", label: "Cancelled", icon: FaTimesCircle },
    };

    const config = statusConfig[status] || {
      variant: "default",
      label: status,
      icon: FaBox,
    };
    return { ...config };
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const orderStats = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-white/80 font-extrabold mb-2">My Orders</h1>
            <p className="text-sm sm:text-base text-white/70">
              Track and manage all your orders
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {orders.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)]">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-brand-accent)] mb-3">
                No Orders Yet
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-7 text-base">
                Start shopping to see your orders here
              </p>
              <Link href="/products">
                <Button size="lg">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div className="mb-8 bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-1.5">
                <div className="flex flex-wrap gap-1">
                  {[
                    { key: "all", label: "All Orders" },
                    { key: "pending", label: "Pending" },
                    { key: "processing", label: "Processing" },
                    { key: "shipped", label: "Shipped" },
                    { key: "delivered", label: "Delivered" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        filter === tab.key
                          ? "bg-[var(--color-brand-primary)] text-white shadow-md shadow-orange-500/20"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                      }`}
                    >
                      {tab.label}
                      {orderStats[tab.key] > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${filter === tab.key ? "bg-white/20" : "bg-[var(--color-bg-secondary)]"}`}>
                          {orderStats[tab.key]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);

                  return (
                    <div
                      key={order._id}
                      className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="bg-[var(--color-bg-secondary)] px-6 py-4 border-b border-[var(--color-border)]">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                              <statusBadge.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                                Order #{order.orderNumber}
                              </h3>
                              <p className="text-sm text-[var(--color-text-secondary)]">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant={statusBadge.variant} size="lg">
                              <statusBadge.icon className="w-4 h-4" /> {statusBadge.label}
                            </Badge>
                            <Link href={`/orders/${order._id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="relative w-20 h-20 bg-[var(--color-base-background-2)] rounded-lg flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-[var(--color-border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-[var(--color-brand-accent)] line-clamp-2">
                                  {item.name}
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-bold text-[var(--color-brand-primary)] mt-1">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.items.length > 3 && (
                          <div className="mb-6 text-center">
                            <Badge variant="default">
                              +{order.items.length - 3} more items
                            </Badge>
                          </div>
                        )}

                        {/* Order Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                                Total Amount
                              </p>
                              <p className="text-xl sm:text-2xl font-bold text-[var(--color-brand-primary)]">
                                {formatPrice(order.totalPrice)}
                              </p>
                            </div>

                            {order.trackingNumber && (
                              <div className="pl-6 border-l border-[var(--color-border)]">
                                <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                                  Tracking Number
                                </p>
                                <p className="font-mono font-bold text-[var(--color-brand-accent)]">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]">
                  <p className="text-[var(--color-text-secondary)] text-lg">
                    No orders found with status:{" "}
                    <span className="font-bold">{filter}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
