"use client";

import { MapPin, Phone, Clock, ChevronRight } from "lucide-react";

const stores = [
  {
    id: "enugu",
    name: "Enugu Store",
    address: "15 Ogui Road, Independence Layout, Enugu",
    phones: ["0906 699 4388", "0906 703 2849"],
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
    mapUrl: "https://maps.google.com/?q=15+Ogui+Road+Enugu+Nigeria",
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=300&fit=crop",
    features: ["Same-day delivery available", "SoloSwap trade-in center", "Device repair services"],
  },
  {
    id: "abakiliki",
    name: "Abakiliki Store",
    address: "23 Afikpo Road, Abakiliki, Ebonyi State",
    phones: ["0906 703 2849"],
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
    mapUrl: "https://maps.google.com/?q=23+Afikpo+Road+Abakiliki+Nigeria",
    mapImage: "https://images.unsplash.com/photo-1577086664693-894d8c895ffe?w=600&h=300&fit=crop",
    features: ["Same-day delivery available", "SoloSwap trade-in center", "Device repair services"],
  },
];

export default function StoresPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Visit Our Stores</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Experience Solo in person. Our stores in Enugu and Abakiliki offer hands-on demos,
            expert advice, and same-day pickup.
          </p>
        </div>
      </section>

      {/* Store Cards */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 space-y-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-card overflow-hidden border border-border"
            >
              <div className="grid lg:grid-cols-2">
                {/* Info */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">{store.name}</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-muted">{store.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        {store.phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="block text-muted hover:text-primary"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Opening Hours</p>
                        <p className="text-muted">{store.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="font-medium text-foreground mb-3">Store Features</p>
                    <ul className="space-y-2">
                      {store.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors"
                  >
                    Get Directions
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Map Image */}
                <div className="bg-surface-alt">
                  <img
                    src={store.mapImage}
                    alt={`Map of ${store.name}`}
                    className="w-full h-full object-cover min-h-[300px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Can{"'"}t visit us? No problem!
          </h2>
          <p className="text-white/70 mb-6">
            Shop online and get same-day delivery within Enugu and Abakiliki.
          </p>
          <a
            href="/shop/all"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors"
          >
            Shop Online
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
