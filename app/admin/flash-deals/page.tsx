"use client";

import { useState, useEffect } from "react";
import { Plus, Zap, Eye, ShoppingCart, Package, TrendingUp, Trash2, Edit2 } from "lucide-react";

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

interface FlashDeal {
  id: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  discountPercent: number;
  startDate: string;
  endDate: string;
  views: number;
  addToCart: number;
  orders: number;
  isActive: boolean;
}

const mockDeals: FlashDeal[] = [
  {
    id: "1",
    productName: "iPhone 15 Pro Max 256GB",
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
    originalPrice: 1850000,
    discountPercent: 15,
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-01-20T23:59:59Z",
    views: 2450,
    addToCart: 189,
    orders: 45,
    isActive: true,
  },
  {
    id: "2",
    productName: "Samsung Galaxy S24 Ultra",
    productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200",
    originalPrice: 1450000,
    discountPercent: 20,
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-01-20T23:59:59Z",
    views: 1890,
    addToCart: 156,
    orders: 38,
    isActive: true,
  },
  {
    id: "3",
    productName: "MacBook Air M3",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
    originalPrice: 1250000,
    discountPercent: 10,
    startDate: "2024-01-10T00:00:00Z",
    endDate: "2024-01-15T23:59:59Z",
    views: 3200,
    addToCart: 245,
    orders: 62,
    isActive: false,
  },
];

function getTimeLeft(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export default function AdminFlashDealsPage() {
  const [deals, setDeals] = useState<FlashDeal[]>(mockDeals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [timeLeftMap, setTimeLeftMap] = useState<Record<string, ReturnType<typeof getTimeLeft>>>({});

  useEffect(() => {
    const updateTimers = () => {
      const newMap: Record<string, ReturnType<typeof getTimeLeft>> = {};
      deals.forEach((deal) => {
        if (deal.isActive) {
          newMap[deal.id] = getTimeLeft(deal.endDate);
        }
      });
      setTimeLeftMap(newMap);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [deals]);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this flash deal?")) {
      setDeals(deals.filter((d) => d.id !== id));
    }
  };

  const activeDeals = deals.filter((d) => d.isActive);
  const endedDeals = deals.filter((d) => !d.isActive);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flash Deals</h1>
          <p className="text-muted">Manage time-limited promotions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-btn hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Flash Deal
        </button>
      </div>

      {/* Active Deals */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-destructive" />
          Active Deals ({activeDeals.length})
        </h2>
        {activeDeals.length > 0 ? (
          <div className="space-y-4">
            {activeDeals.map((deal) => {
              const timeLeft = timeLeftMap[deal.id];
              const salePrice = deal.originalPrice * (1 - deal.discountPercent / 100);
              const conversion = deal.views > 0 ? ((deal.orders / deal.views) * 100).toFixed(1) : "0";

              return (
                <div key={deal.id} className="bg-white rounded-card p-6 border border-border">
                  <div className="flex gap-6">
                    <img
                      src={deal.productImage}
                      alt={deal.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{deal.productName}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-lg font-bold text-primary">{formatPrice(salePrice)}</span>
                            <span className="text-muted line-through">{formatPrice(deal.originalPrice)}</span>
                            <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                              {deal.discountPercent}% OFF
                            </span>
                          </div>
                        </div>
                        {timeLeft && (
                          <div className="text-right">
                            <p className="text-xs text-muted mb-1">Ends in</p>
                            <div className="flex gap-1 font-mono text-lg font-bold text-destructive">
                              <span>{formatTime(timeLeft.hours)}</span>:
                              <span>{formatTime(timeLeft.minutes)}</span>:
                              <span>{formatTime(timeLeft.seconds)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted" />
                          <span className="text-sm"><strong>{deal.views.toLocaleString()}</strong> views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-muted" />
                          <span className="text-sm"><strong>{deal.addToCart}</strong> add to cart</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted" />
                          <span className="text-sm"><strong>{deal.orders}</strong> orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted" />
                          <span className="text-sm"><strong>{conversion}%</strong> conversion</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="p-2 text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-alt rounded-card p-8 text-center">
            <Zap className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">No active flash deals</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Create your first flash deal
            </button>
          </div>
        )}
      </div>

      {/* Ended Deals */}
      {endedDeals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ended Deals ({endedDeals.length})
          </h2>
          <div className="bg-white rounded-card border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-alt border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Discount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Duration</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Views</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Orders</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {endedDeals.map((deal) => {
                  const conversion = deal.views > 0 ? ((deal.orders / deal.views) * 100).toFixed(1) : "0";
                  return (
                    <tr key={deal.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={deal.productImage}
                            alt={deal.productName}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="font-medium text-foreground">{deal.productName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{deal.discountPercent}%</td>
                      <td className="p-4 text-muted text-sm">
                        {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-foreground">{deal.views.toLocaleString()}</td>
                      <td className="p-4 text-foreground">{deal.orders}</td>
                      <td className="p-4 text-foreground">{conversion}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold text-foreground mb-4">Create Flash Deal</h2>
            <p className="text-muted mb-6">Configure your flash deal settings.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Product</label>
                <select className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt">
                  <option>iPhone 15 Pro Max 256GB</option>
                  <option>Samsung Galaxy S24 Ultra</option>
                  <option>MacBook Air M3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Discount %</label>
                <input type="number" className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt" placeholder="15" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start</label>
                  <input type="datetime-local" className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End</label>
                  <input type="datetime-local" className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-border text-foreground rounded-btn hover:bg-surface-alt"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-btn hover:bg-primary-hover"
              >
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
