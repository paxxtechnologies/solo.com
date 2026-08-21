"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle, Clock, Home, ShoppingBag, XCircle } from "lucide-react";
import { SoloLogo } from "@/components/ui/SoloLogo";
import { useCart } from "@/context/cart-context";
import { checkoutService } from "@/services/checkout.service";
import type { PaymentData } from "@/types/checkout.types";

type VerificationState = "checking" | "success" | "failed";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<VerificationState>("checking");
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("transactionRef");

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference was found in the callback URL.");
      return;
    }

    let cancelled = false;

    const verify = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await checkoutService.verifyPayment(reference);
          const paymentData = response.data.data;

          if (cancelled) return;

          setPayment(paymentData);

          if (paymentData.status === "success") {
            clearCart();
            setStatus("success");
            setMessage(paymentData.message || "Payment completed successfully.");
            return;
          }

          if (paymentData.status === "pending" && attempt < 2) {
            setMessage("Payment is still pending. Checking again...");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }

          setStatus("failed");
          setMessage(paymentData.message || `Payment ${paymentData.status}.`);
          return;
        } catch (error) {
          if (cancelled) return;
          setStatus("failed");
          setMessage(error instanceof Error ? error.message : "Payment verification failed.");
          return;
        }
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [clearCart, searchParams]);

  useEffect(() => {
    if (status !== "success") return;

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
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
  }, [status]);

  const Icon =
    status === "success" ? CheckCircle : status === "checking" ? Clock : XCircle;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="relative inline-flex mb-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              status === "success"
                ? "bg-success/10"
                : status === "checking"
                ? "bg-primary/10"
                : "bg-red-50"
            }`}
          >
            <Icon
              className={`w-12 h-12 ${
                status === "success"
                  ? "text-success"
                  : status === "checking"
                  ? "text-primary animate-pulse"
                  : "text-red-600"
              }`}
            />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          {status === "success"
            ? "Payment Confirmed"
            : status === "checking"
            ? "Checking Payment"
            : "Payment Not Confirmed"}
        </h1>
        <p className="text-lg text-muted mb-6">{message}</p>

        {payment && (
          <div className="bg-surface-alt rounded-xl p-6 mb-8">
            <p className="text-sm text-muted mb-1">Transaction Reference</p>
            <p className="text-lg font-mono font-bold text-primary break-all">
              {payment.transactionRef}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-8">
            <h2 className="font-heading font-semibold text-foreground mb-2">
              What happens next?
            </h2>
            <p className="text-sm text-muted">
              We have received your payment and will prepare your order for pickup.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-foreground font-semibold rounded-lg hover:bg-surface-alt transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <Suspense fallback={null}>
        <CheckoutSuccessContent />
      </Suspense>

      <footer className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Solo Gadgets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
