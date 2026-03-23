"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Share2, Lock, Gift, Shield, Headphones } from "lucide-react";

const mockReferralData = {
  referralCode: "JOHN2024",
  referralLink: "https://solo.com.bz/r/JOHN2024",
  referredCount: 7,
  pendingRewards: 2,
  totalEarned: 1400,
};

const rewardTiers = [
  {
    referrals: 3,
    reward: "Free Screen Protector",
    icon: Shield,
    value: "₦3,000",
  },
  {
    referrals: 10,
    reward: "₦5,000 Store Credit",
    icon: Gift,
    value: "₦5,000",
  },
  {
    referrals: 25,
    reward: "Premium Accessory",
    icon: Headphones,
    value: "₦15,000",
  },
];

export default function ReferralPage() {
  const [data, setData] = useState(mockReferralData);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = `Check out Solo.com — the best gadget deals in South East Nigeria. Use my link for a discount on your first order: ${data.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-alt rounded animate-pulse w-48" />
        <div className="h-48 bg-surface-alt rounded-card animate-pulse" />
        <div className="h-64 bg-surface-alt rounded-card animate-pulse" />
      </div>
    );
  }

  const nextTierIndex = rewardTiers.findIndex((tier) => tier.referrals > data.referredCount);
  const nextTier = nextTierIndex >= 0 ? rewardTiers[nextTierIndex] : null;
  const remaining = nextTier ? nextTier.referrals - data.referredCount : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Refer a Friend</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background rounded-card p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">{data.referredCount}</p>
          <p className="text-sm text-muted">Friends Referred</p>
        </div>
        <div className="bg-background rounded-card p-4 border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{data.pendingRewards}</p>
          <p className="text-sm text-muted">Pending</p>
        </div>
        <div className="bg-background rounded-card p-4 border border-border text-center">
          <p className="text-2xl font-bold text-foreground">₦{data.totalEarned.toLocaleString()}</p>
          <p className="text-sm text-muted">Total Earned</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Referral Link</h2>
        <div className="flex gap-2">
          <div className="flex-1 bg-surface-alt rounded-lg px-4 py-3 font-mono text-sm text-foreground truncate">
            {data.referralLink}
          </div>
          <button
            onClick={copyToClipboard}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              copied
                ? "bg-primary text-white"
                : "bg-surface-alt text-foreground hover:bg-primary hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        <button
          onClick={shareOnWhatsApp}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-btn hover:bg-[#1DA851] transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share on WhatsApp
        </button>
      </div>

      {/* Progress */}
      {nextTier && (
        <div className="bg-accent rounded-card p-6">
          <p className="text-accent-foreground text-center">
            {"You've referred "}
            <span className="font-bold">{data.referredCount}</span> friends.{" "}
            Get <span className="font-bold">{remaining}</span> more to unlock your{" "}
            <span className="font-bold text-primary">{nextTier.reward}</span>!
          </p>
          <div className="mt-4 bg-white/50 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(data.referredCount / nextTier.referrals) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Reward Tiers */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Reward Tiers</h2>
        <div className="space-y-4">
          {rewardTiers.map((tier) => {
            const achieved = data.referredCount >= tier.referrals;
            const Icon = tier.icon;

            return (
              <div
                key={tier.referrals}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  achieved
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface-alt"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achieved ? "bg-primary text-white" : "bg-muted/20 text-muted"
                  }`}
                >
                  {achieved ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${achieved ? "text-primary" : "text-muted"}`} />
                    <h3 className={`font-medium ${achieved ? "text-foreground" : "text-muted"}`}>
                      {tier.reward}
                    </h3>
                  </div>
                  <p className="text-sm text-muted">
                    {tier.referrals} referrals · Value: {tier.value}
                  </p>
                </div>
                {achieved && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-background rounded-card p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">How It Works</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
              1
            </span>
            <span className="text-muted">Share your unique referral link with friends</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
              2
            </span>
            <span className="text-muted">They get a discount on their first order</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
              3
            </span>
            <span className="text-muted">You earn 200 SoloPoints when they complete a purchase</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
              4
            </span>
            <span className="text-muted">Unlock rewards as you reach referral milestones</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
