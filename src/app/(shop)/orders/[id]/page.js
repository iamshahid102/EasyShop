"use client";

import { use, useState, useEffect } from "react";
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
import {
  FaHourglass,
  FaCog,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaEdit,
} from "react-icons/fa";

export default function OrderDetailPage({ params }) {
  // Unwrap the params promise (Next.js 15+)
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchOrder();
    }
  }, [user, authLoading, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/customer/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        console.error(data.message || "Order not found");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Fetch order error:", error);
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", label: "Pending", icon: FaHourglass },
      processing: { variant: "info", label: "Processing", icon: FaCog },
      shipped: { variant: "primary", label: "Shipped", icon: FaTruck },
      delivered: {
        variant: "success",
        label: "Delivered",
        icon: FaCheckCircle,
      },
      cancelled: { variant: "danger", label: "Cancelled", icon: FaTimesCircle },
    };
    return (
      statusConfig[status] || { variant: "default", label: status, icon: FaBox }
    );
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { status: "pending", label: "Order Placed", icon: FaEdit },
      { status: "processing", label: "Processing", icon: FaCog },
      { status: "shipped", label: "Shipped", icon: FaTruck },
      { status: "delivered", label: "Delivered", icon: FaCheckCircle },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!order) {
    return null;
  }

  const statusSteps = getStatusSteps(order.status);
  const statusBadge = getStatusBadge(order.status);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-brand-accent)] via-[#2a2a2a] to-[var(--color-brand-primary-dark)] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Orders
            </Link>
            <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl text-white/80 font-bold mb-1 sm:mb-2">
                  Order Confirmation
                </h1>
                <p className="text-sm sm:text-base text-white/70">
                  Order #{order.orderNumber}
                </p>
              </div>
              <Badge variant={statusBadge.variant} size="lg">
                <statusBadge.icon className="w-5 h-5" /> {statusBadge.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Success Message for New Orders */}
          {order.status === "pending" && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-green-900 mb-1 sm:mb-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-sm sm:text-base text-green-800 mb-3 sm:mb-4">
                    Thank you for your order! We've received your order and will
                    start processing it soon. You'll receive an email
                    confirmation shortly.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Order Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="font-medium">Email Sent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Status Timeline */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)] mb-6">
              Order Tracking
            </h2>
            <div className="hidden sm:flex justify-between items-center">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-xl lg:text-2xl border-3 transition-all ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white shadow-lg"
                          : step.active
                            ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white animate-pulse shadow-lg"
                            : "bg-[var(--color-bg-tertiary)] border-[var(--color-border)]"
                      }`}
                    >
                      <step.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                    </div>
                    <p
                      className={`text-xs sm:text-sm mt-2 font-semibold text-center ${
                        step.completed || step.active
                          ? "text-[var(--color-brand-accent)]"
                          : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-all ${
                        step.completed
                          ? "bg-green-500"
                          : "bg-[var(--color-border)]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="sm:hidden space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : step.active
                            ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white"
                            : "bg-[var(--color-bg-tertiary)] border-[var(--color-border)]"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 my-1 rounded transition-all ${
                          step.completed
                            ? "bg-green-500"
                            : "bg-[var(--color-border)]"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p
                      className={`text-sm font-semibold ${
                        step.completed || step.active
                          ? "text-[var(--color-brand-accent)]"
                          : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800 font-semibold mb-1">
                  Tracking Number
                </p>
                <p className="text-base sm:text-lg font-mono font-bold text-blue-900">
                  {order.trackingNumber}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 sm:p-8">
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)] mb-5">
                  Order Items ({order.items.length})
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 sm:gap-4 pb-4 border-b border-[var(--color-border)] last:border-0"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-bg-secondary)] rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-border)]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-[var(--color-brand-accent)] mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-1">
                          Quantity:{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                          {formatPrice(item.price)}{" "}
                          <span className="text-[var(--color-text-tertiary)]">
                            each
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm sm:text-base lg:text-lg text-[var(--color-brand-primary)]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                    Delivery Address
                  </h2>
                </div>
                <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 sm:p-5 text-sm sm:text-base text-[var(--color-text-secondary)] space-y-1">
                  <p className="font-semibold text-[var(--color-brand-accent)]">
                    {order.shippingAddress.street}
                  </p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="font-medium">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 sm:p-8 lg:sticky lg:top-24 space-y-5 sm:space-y-6">
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-secondary)]">
                      Order Date
                    </span>
                    <span className="font-semibold text-[var(--color-brand-accent)]">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-secondary)]">
                      Payment Method
                    </span>
                    <Badge variant="default" size="sm">
                      {order.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-secondary)]">
                      Payment Status
                    </span>
                    <Badge
                      variant={order.isPaid ? "success" : "warning"}
                      size="sm"
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Tax (10%)
                    </span>
                    <span className="font-semibold">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Shipping
                    </span>
                    <span
                      className={`font-semibold ${order.shippingPrice === 0 ? "text-green-600" : ""}`}
                    >
                      {order.shippingPrice === 0
                        ? "FREE"
                        : formatPrice(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="border-t-2 border-[var(--color-border)] pt-3 flex justify-between">
                    <span className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)]">
                      Total
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[var(--color-brand-primary)]">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Delivery Date */}
                {order.deliveredAt && (
                  <div className="pt-4 border-t border-[var(--color-border)] bg-green-50 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-green-800 font-medium mb-1">
                      Delivered on
                    </p>
                    <p className="font-bold text-green-900">
                      {formatDate(order.deliveredAt)}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-4 border-t border-[var(--color-border)] space-y-2 sm:space-y-3">
                  <Link href="/products" className="block">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link href="/orders" className="block">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full text-sm sm:text-base"
                    >
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-br from-[var(--color-bg-secondary)] to-white border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-brand-accent)] mb-2">
              Need Help with Your Order?
            </h3>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4 max-w-2xl mx-auto">
              Our customer support team is here to help. Contact us if you have
              any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button variant="secondary" size="md">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Support
              </Button>
              <Button variant="ghost" size="md">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQs
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
