"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  ChevronRight,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";

// Mock recent orders
const recentOrders = [
  {
    id: "SG7K9X2M",
    date: "Mar 15, 2024",
    status: "delivered",
    total: 485000,
    items: 2,
  },
  {
    id: "SG8L3N5P",
    date: "Mar 10, 2024",
    status: "shipped",
    total: 125000,
    items: 1,
  },
  {
    id: "SG2M6Q8R",
    date: "Mar 5, 2024",
    status: "processing",
    total: 89000,
    items: 3,
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
};

export default function AccountDashboard() {
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const quickLinks = [
    {
      href: "/account/orders",
      label: "My Orders",
      description: "Track, return, or buy again",
      icon: Package,
      count: recentOrders.length,
    },
    {
      href: "/account/wishlist",
      label: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      count: wishlistItems.length,
    },
    {
      href: "/account/addresses",
      label: "Addresses",
      description: "Manage delivery addresses",
      icon: MapPin,
      count: 2,
    },
    {
      href: "/account/payment-methods",
      label: "Payment Methods",
      description: "Manage payment options",
      icon: CreditCard,
      count: 1,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white">
        <h2 className="text-2xl font-heading font-bold mb-2">
          Hello, {user?.name?.split(" ")[0]}!
        </h2>
        <p className="text-white/80">
          From your account dashboard you can view your recent orders, manage
          your shipping addresses, and edit your account details.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-surface rounded-xl border border-border p-5 hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-sm text-muted">{link.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {link.count > 0 && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {link.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-5 hover:bg-surface-alt transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-alt rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-muted">
                        {order.date} · {order.items} item
                        {order.items > 1 ? "s" : ""}
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
                    <ChevronRight className="w-5 h-5 text-muted" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No orders yet</p>
            <Link
              href="/shop/all"
              className="inline-block mt-4 text-primary hover:underline"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Account Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted mb-1">Full Name</p>
            <p className="font-medium text-foreground">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Email Address</p>
            <p className="font-medium text-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Phone Number</p>
            <p className="font-medium text-foreground">
              {user?.phone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Member Since</p>
            <p className="font-medium text-foreground">March 2024</p>
          </div>
        </div>
        <Link
          href="/account/settings"
          className="inline-block mt-4 text-sm text-primary hover:underline"
        >
          Edit account details
        </Link>
      </div>
    </div>
  );
}
