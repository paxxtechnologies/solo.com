"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from '@/store/auth.store'
import { useToast } from "@/context/toast-context";
import { SoloLogo } from "@/components/ui/SoloLogo";
import Link from "next/link";
import {
  ChevronLeft,
  Lock,
  CreditCard,
  Truck,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type CheckoutStep = "information" | "shipping" | "payment";
type PaymentMethod = "paystack" | "tendr" | "bank_transfer";

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Delivered within 3-5 business days",
    price: 2500,
    estimatedDays: "3-5 days",
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "Delivered within 1-2 business days",
    price: 5000,
    estimatedDays: "1-2 days",
  },
  {
    id: "pickup",
    name: "Store Pickup",
    description: "Pick up from any Solo Gadgets store",
    price: 0,
    estimatedDays: "Ready in 24hrs",
  },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "Lagos",
    postalCode: "",
    saveInfo: true,
  });

  const [selectedShipping, setSelectedShipping] = useState<string>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
  const [tendrPlan, setTendrPlan] = useState<number>(3);

  // Calculations
  const shippingCost = shippingOptions.find((s) => s.id === selectedShipping)?.price || 0;
  const total = subtotal + shippingCost;
  const tendrMonthlyPayment = Math.ceil(total / tendrPlan);

  useEffect(() => {
    if (items && items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateInformation = () => {
    const required = ["email", "firstName", "lastName", "phone", "address", "city", "state"];
    return required.every((field) => formData[field as keyof typeof formData]);
  };

  const handleContinueToShipping = () => {
    if (!validateInformation()) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setCurrentStep("shipping");
  };

  const handleContinueToPayment = () => {
    setCurrentStep("payment");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (paymentMethod === "paystack") {
      // Simulate Paystack redirect
      showToast("Redirecting to Paystack...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else if (paymentMethod === "tendr") {
      // Simulate Tendr BNPL
      showToast("Processing Tendr payment plan...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Success
    clearCart();
    router.push("/checkout/success");
    setIsProcessing(false);
  };

  const steps = [
    { id: "information", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <SoloLogo size="sm" />
            <span className="font-heading font-bold text-xl text-foreground">
              Solo Gadgets
            </span>
          </Link>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Form */}
          <div className="lg:pr-8">
            {/* Breadcrumb Steps */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (step.id === "information") setCurrentStep("information");
                      else if (step.id === "shipping" && currentStep !== "information")
                        setCurrentStep("shipping");
                      else if (step.id === "payment" && currentStep === "payment")
                        setCurrentStep("payment");
                    }}
                    className={`${
                      currentStep === step.id
                        ? "text-primary font-medium"
                        : steps.findIndex((s) => s.id === currentStep) >
                          steps.findIndex((s) => s.id === step.id)
                        ? "text-foreground"
                        : "text-muted"
                    }`}
                  >
                    {step.label}
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronLeft className="w-4 h-4 mx-2 rotate-180 text-muted" />
                  )}
                </div>
              ))}
            </nav>

            {/* Information Step */}
            {currentStep === "information" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          State
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {nigerianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted">
                        Save this information for next time
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleContinueToShipping}
                  className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Continue to Shipping
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-2 text-primary text-sm hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Return to shopping
                </Link>
              </div>
            )}

            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Shipping Method
                  </h2>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedShipping === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <div className="flex items-center gap-3">
                            {option.id === "pickup" ? (
                              <Calendar className="w-5 h-5 text-muted" />
                            ) : (
                              <Truck className="w-5 h-5 text-muted" />
                            )}
                            <div>
                              <p className="font-medium text-foreground">{option.name}</p>
                              <p className="text-sm text-muted">{option.description}</p>
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-foreground">
                          {option.price === 0 ? "FREE" : formatPrice(option.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleContinueToPayment}
                    className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Continue to Payment
                  </button>
                  <button
                    onClick={() => setCurrentStep("information")}
                    className="flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Return to information
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {/* Paystack */}
                    <label
                      className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === "paystack"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value="paystack"
                            checked={paymentMethod === "paystack"}
                            onChange={() => setPaymentMethod("paystack")}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-muted" />
                            <div>
                              <p className="font-medium text-foreground">
                                Pay with Paystack
                              </p>
                              <p className="text-sm text-muted">
                                Cards, Bank Transfer, USSD, Mobile Money
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-10 h-6 bg-[#00C3F7] rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">PS</span>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Tendr BNPL */}
                    <label
                      className={`block rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === "tendr"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              value="tendr"
                              checked={paymentMethod === "tendr"}
                              onChange={() => setPaymentMethod("tendr")}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-accent" />
                              <div>
                                <p className="font-medium text-foreground">
                                  Buy Now, Pay Later with Tendr
                                </p>
                                <p className="text-sm text-muted">
                                  Split into easy monthly payments
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-accent text-white text-xs font-semibold rounded">
                            BNPL
                          </div>
                        </div>
                      </div>

                      {paymentMethod === "tendr" && (
                        <div className="px-4 pb-4 pt-2 border-t border-border/50">
                          <p className="text-sm font-medium text-foreground mb-3">
                            Choose your payment plan:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {[3, 6, 12].map((months) => (
                              <button
                                key={months}
                                type="button"
                                onClick={() => setTendrPlan(months)}
                                className={`p-3 rounded-lg border text-center transition-all ${
                                  tendrPlan === months
                                    ? "border-accent bg-accent/10"
                                    : "border-border hover:border-accent/50"
                                }`}
                              >
                                <p className="text-lg font-bold text-foreground">
                                  {months}
                                </p>
                                <p className="text-xs text-muted">months</p>
                                <p className="text-sm font-semibold text-accent mt-1">
                                  {formatPrice(Math.ceil(total / months))}/mo
                                </p>
                              </button>
                            ))}
                          </div>
                          <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-accent" />
                              <span className="text-foreground">
                                Pay{" "}
                                <span className="font-semibold">
                                  {formatPrice(tendrMonthlyPayment)}
                                </span>{" "}
                                today, then{" "}
                                <span className="font-semibold">
                                  {formatPrice(tendrMonthlyPayment)}
                                </span>{" "}
                                monthly for {tendrPlan - 1} more months
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </label>

                    {/* Bank Transfer */}
                    <label
                      className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === "bank_transfer"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="bank_transfer"
                          checked={paymentMethod === "bank_transfer"}
                          onChange={() => setPaymentMethod("bank_transfer")}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            Direct Bank Transfer
                          </p>
                          <p className="text-sm text-muted">
                            Pay directly to our bank account
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Summary for Payment */}
                <div className="p-4 bg-surface-alt rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-foreground">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {paymentMethod === "tendr"
                          ? `Pay ${formatPrice(tendrMonthlyPayment)} Now`
                          : `Pay ${formatPrice(total)}`}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setCurrentStep("shipping")}
                    className="flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Return to shipping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:pl-8 lg:border-l lg:border-border mt-8 lg:mt-0">
            {/* Mobile Toggle */}
            <button
              onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-surface-alt rounded-lg mb-4"
            >
              <span className="font-medium text-foreground">
                {orderSummaryOpen ? "Hide" : "Show"} order summary
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{formatPrice(total)}</span>
                {orderSummaryOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            <div className={`${orderSummaryOpen ? "block" : "hidden"} lg:block`}>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-4 hidden lg:block">
                Order Summary
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant?.value || ''}`} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-surface-alt rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images?.[0] || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-muted text-white text-xs font-semibold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.selectedVariant && `${item.selectedVariant.name}: ${item.selectedVariant.value}`}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground text-sm">
                      {formatPrice(
                        (item.product.salePrice || item.product.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="text-foreground">
                    {currentStep === "information"
                      ? "Calculated at next step"
                      : shippingCost === 0
                      ? "FREE"
                      : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-xl text-foreground">
                    {formatPrice(currentStep === "information" ? subtotal : total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Truck className="w-4 h-4" />
                  <span>Free returns within 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
