"use client";

import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

// Mock data
const stats = [
  {
    label: "Total Revenue",
    value: "₦12,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Total Orders",
    value: "1,245",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    label: "Total Customers",
    value: "3,890",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Products",
    value: "456",
    change: "-2.4%",
    trend: "down",
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "SG7K9X2M",
    customer: "John Doe",
    email: "john@example.com",
    total: 485000,
    status: "delivered",
    date: "Today, 2:45 PM",
  },
  {
    id: "SG8L3N5P",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 125000,
    status: "shipped",
    date: "Today, 1:30 PM",
  },
  {
    id: "SG2M6Q8R",
    customer: "Michael Brown",
    email: "michael@example.com",
    total: 89000,
    status: "processing",
    date: "Today, 11:15 AM",
  },
  {
    id: "SG4N8T1V",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    total: 245000,
    status: "pending",
    date: "Yesterday, 4:20 PM",
  },
  {
    id: "SG5P9U3W",
    customer: "David Johnson",
    email: "david@example.com",
    total: 75000,
    status: "delivered",
    date: "Yesterday, 2:10 PM",
  },
];

const topProducts = [
  {
    name: "iPhone 15 Pro Max",
    sales: 156,
    revenue: 70200000,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=50&h=50&fit=crop",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    sales: 124,
    revenue: 55800000,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=50&h=50&fit=crop",
  },
  {
    name: "MacBook Pro 16\"",
    sales: 89,
    revenue: 213600000,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=50&h=50&fit=crop",
  },
  {
    name: "AirPods Pro 2",
    sales: 245,
    revenue: 8575000,
    image:
      "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=50&h=50&fit=crop",
  },
];

const statusConfig = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-solo-green bg-solo-green/10 border-solo-green/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  pending: {
    label: "Pending",
    icon: AlertCircle,
    color: "text-solo-muted bg-solo-muted/10 border-solo-muted/20",
  },
};

export default function AdminDashboard() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      notation: price > 1000000 ? "compact" : "standard",
    }).format(price);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-solo-navy tracking-tight">
          System Overview
        </h1>
        <p className="text-solo-muted mt-1 font-medium">Welcome back, Admin! Here&apos;s your daily command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isUp = stat.trend === "up";

          return (
            <div
              key={stat.label}
              className="bg-white rounded-[20px] shadow-xl shadow-solo-navy/[0.03] border border-solo-muted/10 p-6 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-solo-navy/[0.05] transition-all duration-300 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-solo-green/10 rounded-2xl flex items-center justify-center group-hover:bg-solo-green transition-colors duration-300">
                  <Icon className="w-6 h-6 text-solo-green group-hover:text-white transition-colors duration-300" />
                </div>
                <div
                  className={`flex items-center gap-1.5 text-[13px] font-bold px-2.5 py-1 rounded-full ${isUp ? "text-solo-green bg-solo-green/10" : "text-solo-red bg-solo-red/10"
                    }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-extrabold text-solo-navy mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-solo-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-xl shadow-solo-navy/[0.03] border border-solo-muted/10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-solo-muted/10 bg-solo-soft-gray/30">
            <h2 className="text-lg font-bold text-solo-navy">
              Recent Orders
            </h2>
            <a
              href="/admin/orders"
              className="text-sm font-bold text-solo-green hover:text-solo-deep-green flex items-center gap-1 group transition-colors"
            >
              View all
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="overflow-x-auto flex-1 p-2">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">
                    Order ID
                  </th>
                  <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">
                    Customer
                  </th>
                  <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">
                    Status
                  </th>
                  <th className="text-right font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solo-muted/5">
                {recentOrders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;

                  return (
                    <tr key={order.id} className="hover:bg-solo-soft-gray/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-solo-navy group-hover:text-solo-green transition-colors">
                            #{order.id}
                          </p>
                          <p className="text-[11px] font-semibold text-solo-muted mt-0.5">{order.date}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-solo-navy/5 flex items-center justify-center font-bold text-solo-navy text-xs">
                            {order.customer.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-solo-navy">
                              {order.customer}
                            </p>
                            <p className="text-[11px] text-solo-muted font-medium">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-extrabold text-solo-navy">
                          {formatPrice(order.total)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-[24px] shadow-xl shadow-solo-navy/[0.03] border border-solo-muted/10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-solo-muted/10 bg-solo-soft-gray/30">
            <h2 className="text-lg font-bold text-solo-navy">
              Top Performers
            </h2>
            <a
              href="/admin/products"
              className="text-sm font-bold text-solo-green hover:text-solo-deep-green flex items-center gap-1 group transition-colors"
            >
              See catalog
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="divide-y divide-solo-muted/5 p-2">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 p-4 hover:bg-solo-soft-gray/50 rounded-2xl transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-solo-soft-gray flex items-center justify-center text-xs font-bold text-solo-navy group-hover:bg-solo-navy group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-[12px] object-cover shadow-sm border border-solo-muted/10 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-solo-navy truncate group-hover:text-solo-green transition-colors">
                    {product.name}
                  </p>
                  <p className="text-xs font-medium text-solo-muted mt-0.5">{product.sales} units sold</p>
                </div>
                <p className="font-extrabold text-sm text-solo-navy bg-solo-soft-gray px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                  {formatPrice(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Array */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
        {[
          { label: "Add Product", href: "/admin/products/new", icon: Package, desc: "Expand catalog" },
          { label: "View Orders", href: "/admin/orders", icon: ShoppingCart, desc: "Process logistics" },
          { label: "Customers", href: "/admin/customers", icon: Users, desc: "Manage CRM" },
          { label: "Analytics", href: "/admin/analytics", icon: Eye, desc: "Review metrics" },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className="relative bg-white rounded-[20px] shadow-lg shadow-solo-navy/[0.02] border border-solo-muted/10 p-6 flex flex-col items-start gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-solo-green/30 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solo-green/5 rounded-full blur-[20px] group-hover:bg-solo-green/10 transition-colors duration-500" />

              <div className="w-12 h-12 bg-solo-navy text-white rounded-[14px] flex items-center justify-center group-hover:bg-solo-green group-hover:scale-110 transition-all duration-300 shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-bold text-solo-navy mb-1">{action.label}</span>
                <span className="block text-xs font-medium text-solo-muted">{action.desc}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
