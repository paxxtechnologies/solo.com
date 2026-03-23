"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MessageCircle, Printer, Save, Package, CheckCircle, Truck, Home, Clock } from "lucide-react";

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

const statuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusSteps = [
  { key: "pending", label: "Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const getStatusIndex = (status: string) => {
  const statusMap: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    packed: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  };
  return statusMap[status.toLowerCase()] ?? 0;
};

const mockOrder = {
  id: "SC-2024-001234",
  status: "Shipped",
  placedAt: "2024-01-15T10:30:00Z",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    whatsapp: "+234 906 699 4388",
  },
  items: [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      variant: "256GB - Natural Titanium",
      sku: "IPH15PM-256-NT",
      price: 1850000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
    },
    {
      id: "2",
      name: "Apple 20W USB-C Charger",
      variant: null,
      sku: "APL-CHG-20W",
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
  paymentStatus: "Paid",
  deliveryAddress: {
    name: "John Doe",
    phone: "+234 906 699 4388",
    address: "15 Independence Layout",
    city: "Enugu",
    state: "Enugu State",
  },
  trackingNumber: "NG123456789",
  carrier: "GIG Logistics",
  notes: [],
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(mockOrder);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(mockOrder.status);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setOrder({ ...mockOrder, id: params.orderId as string });
      setLoading(false);
    }, 500);
  }, [params.orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    const confirmMessage = newStatus === "Shipped"
      ? "Changing status to 'Shipped' will automatically notify the customer via WhatsApp. Continue?"
      : `Change order status to '${newStatus}'?`;

    if (!confirm(confirmMessage)) return;

    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setStatus(newStatus);
      setOrder({ ...order, status: newStatus });
      setSaving(false);
    }, 500);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setNewNote("");
      setSaving(false);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStatusIndex = getStatusIndex(order.status);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-surface-alt rounded animate-pulse w-48" />
        <div className="h-64 bg-surface-alt rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
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
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-btn hover:bg-surface-alt transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Updater */}
          <div className="bg-white rounded-card p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Order Status</h2>
            <div className="flex items-center gap-4">
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {saving && <span className="text-muted text-sm">Saving...</span>}
            </div>

            {/* Timeline */}
            {order.status.toLowerCase() !== "cancelled" && (
              <div className="mt-6 relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-alt">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-primary text-white" : "bg-surface-alt text-muted"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`mt-2 text-xs font-medium ${isCompleted ? "text-foreground" : "text-muted"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-card p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-surface-alt rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    {item.variant && <p className="text-sm text-muted">{item.variant}</p>}
                    <p className="text-xs text-muted">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-muted">Qty: {item.quantity}</p>
                  </div>
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
                <span className="text-foreground">{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span>
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

          {/* Internal Notes */}
          <div className="bg-white rounded-card p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Internal Notes</h2>
            <div className="flex gap-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note (visible to admin only)"
                rows={3}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={saving || !newNote.trim()}
                className="px-4 py-2 bg-primary text-white font-medium rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50 self-end"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-card p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Customer</h2>
            <div className="space-y-2">
              <p className="font-medium text-foreground">{order.customer.name}</p>
              <p className="text-sm text-muted">{order.customer.email}</p>
              <a
                href={`https://wa.me/${order.customer.whatsapp.replace(/\s/g, "").replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                {order.customer.whatsapp}
              </a>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-card p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Delivery Address</h2>
            <div className="text-muted text-sm space-y-1">
              <p className="font-medium text-foreground">{order.deliveryAddress.name}</p>
              <p>{order.deliveryAddress.phone}</p>
              <p>{order.deliveryAddress.address}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-card p-6 border border-border">
            <h2 className="font-semibold text-foreground mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Method</span>
                <span className="text-foreground">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-primary font-medium">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.trackingNumber && (
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Shipping</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Carrier</span>
                  <span className="text-foreground">{order.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tracking</span>
                  <span className="text-foreground font-mono">{order.trackingNumber}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
