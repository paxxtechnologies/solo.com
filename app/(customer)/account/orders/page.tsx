"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  Truck,
  Clock,
  CheckCircle,
  Search,
  Filter,
  XCircle,
} from "lucide-react";

// Mock orders data
const allOrders = [
  {
    id: "SG7K9X2M",
    date: "Mar 15, 2024",
    status: "delivered",
    total: 485000,
    items: [
      {
        name: "iPhone 15 Pro Max",
        quantity: 1,
        price: 450000,
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
      },
      {
        name: "AirPods Pro 2",
        quantity: 1,
        price: 35000,
        image:
          "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=100&h=100&fit=crop",
      },
    ],
    shippingAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
  },
  {
    id: "SG8L3N5P",
    date: "Mar 10, 2024",
    status: "shipped",
    total: 125000,
    items: [
      {
        name: "Samsung Galaxy Watch 6",
        quantity: 1,
        price: 125000,
        image:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100&h=100&fit=crop",
      },
    ],
    shippingAddress: "Plot 5, Allen Avenue, Ikeja, Lagos",
    trackingNumber: "GIG12345678",
  },
  {
    id: "SG2M6Q8R",
    date: "Mar 5, 2024",
    status: "processing",
    total: 89000,
    items: [
      {
        name: "Anker PowerCore 26800",
        quantity: 2,
        price: 25000,
        image:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop",
      },
      {
        name: "USB-C Hub",
        quantity: 1,
        price: 39000,
        image:
          "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=100&h=100&fit=crop",
      },
    ],
    shippingAddress: "24 Marine Road, Apapa, Lagos",
  },
  {
    id: "SG4N8T1V",
    date: "Feb 28, 2024",
    status: "cancelled",
    total: 75000,
    items: [
      {
        name: "JBL Flip 6",
        quantity: 1,
        price: 75000,
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop",
      },
    ],
    shippingAddress: "10 Wuse Zone 5, Abuja",
  },
];

const statusConfig = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-success bg-success/10",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-primary bg-primary/10",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-warning bg-warning/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-error bg-error/10",
  },
};

type OrderStatus = keyof typeof statusConfig;

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          My Orders
        </h1>
        <p className="text-muted">Track, return, or buy again</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search orders by ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as OrderStatus | "all")
            }
            className="pl-12 pr-10 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as OrderStatus];
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-surface rounded-xl border border-border overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-alt transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-alt rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-muted">
                        {order.date} · {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-muted transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Order Details */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Items */}
                    <div className="p-5 space-y-4">
                      <h3 className="font-medium text-foreground">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {item.name}
                              </p>
                              <p className="text-sm text-muted">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-foreground">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="px-5 pb-5 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-5">
                      <div>
                        <p className="text-sm text-muted mb-1">
                          Shipping Address
                        </p>
                        <p className="text-foreground">
                          {order.shippingAddress}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-primary mt-1">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {order.status === "delivered" && (
                          <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                            Buy Again
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                            Track Package
                          </button>
                        )}
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-surface-alt transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Package className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            No orders found
          </h2>
          <p className="text-muted mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter"
              : "You haven't placed any orders yet"}
          </p>
          <Link
            href="/shop/all"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
