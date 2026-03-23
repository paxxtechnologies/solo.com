"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, MessageCircle, RotateCcw, Package, CheckCircle, Truck, Home, Clock } from "lucide-react";

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

const mockOrder = {
  id: "SC-2024-001234",
  status: "shipped",
  placedAt: "2024-01-15T10:30:00Z",
  confirmedAt: "2024-01-15T11:00:00Z",
  packedAt: "2024-01-15T14:00:00Z",
  shippedAt: "2024-01-16T09:00:00Z",
  deliveredAt: null,
  estimatedDelivery: "2024-01-17",
  items: [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      variant: "256GB - Natural Titanium",
      price: 1850000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
    },
    {
      id: "2",
      name: "Apple 20W USB-C Charger",
      variant: null,
      price: 15000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=200",
    },
  ],
  subtotal: 1880000,
  delivery: 0,
  discount: 0,
  total: 1880000,
  paymentMethod: "Paystack - Card ending 4242",
  deliveryAddress: {
    name: "John Doe",
    phone: "+234 906 699 4388",
    address: "15 Independence Layout",
    city: "Enugu",
    state: "Enugu State",
  },
  trackingNumber: "NG123456789",
  carrier: "GIG Logistics",
};

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

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(mockOrder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setOrder({ ...mockOrder, id: params.orderId as string });
      setLoading(false);
    }, 500);
  }, [params.orderId]);

  const currentStatusIndex = getStatusIndex(order.status);
  const canReturn = order.status === "delivered" && order.deliveredAt;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-alt rounded animate-pulse w-48" />
        <div className="bg-background rounded-card p-6 space-y-4">
          <div className="h-20 bg-surface-alt rounded animate-pulse" />
          <div className="h-40 bg-surface-alt rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/account/orders"
          className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order {order.id}</h1>
          <p className="text-muted text-sm">
            Placed on {new Date(order.placedAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="font-semibold text-foreground mb-6">Order Status</h2>
        
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
                      className={`mt-2 text-sm font-medium ${
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
          <p className="mt-4 text-sm text-muted">
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
      </div>

      {/* Order Items */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="font-semibold text-foreground mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-20 h-20 bg-surface-alt rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{item.name}</h3>
                {item.variant && (
                  <p className="text-sm text-muted">{item.variant}</p>
                )}
                <p className="text-sm text-muted">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="text-foreground">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Delivery</span>
            <span className="text-foreground">
              {order.delivery === 0 ? "Free" : formatPrice(order.delivery)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Discount</span>
              <span className="text-primary">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="font-semibold text-foreground mb-4">Delivery Address</h2>
        <div className="text-muted">
          <p className="font-medium text-foreground">{order.deliveryAddress.name}</p>
          <p>{order.deliveryAddress.phone}</p>
          <p>{order.deliveryAddress.address}</p>
          <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
        <p className="text-muted">{order.paymentMethod}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://wa.me/2349066994388?text=${encodeURIComponent(
            `Hi, I need help with order #${order.id}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
        
        {canReturn && (
          <Link
            href={`/account/returns/initiate?orderId=${order.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-btn hover:bg-surface-alt transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Return Item
          </Link>
        )}
      </div>
    </div>
  );
}
