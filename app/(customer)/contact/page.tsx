"use client";

import { useState } from "react";
import { MapPin, Phone, MessageCircle, Send, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/context/toast-context";

const subjects = [
  "General Inquiry",
  "Order Issue",
  "Product Question",
  "BNPL / Payment",
  "SoloSwap Trade-In",
  "Other",
];

const stores = [
  {
    name: "Enugu Store",
    address: "15 Ogui Road, Independence Layout, Enugu",
    phones: ["0906 699 4388", "0906 703 2849"],
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
  },
  {
    name: "Abakiliki Store",
    address: "23 Afikpo Road, Abakiliki, Ebonyi State",
    phones: ["0906 703 2849"],
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
  },
];

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast("Message sent successfully! We'll get back to you soon.", "success");
      setFormData({ name: "", whatsapp: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-surface py-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted max-w-xl mx-auto">
            Have a question or need help? Reach out to us through WhatsApp for the fastest response,
            or fill out the form below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-card p-6 lg:p-8 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2349066994388"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-[#25D366] text-white rounded-card hover:bg-[#1DA851] transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Chat with us on WhatsApp</h3>
                <p className="text-white/80 text-sm">Fastest response · Available 8AM-9PM daily</p>
              </div>
            </a>

            {/* Store Cards */}
            {stores.map((store) => (
              <div
                key={store.name}
                className="bg-white rounded-card p-6 border border-border"
              >
                <h3 className="font-semibold text-foreground mb-4">{store.name}</h3>
                <div className="space-y-3 text-muted">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      {store.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="block hover:text-primary"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{store.hours}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-white rounded-card p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/sololinks042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com/@sololinks042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/sololinks042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/2349066994388"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
