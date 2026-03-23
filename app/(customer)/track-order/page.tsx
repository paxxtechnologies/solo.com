"use client";

import { useState } from "react";
import { Search, Package, CheckCircle, Truck, Home, Clock, AlertCircle } from "lucide-react";

const statusSteps = [
  { key: "placed", label: "Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const getStatusIndex = (status: string) => {
  const statusMap: Record<string, number> = {
    pending: 0,
    placed: 0,
    confirmed: 1,
    processing: 2,
    packed: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  };
  return statusMap[status] ?? 0;
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{
    id: string;
    status: string;
    placedAt: string;
    estimatedDelivery: string;
    trackingNumber: string;
    carrier: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - accept any order starting with SC-
      if (orderNumber.toUpperCase().startsWith("SC-")) {
        setOrder({
          id: orderNumber.toUpperCase(),
          status: "shipped",
          placedAt: "2024-01-15T10:30:00Z",
          estimatedDelivery: "2024-01-17",
          trackingNumber: "NG123456789",
          carrier: "GIG Logistics",
        });
      } else {
        setError("Order not found. Check your order number and try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <main className="min-h-screen bg-surface py-12">
      <div className="max-w-[600px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted">
            Enter your order number and WhatsApp number to see your order status.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 border border-border mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., SC-2024-001234"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g., 09066994388"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {loading ? (
                "Searching..."
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-card p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-foreground">Order {order.id}</h2>
                <p className="text-sm text-muted">
                  Placed on{" "}
                  {new Date(order.placedAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full capitalize">
                {order.status}
              </span>
            </div>

            {/* Status Timeline */}
            {order.status === "cancelled" ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center font-medium">
                This order has been cancelled
              </div>
            ) : (
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-alt">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-primary text-white"
                              : "bg-surface-alt text-muted"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium ${
                            isCompleted ? "text-foreground" : "text-muted"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tracking Info */}
            {order.trackingNumber && order.status === "shipped" && (
              <div className="mt-6 p-4 bg-surface-alt rounded-lg">
                <p className="text-sm text-muted mb-1">Tracking Number</p>
                <p className="font-semibold text-foreground">{order.trackingNumber}</p>
                <p className="text-sm text-muted mt-1">via {order.carrier}</p>
              </div>
            )}

            {order.estimatedDelivery && order.status !== "delivered" && order.status !== "cancelled" && (
              <p className="mt-4 text-sm text-muted text-center">
                Estimated delivery:{" "}
                <span className="font-medium text-foreground">
                  {new Date(order.estimatedDelivery).toLocaleDateString("en-NG", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}

            {/* Help */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted mb-3">Need help with your order?</p>
              <a
                href={`https://wa.me/2349066994388?text=${encodeURIComponent(
                  `Hi, I need help with order #${order.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
