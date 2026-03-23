"use client";

import { useState, useEffect } from "react";
import { Star, ShoppingBag, MessageSquare, Users, Gift } from "lucide-react";

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

const mockRewardsData = {
  points: 2450,
  tier: "Gold",
  nextTier: "Platinum",
  pointsToNextTier: 550,
  history: [
    { id: "1", date: "2024-01-15", activity: "Purchase - iPhone 15 Pro", points: 1850, type: "earned" },
    { id: "2", date: "2024-01-10", activity: "Product Review", points: 50, type: "earned" },
    { id: "3", date: "2024-01-05", activity: "Referral Bonus", points: 200, type: "earned" },
    { id: "4", date: "2024-01-01", activity: "New Year Bonus", points: 100, type: "earned" },
    { id: "5", date: "2023-12-28", activity: "Redeemed for Discount", points: -500, type: "redeemed" },
    { id: "6", date: "2023-12-20", activity: "Purchase - AirPods Pro", points: 350, type: "earned" },
  ],
};

const earnMethods = [
  { icon: ShoppingBag, title: "Make a Purchase", description: "₦10,000 spent = 100 points" },
  { icon: MessageSquare, title: "Write a Review", description: "50 points per review" },
  { icon: Users, title: "Refer a Friend", description: "200 points per referral" },
  { icon: Gift, title: "Birthday Week", description: "100 bonus points" },
];

export default function RewardsPage() {
  const [data, setData] = useState(mockRewardsData);
  const [loading, setLoading] = useState(true);
  const [redeemPoints, setRedeemPoints] = useState(500);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const discountValue = Math.floor(redeemPoints / 10);
  const maxRedeemable = Math.floor(data.points / 100) * 100;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-alt rounded animate-pulse w-48" />
        <div className="h-48 bg-surface-alt rounded-card animate-pulse" />
        <div className="h-64 bg-surface-alt rounded-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">SoloRewards</h1>

      {/* Points Display */}
      <div className="bg-primary rounded-card p-8 text-center">
        <div className="w-32 h-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
          <div>
            <Star className="w-10 h-10 text-white mx-auto mb-1" />
            <span className="text-3xl font-bold text-white">{data.points.toLocaleString()}</span>
          </div>
        </div>
        <h2 className="text-white text-xl font-semibold">SoloPoints</h2>
        <p className="text-white/80 text-sm mt-2">
          {data.tier} Member · {data.pointsToNextTier} points to {data.nextTier}
        </p>
        <div className="mt-4 bg-white/20 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${((3000 - data.pointsToNextTier) / 3000) * 100}%` }}
          />
        </div>
      </div>

      {/* How to Earn */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">How to Earn Points</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {earnMethods.map((method) => (
            <div
              key={method.title}
              className="flex items-start gap-3 p-4 bg-surface-alt rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <method.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{method.title}</h3>
                <p className="text-sm text-muted">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redemption Calculator */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Redeem Points</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted mb-2 block">
              Points to redeem (100 points = ₦10)
            </label>
            <input
              type="range"
              min="100"
              max={maxRedeemable}
              step="100"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-sm text-muted mt-1">
              <span>100</span>
              <span>{maxRedeemable.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-accent rounded-lg p-4 text-center">
            <p className="text-accent-foreground">
              Use <span className="font-bold">{redeemPoints.toLocaleString()}</span> points ={" "}
              <span className="font-bold text-primary">{formatPrice(discountValue)}</span> discount
            </p>
          </div>

          <p className="text-sm text-muted text-center">
            Points apply automatically at checkout when you have enough balance.
          </p>
        </div>
      </div>

      {/* Points History */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Points History</h2>
        <div className="space-y-3">
          {data.history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">{item.activity}</p>
                <p className="text-sm text-muted">
                  {new Date(item.date).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  item.type === "earned" ? "text-primary" : "text-destructive"
                }`}
              >
                {item.type === "earned" ? "+" : ""}{item.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
