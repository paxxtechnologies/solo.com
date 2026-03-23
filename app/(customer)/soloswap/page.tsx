"use client";

import { useState } from "react";
import { Smartphone, ClipboardCheck, Banknote, ChevronRight, MapPin, Phone } from "lucide-react";

const brands = ["Samsung", "Apple", "Tecno", "Infinix", "HP", "Lenovo", "Other"];

const conditions = [
  {
    id: "excellent",
    label: "Excellent",
    description: "Like new, no scratches or damage, fully functional",
    multiplier: 1.0,
  },
  {
    id: "good",
    label: "Good",
    description: "Minor wear, small scratches, fully functional",
    multiplier: 0.8,
  },
  {
    id: "fair",
    label: "Fair",
    description: "Visible wear, some scratches/dents, fully functional",
    multiplier: 0.6,
  },
  {
    id: "poor",
    label: "Poor",
    description: "Heavy wear, cracks or damage, may have issues",
    multiplier: 0.3,
  },
];

const stores = [
  {
    name: "Enugu Store",
    address: "15 Ogui Road, Enugu",
    phone: "0906 699 4388",
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
    mapUrl: "https://maps.google.com/?q=Enugu+Nigeria",
  },
  {
    name: "Abakiliki Store",
    address: "23 Afikpo Road, Abakiliki",
    phone: "0906 703 2849",
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
    mapUrl: "https://maps.google.com/?q=Abakiliki+Nigeria",
  },
];

// Mock model data
const modelsByBrand: Record<string, string[]> = {
  Samsung: ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy A54", "Galaxy A34", "Galaxy Z Fold 5"],
  Apple: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14", "iPhone 13", "iPhone 12"],
  Tecno: ["Camon 20 Pro", "Camon 20", "Phantom X2", "Spark 10 Pro", "Pova 5"],
  Infinix: ["Note 30 Pro", "Note 30", "Zero 30", "Hot 30", "Smart 8"],
  HP: ["Pavilion 15", "Envy x360", "EliteBook 840", "ProBook 450", "Spectre x360"],
  Lenovo: ["ThinkPad X1 Carbon", "IdeaPad 5", "Legion 5", "Yoga 9i", "ThinkBook 14"],
  Other: [],
};

// Mock base values
const baseValues: Record<string, number> = {
  "Galaxy S24 Ultra": 450000,
  "Galaxy S24+": 350000,
  "Galaxy S24": 280000,
  "iPhone 15 Pro Max": 650000,
  "iPhone 15 Pro": 550000,
  "iPhone 15": 420000,
  "iPhone 14 Pro Max": 480000,
  "ThinkPad X1 Carbon": 320000,
  "Legion 5": 280000,
};

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

export default function SoloSwapPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [valuation, setValuation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const models = brand ? modelsByBrand[brand] || [] : [];

  const calculateValuation = () => {
    if (!brand || !model || !condition) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const baseValue = baseValues[model] || 100000;
      const conditionData = conditions.find((c) => c.id === condition);
      const multiplier = conditionData?.multiplier || 0.5;
      setValuation(Math.round(baseValue * multiplier));
      setLoading(false);
    }, 1000);
  };

  const canCalculate = brand && model && condition;

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Trade in your old device. Get instant store credit.
            </h1>
            <p className="text-white/70 text-lg">
              Turn your old phone, laptop, or tablet into credit towards your next Solo purchase.
              Fast, fair, and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 bg-surface-alt rounded-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step 1</span>
                <h3 className="font-semibold text-foreground mt-1">Select Your Device</h3>
                <p className="text-sm text-muted mt-1">Choose your brand and model</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-surface-alt rounded-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step 2</span>
                <h3 className="font-semibold text-foreground mt-1">Describe Condition</h3>
                <p className="text-sm text-muted mt-1">Tell us about your device{"'"}s condition</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-surface-alt rounded-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step 3</span>
                <h3 className="font-semibold text-foreground mt-1">Get Your Offer</h3>
                <p className="text-sm text-muted mt-1">Instant valuation for store credit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Trade-In Calculator
            </h2>

            <div className="bg-white rounded-card p-6 lg:p-8 border border-border space-y-6">
              {/* Brand Select */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel("");
                    setValuation(null);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Model Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Model
                </label>
                {brand === "Other" ? (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setValuation(null);
                    }}
                    placeholder="Enter your device model"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <select
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setValuation(null);
                    }}
                    disabled={!brand}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="">Select model</option>
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Condition
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {conditions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCondition(c.id);
                        setValuation(null);
                      }}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        condition === c.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="font-medium text-foreground">{c.label}</span>
                      <p className="text-xs text-muted mt-1">{c.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateValuation}
                disabled={!canCalculate || loading}
                className="w-full py-4 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Calculating..." : "Get Valuation"}
              </button>

              {/* Result */}
              {valuation !== null && (
                <div className="bg-primary/10 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted mb-2">Your estimated trade-in value</p>
                  <p className="text-3xl font-bold text-primary">{formatPrice(valuation)}</p>
                  <p className="text-foreground mt-2">
                    {model} in {conditions.find((c) => c.id === condition)?.label} condition
                  </p>
                  <p className="text-sm text-muted mt-4">
                    This is an estimate. Final value will be determined after inspection at our store.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-4">
            Complete Your Trade-In
          </h2>
          <p className="text-muted text-center mb-8 max-w-xl mx-auto">
            Bring your device to our Enugu or Abakiliki store to complete your trade-in and receive your store credit.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <div
                key={store.name}
                className="bg-surface-alt rounded-card p-6 border-l-4 border-l-primary"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{store.name}</h3>
                <div className="space-y-2 text-muted">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  <p className="text-sm">{store.hours}</p>
                </div>
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary font-medium mt-4 hover:underline"
                >
                  Get Directions
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
