"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Check, Shield } from "lucide-react";
import { useToast } from "@/context/toast-context";

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  lastFour: string;
  cardBrand?: string;
  bankName?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    cardBrand: "Visa",
    lastFour: "4242",
    expiryDate: "12/26",
    isDefault: true,
  },
  {
    id: "2",
    type: "bank",
    bankName: "GTBank",
    lastFour: "5678",
    isDefault: false,
  },
];

const cardBrandIcons: Record<string, JSX.Element> = {
  Visa: (
    <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center text-white text-xs font-bold">
      VISA
    </div>
  ),
  Mastercard: (
    <div className="w-10 h-6 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] rounded flex items-center justify-center">
      <div className="flex">
        <div className="w-3 h-3 bg-[#EB001B] rounded-full -mr-1" />
        <div className="w-3 h-3 bg-[#F79E1B] rounded-full" />
      </div>
    </div>
  ),
  Verve: (
    <div className="w-10 h-6 bg-[#00425F] rounded flex items-center justify-center text-white text-[8px] font-bold">
      VERVE
    </div>
  ),
};

export default function PaymentMethodsPage() {
  const { showToast } = useToast();
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(initialPaymentMethods);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleDelete = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    showToast("Payment method removed", "info");
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    showToast("Default payment method updated", "success");
  };

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate adding a card
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      cardBrand: "Mastercard",
      lastFour: "8888",
      expiryDate: "06/28",
      isDefault: false,
    };
    setPaymentMethods((prev) => [...prev, newCard]);
    setIsAddingNew(false);
    showToast("Card added successfully", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Payment Methods
          </h1>
          <p className="text-muted">Manage your saved payment options</p>
        </div>
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      {/* Add New Card Form */}
      {isAddingNew && (
        <form
          onSubmit={handleAddCard}
          className="bg-surface rounded-xl border border-border p-6"
        >
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
            Add New Card
          </h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted">
            <Shield className="w-4 h-4" />
            <span>Your card details are encrypted and secure</span>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" />
              Add Card
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-surface-alt transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Payment Methods List */}
      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-surface rounded-xl border p-5 ${
                method.isDefault ? "border-primary" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {method.type === "card" ? (
                    <>
                      {cardBrandIcons[method.cardBrand || ""] || (
                        <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {method.cardBrand} ending in {method.lastFour}
                          </p>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted">
                          Expires {method.expiryDate}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <span className="text-success font-bold text-sm">
                          {method.bankName?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {method.bankName} ending in {method.lastFour}
                          </p>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted">Bank Account</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <CreditCard className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            No payment methods saved
          </h2>
          <p className="text-muted mb-6">
            Add a payment method for faster checkout
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Payment Method
          </button>
        </div>
      )}

      {/* Security Note */}
      <div className="bg-surface-alt rounded-xl p-5 flex items-start gap-4">
        <Shield className="w-6 h-6 text-success flex-shrink-0" />
        <div>
          <h3 className="font-medium text-foreground mb-1">
            Your payment info is secure
          </h3>
          <p className="text-sm text-muted">
            We use industry-standard encryption to protect your payment
            information. Your full card details are never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
