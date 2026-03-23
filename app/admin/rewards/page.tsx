"use client";

import { useState } from "react";
import { Save, Star, Gift, Users, ShoppingBag } from "lucide-react";

export default function AdminRewardsPage() {
  const [pointsPerSpend, setPointsPerSpend] = useState("100");
  const [spendAmount, setSpendAmount] = useState("10000");
  const [reviewPoints, setReviewPoints] = useState("50");
  const [referralPoints, setReferralPoints] = useState("200");
  const [birthdayPoints, setBirthdayPoints] = useState("100");
  const [pointsToNaira, setPointsToNaira] = useState("10");
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const stats = [
    { label: "Total Members", value: "2,450", icon: Users },
    { label: "Points Issued", value: "1.2M", icon: Star },
    { label: "Points Redeemed", value: "450K", icon: Gift },
    { label: "Redemption Value", value: "₦45,000", icon: ShoppingBag },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">SoloRewards</h1>
        <p className="text-muted mt-1">Configure your loyalty program</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-card p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Earning Rules */}
      <div className="bg-white rounded-card p-6 border border-border space-y-4 max-w-2xl">
        <h2 className="font-semibold text-foreground">Earning Rules</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Points earned per purchase
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted">₦</span>
                <input
                  type="number"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  className="w-24 px-3 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted">=</span>
                <input
                  type="number"
                  value={pointsPerSpend}
                  onChange={(e) => setPointsPerSpend(e.target.value)}
                  className="w-24 px-3 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted">points</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Review
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={reviewPoints}
                  onChange={(e) => setReviewPoints(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted text-sm">points</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Referral Bonus
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={referralPoints}
                  onChange={(e) => setReferralPoints(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted text-sm">points</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Birthday Bonus
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={birthdayPoints}
                  onChange={(e) => setBirthdayPoints(e.target.value)}
                  className="w-20 px-3 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted text-sm">points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Rules */}
      <div className="bg-white rounded-card p-6 border border-border space-y-4 max-w-2xl">
        <h2 className="font-semibold text-foreground">Redemption Rules</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Points to Naira conversion
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted">10 points =</span>
            <span className="text-muted">₦</span>
            <input
              type="number"
              value={pointsToNaira}
              onChange={(e) => setPointsToNaira(e.target.value)}
              className="w-20 px-3 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-sm text-muted mt-2">
            Customers can redeem 100 points for ₦{Number(pointsToNaira) * 10} discount
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
