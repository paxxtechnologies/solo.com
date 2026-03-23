"use client";

import { useState } from "react";
import { Save, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("Solo.com");
  const [storeEmail, setStoreEmail] = useState("hello@solo.com.bz");
  const [supportWhatsapp, setSupportWhatsapp] = useState("+234 906 699 4388");
  const [currency, setCurrency] = useState("NGN");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  
  const [orderPrefix, setOrderPrefix] = useState("SC");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("20000");
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-1">Configure your store settings</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-card p-6 border border-border space-y-4">
        <h2 className="font-semibold text-foreground">General</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Store Email</label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Support WhatsApp</label>
            <input
              type="text"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Settings */}
      <div className="bg-white rounded-card p-6 border border-border space-y-4">
        <h2 className="font-semibold text-foreground">Orders</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Order Number Prefix</label>
            <input
              type="text"
              value={orderPrefix}
              onChange={(e) => setOrderPrefix(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted mt-1">Example: {orderPrefix}-2024-001234</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="NGN">Nigerian Naira (₦)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Settings */}
      <div className="bg-white rounded-card p-6 border border-border space-y-4">
        <h2 className="font-semibold text-foreground">Inventory</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted mt-1">Show alert when stock falls to this level</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Free Delivery Threshold (₦)
            </label>
            <input
              type="number"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted mt-1">Free delivery for orders above this amount</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-card p-6 border border-destructive/30 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="font-semibold text-foreground">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Clear All Data</p>
            <p className="text-sm text-muted">
              Delete all products, orders, and customer data. This cannot be undone.
            </p>
          </div>
          <button className="px-4 py-2 bg-destructive text-white font-medium rounded-btn hover:bg-destructive/90">
            Clear Data
          </button>
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
