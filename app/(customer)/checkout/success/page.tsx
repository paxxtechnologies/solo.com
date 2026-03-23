"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SoloLogo } from "@/components/ui/SoloLogo";
import { CheckCircle, Package, Truck, Home, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(() =>
    `SG${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`
  );

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FF6B00", "#0A1628", "#00D4AA"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FF6B00", "#0A1628", "#00D4AA"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <SoloLogo size="sm" />
            <span className="font-heading font-bold text-xl text-foreground">
              Solo Gadgets
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted mb-6">
            Thank you for shopping with Solo Gadgets
          </p>

          {/* Order Number */}
          <div className="bg-surface-alt rounded-xl p-6 mb-8">
            <p className="text-sm text-muted mb-1">Order Number</p>
            <p className="text-2xl font-mono font-bold text-primary tracking-wider">
              {orderNumber}
            </p>
          </div>

          {/* Order Timeline */}
          <div className="bg-surface rounded-xl border border-border p-6 mb-8">
            <h2 className="font-heading font-semibold text-foreground mb-4">
              What happens next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Order Placed</p>
                  <p className="text-sm text-muted">
                    We&apos;ve received your order and payment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Processing</p>
                  <p className="text-sm text-muted">
                    Your order is being prepared for shipment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-muted/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-muted" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-muted">Out for Delivery</p>
                  <p className="text-sm text-muted">
                    You&apos;ll receive tracking details via email
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Notice */}
          <p className="text-sm text-muted mb-8">
            A confirmation email has been sent to your email address with order
            details and tracking information.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Package className="w-5 h-5" />
              Track Order
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-foreground font-semibold rounded-lg hover:bg-surface-alt transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Support Link */}
          <p className="mt-8 text-sm text-muted">
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Solo Gadgets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
