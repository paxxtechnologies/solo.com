"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/lib/mock-data";

const categories = ["All", "Smartphones", "Laptops", "Accessories", "Audio"];

// Mock flash deal end time (24 hours from now)
const getDealEndTime = () => {
  const end = new Date();
  end.setHours(end.getHours() + 24);
  return end;
};

export default function FlashDealsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [dealEnded, setDealEnded] = useState(false);

  // Get flash deal products
  const flashProducts = products.filter((p) => p.badges?.includes("flash"));
  const filteredProducts = activeCategory === "All"
    ? flashProducts
    : flashProducts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  // Ended deals (mock - products without flash badge but with sale price)
  const endedDeals = products
    .filter((p) => p.salePrice && !p.badges?.includes("flash"))
    .slice(0, 4);

  useEffect(() => {
    const endTime = getDealEndTime();

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setDealEnded(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Banner */}
      <section className="bg-destructive py-8 lg:py-12">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-white fill-white" />
            <h1 className="text-3xl lg:text-4xl font-bold text-white">SoloFlash Deals</h1>
          </div>

          {dealEnded ? (
            <p className="text-white text-xl font-semibold">Deal ended</p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white/80">Ends in:</span>
              <div className="flex gap-1">
                <span className="bg-white text-destructive font-mono font-bold text-2xl px-3 py-2 rounded-lg">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-white text-2xl font-bold">:</span>
                <span className="bg-white text-destructive font-mono font-bold text-2xl px-3 py-2 rounded-lg">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-white text-2xl font-bold">:</span>
                <span className="bg-white text-destructive font-mono font-bold text-2xl px-3 py-2 rounded-lg">
                  {formatTime(timeLeft.seconds)}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Active Deals */}
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-surface-alt text-muted hover:text-foreground"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted">No flash deals in this category right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* Ended Deals */}
      {endedDeals.length > 0 && (
        <section className="py-12 bg-surface-alt">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Recently Ended Deals
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-60">
              {endedDeals.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="absolute inset-0 bg-white/60 rounded-card flex items-center justify-center">
                    <span className="bg-muted text-white px-4 py-2 rounded-full text-sm font-medium">
                      Deal Ended
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
