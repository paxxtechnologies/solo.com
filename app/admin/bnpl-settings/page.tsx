"use client";

import { useState } from "react";
import { Save, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function BnplSettingsPage() {
  const [merchantId, setMerchantId] = useState("TENDR_MERCHANT_••••••");
  const [apiKey, setApiKey] = useState("sk_live_••••••••••••••••");
  const [showMerchantId, setShowMerchantId] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [minCartValue, setMinCartValue] = useState("25000");
  const [plans, setPlans] = useState({
    threeMonth: true,
    sixMonth: true,
    twelveMonth: false,
  });
  const [testMode, setTestMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">BNPL Settings</h1>
        <p className="text-muted mt-1">Configure Buy Now Pay Later integration with Tendr</p>
      </div>

      {/* Info Banner */}
      <div className="bg-accent rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground">
            Payments via BNPL are processed by Tendr. Configure your Tendr merchant settings below.
          </p>
          <a
            href="https://tendr.ng/merchants"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-1 inline-block"
          >
            Visit Tendr Merchant Dashboard
          </a>
        </div>
      </div>

      <div className="bg-white rounded-card p-6 border border-border space-y-6">
        {/* Credentials */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">API Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tendr Merchant ID
              </label>
              <div className="relative">
                <input
                  type={showMerchantId ? "text" : "password"}
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-surface-alt text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowMerchantId(!showMerchantId)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showMerchantId ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tendr API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-surface-alt text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Eligibility Settings</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum cart value for BNPL eligibility (₦)
            </label>
            <input
              type="number"
              value={minCartValue}
              onChange={(e) => setMinCartValue(e.target.value)}
              className="w-full max-w-xs px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted mt-2">
              Customers can use BNPL when their cart total reaches this amount.
            </p>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Available Plans</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-surface-alt rounded-lg cursor-pointer">
              <div>
                <span className="font-medium text-foreground">3-Month Plan</span>
                <p className="text-sm text-muted">Split payment into 3 monthly instalments</p>
              </div>
              <input
                type="checkbox"
                checked={plans.threeMonth}
                onChange={(e) => setPlans({ ...plans, threeMonth: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-surface-alt rounded-lg cursor-pointer">
              <div>
                <span className="font-medium text-foreground">6-Month Plan</span>
                <p className="text-sm text-muted">Split payment into 6 monthly instalments</p>
              </div>
              <input
                type="checkbox"
                checked={plans.sixMonth}
                onChange={(e) => setPlans({ ...plans, sixMonth: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-surface-alt rounded-lg cursor-pointer">
              <div>
                <span className="font-medium text-foreground">12-Month Plan</span>
                <p className="text-sm text-muted">Split payment into 12 monthly instalments</p>
              </div>
              <input
                type="checkbox"
                checked={plans.twelveMonth}
                onChange={(e) => setPlans({ ...plans, twelveMonth: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* Test Mode */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Environment</h2>
          <label className="flex items-center justify-between p-4 bg-surface-alt rounded-lg cursor-pointer">
            <div>
              <span className="font-medium text-foreground">Test Mode</span>
              <p className="text-sm text-muted">
                When enabled, all Tendr API calls go to sandbox environment
              </p>
            </div>
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
          </label>
          {testMode && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Test mode is enabled. No real payments will be processed.
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div>
            {saved && (
              <span className="text-primary text-sm font-medium">Settings saved successfully!</span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
