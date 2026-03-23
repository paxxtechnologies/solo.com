"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

// Mock customers data
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 801 234 5678",
    totalOrders: 15,
    totalSpent: 2450000,
    lastOrder: "2024-03-15",
    status: "active",
    joinedDate: "2023-06-15",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234 802 345 6789",
    totalOrders: 8,
    totalSpent: 980000,
    lastOrder: "2024-03-10",
    status: "active",
    joinedDate: "2023-09-22",
    avatar: "JS",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+234 803 456 7890",
    totalOrders: 3,
    totalSpent: 267000,
    lastOrder: "2024-03-05",
    status: "active",
    joinedDate: "2024-01-10",
    avatar: "MB",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+234 804 567 8901",
    totalOrders: 1,
    totalSpent: 75000,
    lastOrder: "2024-02-28",
    status: "inactive",
    joinedDate: "2024-02-20",
    avatar: "SW",
  },
  {
    id: "5",
    name: "David Johnson",
    email: "david@example.com",
    phone: "+234 805 678 9012",
    totalOrders: 22,
    totalSpent: 5600000,
    lastOrder: "2024-03-14",
    status: "vip",
    joinedDate: "2022-11-05",
    avatar: "DJ",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+234 806 789 0123",
    totalOrders: 12,
    totalSpent: 1850000,
    lastOrder: "2024-03-12",
    status: "active",
    joinedDate: "2023-04-18",
    avatar: "ED",
  },
];

const statusConfig = {
  active: { label: "Active", color: "text-success bg-success/10" },
  inactive: { label: "Inactive", color: "text-muted bg-muted/10" },
  vip: { label: "VIP", color: "text-warning bg-warning/10" },
};

type CustomerStatus = keyof typeof statusConfig;

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      notation: price > 1000000 ? "compact" : "standard",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalCustomers = mockCustomers.length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Customers
          </h1>
          <p className="text-muted">Manage your customer database</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-surface-alt transition-colors">
          <Download className="w-5 h-5" />
          Export Customers
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: totalCustomers.toLocaleString(), icon: Users, color: "text-primary" },
          { label: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-success" },
          { label: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, color: "text-warning" },
          { label: "Avg Order Value", value: formatPrice(avgOrderValue), icon: TrendingUp, color: "text-accent" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-surface rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-muted">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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
              setStatusFilter(e.target.value as CustomerStatus | "all")
            }
            className="pl-12 pr-10 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Orders
                </th>
                <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Total Spent
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                  Last Order
                </th>
                <th className="w-24 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCustomers.map((customer) => {
                const status = statusConfig[customer.status as CustomerStatus];

                return (
                  <tr key={customer.id} className="hover:bg-surface-alt">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {customer.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {customer.name}
                          </p>
                          <p className="text-sm text-muted">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-medium text-foreground">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-semibold text-foreground">
                        {formatPrice(customer.totalSpent)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted">
                        {formatDate(customer.lastOrder)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-5 border-t border-border">
          <p className="text-sm text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} customers
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
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
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
      {filteredCustomers.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Users className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            No customers found
          </h2>
          <p className="text-muted">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
