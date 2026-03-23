"use client";

import { ShieldCheck, RefreshCcw, Zap, Lock } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    description: "Every product is sourced from authorized distributors and thoroughly inspected before listing. No counterfeits, ever.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "Changed your mind? Return any item within 30 days to our stores. No questions asked, instant refund.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Same-day delivery in Enugu and Abakiliki when you order before 2PM. Nationwide delivery in 2-5 days.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Paystack-secured checkout with flexible payment options including Buy Now Pay Later with Tendr.",
  },
];

const stores = [
  {
    name: "Enugu Store",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    description: "Our flagship store in the heart of Enugu, serving customers since 2019.",
  },
  {
    name: "Abakiliki Store",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
    description: "Bringing the Solo experience to Ebonyi State, opened in 2022.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              South East Nigeria{"'"}s Number 1 Gadget Hub
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Since 2019, Solo.com has been the trusted destination for quality gadgets in Enugu 
              and beyond. We believe everyone deserves access to genuine, verified technology 
              products with flexible payment options and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Solo.com started with a simple mission: to bring quality, affordable gadgets 
                  to South East Nigeria. Frustrated by the prevalence of counterfeit products 
                  and lack of reliable tech retailers in the region, our founders set out to 
                  create something different.
                </p>
                <p>
                  We opened our first store in Enugu in 2019, committed to selling only 
                  Solo Verified products — devices sourced directly from authorized distributors 
                  and thoroughly inspected for quality.
                </p>
                <p>
                  Today, with stores in Enugu and Abakiliki, we{"'"}ve served over 10,000 happy 
                  customers. We{"'"}ve partnered with Tendr to offer Buy Now Pay Later options, 
                  making quality tech accessible to everyone regardless of budget.
                </p>
              </div>
            </div>
            <div className="bg-surface-alt rounded-card p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary">10,000+</p>
                  <p className="text-muted mt-1">Happy Customers</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">2</p>
                  <p className="text-muted mt-1">Store Locations</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">5+</p>
                  <p className="text-muted mt-1">Years of Service</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">100%</p>
                  <p className="text-muted mt-1">Verified Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stores */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Stores</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {stores.map((store) => (
              <div key={store.name} className="bg-white rounded-card overflow-hidden border border-border">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{store.name}</h3>
                  <p className="text-muted">{store.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-navy">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Solo?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Visit one of our stores or shop online. With same-day delivery, flexible payments,
            and verified products, we{"'"}re here to help you find your next gadget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/shop/all"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/stores"
              className="px-8 py-3 border border-white/30 text-white font-semibold rounded-btn hover:bg-white/10 transition-colors"
            >
              Find a Store
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
