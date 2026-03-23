"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package,
} from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: "SG7K9X2M",
    customer: { name: "John Doe", email: "john@example.com", phone: "+234 801 234 5678" },
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 450000 },
      { name: "AirPods Pro 2", quantity: 1, price: 35000 },
    ],
    total: 485000,
    status: "delivered",
    paymentMethod: "Paystack",
    shippingAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
    date: "2024-03-15T14:45:00",
  },
  {
    id: "SG8L3N5P",
    customer: { name: "Jane Smith", email: "jane@example.com", phone: "+234 802 345 6789" },
    items: [{ name: "Samsung Galaxy Watch 6", quantity: 1, price: 125000 }],
    total: 125000,
    status: "shipped",
    paymentMethod: "Tendr BNPL",
    shippingAddress: "Plot 5, Allen Avenue, Ikeja, Lagos",
    date: "2024-03-10T13:30:00",
    trackingNumber: "GIG12345678",
  },
  {
    id: "SG2M6Q8R",
    customer: { name: "Michael Brown", email: "michael@example.com", phone: "+234 803 456 7890" },
    items: [
      { name: "Anker PowerCore 26800", quantity: 2, price: 25000 },
      { name: "USB-C Hub", quantity: 1, price: 39000 },
    ],
    total: 89000,
    status: "processing",
    paymentMethod: "Paystack",
    shippingAddress: "24 Marine Road, Apapa, Lagos",
    date: "2024-03-05T11:15:00",
  },
  {
    id: "SG4N8T1V",
    customer: { name: "Sarah Wilson", email: "sarah@example.com", phone: "+234 804 567 8901" },
    items: [{ name: "JBL Flip 6", quantity: 1, price: 75000 }],
    total: 75000,
    status: "cancelled",
    paymentMethod: "Bank Transfer",
    shippingAddress: "10 Wuse Zone 5, Abuja",
    date: "2024-02-28T16:20:00",
  },
  {
    id: "SG5P9U3W",
    customer: { name: "David Johnson", email: "david@example.com", phone: "+234 805 678 9012" },
    items: [{ name: "MacBook Pro 14\"", quantity: 1, price: 1200000 }],
    total: 1200000,
    status: "pending",
    paymentMethod: "Tendr BNPL",
    shippingAddress: "8 Victoria Island, Lagos",
    date: "2024-03-14T09:00:00",
  },
  {
    id: "SG6Q1V4X",
    customer: { name: "Emily Davis", email: "emily@example.com", phone: "+234 806 789 0123" },
    items: [
      { name: "iPad Pro 12.9\"", quantity: 1, price: 750000 },
      { name: "Apple Pencil 2", quantity: 1, price: 65000 },
    ],
    total: 815000,
    status: "delivered",
    paymentMethod: "Paystack",
    shippingAddress: "15 GRA, Port Harcourt, Rivers",
    date: "2024-03-12T10:30:00",
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
  pending: {
    label: "Pending",
    icon: Package,
    color: "text-muted bg-muted/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-error bg-error/10",
  },
};

type OrderStatus = keyof typeof statusConfig;

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const itemsPerPage = 10;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    shipped: mockOrders.filter((o) => o.status === "shipped").length,
    delivered: mockOrders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Orders
          </h1>
          <p className="text-muted">Manage and track all orders</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-surface-alt transition-colors">
          <Download className="w-5 h-5" />
          Export Orders
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Orders", value: stats.total, color: "bg-primary" },
          { label: "Pending", value: stats.pending, color: "bg-muted" },
          { label: "Processing", value: stats.processing, color: "bg-warning" },
          { label: "Shipped", value: stats.shipped, color: "bg-primary" },
          { label: "Delivered", value: stats.delivered, color: "bg-success" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-sm text-muted">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Order
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Payment
                </th>
                <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Total
                </th>
                <th className="w-20 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedOrders.map((order) => {
                const status = statusConfig[order.status as OrderStatus];
                const StatusIcon = status.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className="hover:bg-surface-alt cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            #{order.id}
                          </p>
                          <p className="text-sm text-muted">
                            {formatDate(order.date)}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {order.customer.name}
                          </p>
                          <p className="text-sm text-muted">
                            {order.customer.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-foreground">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-semibold text-foreground">
                          {formatPrice(order.total)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <button className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-5 py-4 bg-surface-alt">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                Order Items
                              </h4>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-muted">
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className="text-foreground">
                                      {formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Info */}
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                Shipping Address
                              </h4>
                              <p className="text-sm text-muted">
                                {order.customer.name}
                              </p>
                              <p className="text-sm text-muted">
                                {order.customer.phone}
                              </p>
                              <p className="text-sm text-muted">
                                {order.shippingAddress}
                              </p>
                              {order.trackingNumber && (
                                <p className="text-sm text-primary mt-2">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                Actions
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {order.status === "pending" && (
                                  <button className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                                    Process Order
                                  </button>
                                )}
                                {order.status === "processing" && (
                                  <button className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                                    Mark as Shipped
                                  </button>
                                )}
                                {order.status === "shipped" && (
                                  <button className="px-3 py-1 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90">
                                    Mark as Delivered
                                  </button>
                                )}
                                <button className="px-3 py-1 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-surface">
                                  Print Invoice
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-5 border-t border-border">
          <p className="text-sm text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "border border-border hover:bg-surface-alt text-foreground"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-border rounded-lg hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            No orders found
          </h2>
          <p className="text-muted">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
