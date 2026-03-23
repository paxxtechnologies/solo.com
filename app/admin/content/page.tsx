"use client";

import { useState } from "react";
import { Save, Plus, Trash2, GripVertical, Upload, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  date: string;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);

  // Hero content
  const [heroHeadline, setHeroHeadline] = useState("We have something for you");
  const [heroSubheadline, setHeroSubheadline] = useState("Different specs. Flexible payment. Speedy delivery. Quality assured.");
  const [heroPrimaryCta, setHeroPrimaryCta] = useState("Shop Now");
  const [heroPrimaryUrl, setHeroPrimaryUrl] = useState("/shop/all");
  const [heroSecondaryCta, setHeroSecondaryCta] = useState("Pay in Instalments");

  // Announcements
  const [announcements, setAnnouncements] = useState([
    "Free delivery on orders above ₦20,000 — Enugu & Abakiliki same day",
    "Buy now, pay later from ₦5,000/month — powered by Tendr",
    "Trade in your old phone for instant store credit — SoloSwap",
    "Number 1 Gadget Hub · 0906 699 4388 · 0906 703 2849 · @sololinks042",
  ]);

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: "1", name: "Chidi Okafor", city: "Enugu", rating: 5, quote: "Best gadget store in the South East! Got my iPhone delivered same day.", date: "2024-01-15" },
    { id: "2", name: "Amaka Eze", city: "Abakiliki", rating: 5, quote: "The Tendr payment option made it so easy to get my dream laptop.", date: "2024-01-10" },
  ]);

  // Store Info
  const [enuguAddress, setEnuguAddress] = useState("15 Ogui Road, Independence Layout, Enugu");
  const [enuguPhone1, setEnuguPhone1] = useState("0906 699 4388");
  const [enuguPhone2, setEnuguPhone2] = useState("0906 703 2849");
  const [enuguHours, setEnuguHours] = useState("Mon-Sat: 8AM-7PM · Sun: 10AM-5PM");
  const [enuguMapUrl, setEnuguMapUrl] = useState("https://maps.google.com/?q=15+Ogui+Road+Enugu+Nigeria");

  const [abakalikiAddress, setAbakalikiAddress] = useState("23 Afikpo Road, Abakiliki, Ebonyi State");
  const [abakalikiPhone1, setAbakalikiPhone1] = useState("0906 703 2849");
  const [abakalikiHours, setAbakalikiHours] = useState("Mon-Sat: 8AM-7PM · Sun: 10AM-5PM");
  const [abakalikiMapUrl, setAbakalikiMapUrl] = useState("https://maps.google.com/?q=23+Afikpo+Road+Abakiliki+Nigeria");

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const addAnnouncement = () => {
    setAnnouncements([...announcements, ""]);
  };

  const removeAnnouncement = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const updateAnnouncement = (index: number, value: string) => {
    const updated = [...announcements];
    updated[index] = value;
    setAnnouncements(updated);
  };

  const tabs = [
    { id: "hero", label: "Hero Banner" },
    { id: "announcements", label: "Announcements" },
    { id: "testimonials", label: "Testimonials" },
    { id: "stores", label: "Store Info" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Site Content</h1>
        <p className="text-muted mt-1">Manage homepage content and store information</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-card p-6 border border-border space-y-4 max-w-2xl">
          <h2 className="font-semibold text-foreground">Hero Banner Content</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Headline</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Subheadline</label>
            <textarea
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Primary CTA Label</label>
              <input
                type="text"
                value={heroPrimaryCta}
                onChange={(e) => setHeroPrimaryCta(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Primary CTA URL</label>
              <input
                type="text"
                value={heroPrimaryUrl}
                onChange={(e) => setHeroPrimaryUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Secondary CTA Label</label>
            <input
              type="text"
              value={heroSecondaryCta}
              onChange={(e) => setHeroSecondaryCta(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Hero Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">Click to upload hero image</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Hero"}
          </button>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="bg-white rounded-card p-6 border border-border space-y-4 max-w-2xl">
          <h2 className="font-semibold text-foreground">Announcement Bar Messages</h2>
          <p className="text-sm text-muted">These messages rotate in the announcement bar at the top of the site.</p>
          <div className="space-y-3">
            {announcements.map((msg, index) => (
              <div key={index} className="flex gap-3 items-center">
                <GripVertical className="w-5 h-5 text-muted cursor-grab" />
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => updateAnnouncement(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => removeAnnouncement(index)}
                  className="p-2 text-muted hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addAnnouncement}
            className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Message
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Announcements"}
          </button>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === "testimonials" && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Customer Testimonials</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-btn hover:bg-primary-hover">
              <Plus className="w-4 h-4" />
              Add Testimonial
            </button>
          </div>
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-card p-6 border border-border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-foreground">{t.name}</h3>
                    <p className="text-sm text-muted">{t.city} · {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= t.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted italic">{`"${t.quote}"`}</p>
                <div className="flex gap-2 mt-4">
                  <button className="text-sm text-primary hover:underline">Edit</button>
                  <button className="text-sm text-destructive hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === "stores" && (
        <div className="space-y-6 max-w-2xl">
          {/* Enugu Store */}
          <div className="bg-white rounded-card p-6 border border-border space-y-4">
            <h2 className="font-semibold text-foreground">Enugu Store</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <textarea
                value={enuguAddress}
                onChange={(e) => setEnuguAddress(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone 1</label>
                <input
                  type="text"
                  value={enuguPhone1}
                  onChange={(e) => setEnuguPhone1(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone 2</label>
                <input
                  type="text"
                  value={enuguPhone2}
                  onChange={(e) => setEnuguPhone2(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Opening Hours</label>
              <input
                type="text"
                value={enuguHours}
                onChange={(e) => setEnuguHours(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Google Maps URL</label>
              <input
                type="text"
                value={enuguMapUrl}
                onChange={(e) => setEnuguMapUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Abakiliki Store */}
          <div className="bg-white rounded-card p-6 border border-border space-y-4">
            <h2 className="font-semibold text-foreground">Abakiliki Store</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <textarea
                value={abakalikiAddress}
                onChange={(e) => setAbakalikiAddress(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <input
                type="text"
                value={abakalikiPhone1}
                onChange={(e) => setAbakalikiPhone1(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Opening Hours</label>
              <input
                type="text"
                value={abakalikiHours}
                onChange={(e) => setAbakalikiHours(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Google Maps URL</label>
              <input
                type="text"
                value={abakalikiMapUrl}
                onChange={(e) => setAbakalikiMapUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Store Info"}
          </button>
        </div>
      )}
    </div>
  );
}
