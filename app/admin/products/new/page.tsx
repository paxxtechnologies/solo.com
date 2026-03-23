"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, X, Plus, GripVertical, Save } from "lucide-react";

const categories = [
  "Smartphones",
  "Laptops",
  "Accessories",
  "Audio",
  "Smart Devices",
  "Smart Home",
  "Certified Refurbished",
];

interface Specification {
  key: string;
  value: string;
}

interface VariantGroup {
  name: string;
  values: { value: string; priceOverride: string; stock: string }[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  
  // Specifications
  const [specs, setSpecs] = useState<Specification[]>([{ key: "", value: "" }]);
  
  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  
  // Images
  const [images, setImages] = useState<string[]>([]);
  
  // Pricing
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  
  // Stock
  const [stockQty, setStockQty] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("5");
  const [trackInventory, setTrackInventory] = useState(true);
  
  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  
  // Badges & Settings
  const [soloVerified, setSoloVerified] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [bnplEligible, setBnplEligible] = useState(true);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [flashDiscount, setFlashDiscount] = useState("");
  const [flashStart, setFlashStart] = useState("");
  const [flashEnd, setFlashEnd] = useState("");

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  // Add/remove specs
  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  // Variant groups
  const addVariantGroup = () => {
    setVariantGroups([...variantGroups, { name: "", values: [] }]);
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
    setImages([...images, mockUrl]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/admin/products");
    }, 1000);
  };

  const discountPercent = price && salePrice 
    ? Math.round((1 - Number(salePrice) / Number(price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">Add New Product</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="px-4 py-2 border border-border text-foreground font-medium rounded-btn hover:bg-surface-alt transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., iPhone 15 Pro Max 256GB"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g., Apple"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Product description..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Specifications</h2>
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => updateSpec(index, "key", e.target.value)}
                      placeholder="Spec name"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, "value", e.target.value)}
                      placeholder="Spec value"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => removeSpec(index)}
                      className="p-2 text-muted hover:text-destructive"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSpec}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  + Add Specification
                </button>
              </div>
            </div>

            {/* Tags & SEO */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Tags & SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., flagship, 5g, premium"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="SEO title"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    placeholder="SEO description"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 40% */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Images</h2>
              <div
                onClick={handleImageUpload}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-muted text-sm">Drag images here or click to upload</p>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <GripVertical className="w-5 h-5 text-white cursor-grab" />
                        <button
                          onClick={() => removeImage(index)}
                          className="p-1 bg-destructive text-white rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 text-xs bg-primary text-white px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Original Price (₦) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sale Price (₦)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {discountPercent > 0 && (
                    <p className="text-sm text-primary mt-1">{discountPercent}% off</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cost Price (₦) - Internal
                  </label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Stock</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Low Stock Alert At
                  </label>
                  <input
                    type="number"
                    value={lowStockAlert}
                    onChange={(e) => setLowStockAlert(e.target.value)}
                    placeholder="5"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackInventory}
                    onChange={(e) => setTrackInventory(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Track Inventory</span>
                </label>
              </div>
            </div>

            {/* Badges & Settings */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h2 className="font-semibold text-foreground mb-4">Badges & Settings</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">Solo Verified</span>
                  <input
                    type="checkbox"
                    checked={soloVerified}
                    onChange={(e) => setSoloVerified(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">Featured Product</span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">BNPL Eligible (Tendr)</span>
                  <input
                    type="checkbox"
                    checked={bnplEligible}
                    onChange={(e) => setBnplEligible(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">Flash Deal</span>
                  <input
                    type="checkbox"
                    checked={isFlashDeal}
                    onChange={(e) => setIsFlashDeal(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                {isFlashDeal && (
                  <div className="mt-4 p-4 bg-surface-alt rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        value={flashDiscount}
                        onChange={(e) => setFlashDiscount(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Start Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        value={flashStart}
                        onChange={(e) => setFlashStart(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        End Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        value={flashEnd}
                        onChange={(e) => setFlashEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
