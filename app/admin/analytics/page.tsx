"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

const revenueData = [
  { date: "Jan 1", revenue: 2450000 },
  { date: "Jan 2", revenue: 1890000 },
  { date: "Jan 3", revenue: 3200000 },
  { date: "Jan 4", revenue: 2780000 },
  { date: "Jan 5", revenue: 4100000 },
  { date: "Jan 6", revenue: 3650000 },
  { date: "Jan 7", revenue: 2900000 },
  { date: "Jan 8", revenue: 3100000 },
  { date: "Jan 9", revenue: 2700000 },
  { date: "Jan 10", revenue: 3400000 },
  { date: "Jan 11", revenue: 2950000 },
  { date: "Jan 12", revenue: 3800000 },
  { date: "Jan 13", revenue: 4200000 },
  { date: "Jan 14", revenue: 3900000 },
];

const topProducts = [
  { name: "iPhone 15 Pro Max 256GB", units: 45, revenue: 83250000 },
  { name: "Samsung Galaxy S24 Ultra", units: 38, revenue: 55100000 },
  { name: "MacBook Air M3", units: 28, revenue: 35000000 },
  { name: "AirPods Pro 2nd Gen", units: 65, revenue: 22750000 },
  { name: "Apple Watch Series 9", units: 42, revenue: 18900000 },
];

const funnelData = [
  { stage: "Visitors", value: 12500, percent: 100 },
  { stage: "Product Views", value: 8750, percent: 70 },
  { stage: "Add to Cart", value: 2625, percent: 21 },
  { stage: "Orders", value: 788, percent: 6.3 },
];

const paymentData = [
  { name: "Card Payment", value: 58, color: "#00C896" },
  { name: "Bank Transfer", value: 22, color: "#1A2B4A" },
  { name: "Tendr BNPL", value: 20, color: "#E63946" },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("7days");

  const periods = [
    { id: "7days", label: "7 days" },
    { id: "30days", label: "30 days" },
    { id: "90days", label: "90 days" },
  ];

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const bnplPercent = paymentData.find((p) => p.name === "Tendr BNPL")?.value || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted">Track your store performance</p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-card p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-foreground">Revenue</h2>
            <p className="text-2xl font-bold text-foreground mt-1">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="flex gap-2">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  period === p.id
                    ? "bg-primary text-white"
                    : "bg-surface-alt text-muted hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) => formatPrice(value)}
                labelStyle={{ color: "#1A2B4A" }}
                contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00C896"
                fill="#00C896"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-card p-6 border border-border">
          <h2 className="font-semibold text-foreground mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 text-sm font-medium text-muted">Product</th>
                  <th className="pb-3 text-sm font-medium text-muted text-right">Units</th>
                  <th className="pb-3 text-sm font-medium text-muted text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 text-foreground">{product.name}</td>
                    <td className="py-3 text-foreground text-right">{product.units}</td>
                    <td className="py-3 text-foreground text-right font-medium">
                      {formatPrice(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-card p-6 border border-border">
          <h2 className="font-semibold text-foreground mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            {funnelData.map((stage, index) => {
              const dropoff = index > 0
                ? ((funnelData[index - 1].value - stage.value) / funnelData[index - 1].value * 100).toFixed(1)
                : null;

              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                    <span className="text-sm text-foreground">
                      {stage.value.toLocaleString()} ({stage.percent}%)
                    </span>
                  </div>
                  <div className="h-8 bg-surface-alt rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${stage.percent}%` }}
                    />
                  </div>
                  {dropoff && (
                    <p className="text-xs text-destructive mt-1">
                      ↓ {dropoff}% drop-off
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-card p-6 border border-border">
        <h2 className="font-semibold text-foreground mb-4">Payment Methods</h2>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="space-y-4">
              {paymentData.map((method) => (
                <div key={method.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: method.color }}
                  />
                  <span className="flex-1 text-foreground">{method.name}</span>
                  <span className="font-semibold text-foreground">{method.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <p className="text-sm text-foreground">
                <strong>{bnplPercent}%</strong> of eligible orders used Tendr BNPL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
