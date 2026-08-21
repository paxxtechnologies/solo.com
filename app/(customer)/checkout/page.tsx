"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/context/toast-context";
import { SoloLogo } from "@/components/ui/SoloLogo";
import { checkoutService } from "@/services/checkout.service";
import { ApiRequestError } from "@/lib/api";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CreditCard,
  Lock,
  MapPin,
  Truck,
} from "lucide-react";

type CheckoutStep = "information" | "shipping" | "payment";
type PaymentMethod = "paystack" | "tendr" | "bank_transfer";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const pickupStores = [
  {
    name: "Enugu Store",
    address: "Shop 45, Computer Village, Ogui Road, Enugu",
    phone: "0906 699 4388",
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
    mapsUrl: "https://maps.google.com/?q=Computer+Village+Ogui+Road+Enugu",
  },
  {
    name: "Abakiliki Store",
    address: "No. 12, Kpirikpiri, Abakiliki, Ebonyi State",
    phone: "0906 699 4388",
    hours: "Mon-Sat: 8AM-7PM · Sun: 10AM-5PM",
    mapsUrl: "https://maps.google.com/?q=Kpirikpiri+Abakiliki+Ebonyi",
  },
];

function getCheckoutError(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.errors?.length ? error.errors.join("\n") : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to place order";
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discountAmount,
    total,
    promotion,
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [formError, setFormError] = useState("");

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items.length, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const requiredFields = useMemo(
    () => ["email", "firstName", "lastName", "phone", "address", "city", "state"],
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormError("");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateInformation = () => {
    return requiredFields.every((field) =>
      String(formData[field as keyof typeof formData] ?? "").trim()
    );
  };

  const handleContinueToShipping = () => {
    if (!validateInformation()) {
      setFormError("Please fill in all required fields.");
      showToast("Please fill in all required fields", "error");
      return;
    }

    setCurrentStep("shipping");
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod !== "paystack") {
      return;
    }

    if (!validateInformation()) {
      setCurrentStep("information");
      setFormError("Please fill in all required fields.");
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsProcessing(true);
    setFormError("");

    try {
      const response = await checkoutService.createOrder({
        guestFirstName: formData.firstName.trim(),
        guestLastName: formData.lastName.trim(),
        guestEmail: formData.email.trim(),
        guestPhone: formData.phone.trim(),
        guestStreet: [formData.address.trim(), formData.apartment.trim()]
          .filter(Boolean)
          .join(", "),
        guestCity: formData.city.trim(),
        guestState: formData.state,
        couponCode: promotion?.code,
        paymentMethod: "paystack",
        items: items.map((item) => ({
          productId: item.product.id,
          ...(item.selectedVariant?.id ? { variantId: item.selectedVariant.id } : {}),
          quantity: item.quantity,
        })),
      });

      const authorizationUrl = response.data.data.payment?.authorizationUrl;

      if (!authorizationUrl) {
        throw new Error("Order was created, but no payment authorization URL was returned.");
      }

      window.location.href = authorizationUrl;
    } catch (error) {
      const message = getCheckoutError(error);
      setFormError(message);
      showToast(message.split("\n")[0], "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: "information", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
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
          <div className="lg:pr-8">
            <nav className="flex items-center gap-2 text-sm mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (step.id === "information") setCurrentStep("information");
                      if (step.id === "shipping" && currentStep !== "information") {
                        setCurrentStep("shipping");
                      }
                      if (step.id === "payment" && currentStep === "payment") {
                        setCurrentStep("payment");
                      }
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

            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 whitespace-pre-line">
                {formError}
              </div>
            )}

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
                    Pickup Contact Details
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  Continue
                </button>

                <Link href="/" className="flex items-center gap-2 text-primary text-sm hover:underline">
                  <ChevronLeft className="w-4 h-4" />
                  Return to shopping
                </Link>
              </div>
            )}

            {currentStep === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Store Pickup
                  </h2>
                  <div className="space-y-3">
                    {pickupStores.map((store) => (
                      <div key={store.name} className="p-4 rounded-lg border border-border bg-surface">
                        <div className="flex gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">{store.name}</p>
                            <p className="text-sm text-muted mt-1">{store.address}</p>
                            <p className="text-sm text-muted mt-1">{store.phone}</p>
                            <p className="text-sm text-muted mt-1">{store.hours}</p>
                            <a
                              href={store.mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block text-sm text-primary font-medium mt-2 hover:underline"
                            >
                              Get Directions
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setCurrentStep("payment")}
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

            {currentStep === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="block p-4 rounded-lg border border-primary bg-primary/5 cursor-pointer">
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
                              <p className="font-medium text-foreground">Pay with Paystack</p>
                              <p className="text-sm text-muted">
                                Cards, Bank Transfer, USSD, Mobile Money
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-10 h-6 bg-[#00C3F7] rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PS</span>
                        </div>
                      </div>
                    </label>

                    <label className="block p-4 rounded-lg border border-border bg-surface-alt opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value="tendr"
                            checked={false}
                            disabled
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted" />
                            <div>
                              <p className="font-medium text-foreground">
                                Buy Now, Pay Later with Tendr
                              </p>
                              <p className="text-sm text-muted">Currently unavailable</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-muted text-white text-xs font-semibold rounded">
                          BNPL
                        </div>
                      </div>
                    </label>

                    <label className="block p-4 rounded-lg border border-border bg-surface-alt opacity-60 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="bank_transfer"
                          checked={false}
                          disabled
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-foreground">Direct Bank Transfer</p>
                          <p className="text-sm text-muted">Currently unavailable</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-surface-alt rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {promotion && discountAmount > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted">Discount ({promotion.code})</span>
                      <span className="text-primary">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-foreground">{formatPrice(total)}</span>
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
                        Pay {formatPrice(total)}
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

          <div className="lg:pl-8 lg:border-l lg:border-border mt-8 lg:mt-0">
            <button
              onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-surface-alt rounded-lg mb-4"
            >
              <span className="font-medium text-foreground">
                {orderSummaryOpen ? "Hide" : "Show"} order summary
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{formatPrice(total)}</span>
                {orderSummaryOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <div className={`${orderSummaryOpen ? "block" : "hidden"} lg:block`}>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-4 hidden lg:block">
                Order Summary
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant?.value || ""}`} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-surface-alt rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images?.[0] || "/placeholder.png"}
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
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {promotion && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Discount ({promotion.code})</span>
                    <span className="text-primary">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-xl text-foreground">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Truck className="w-4 h-4" />
                  <span>Store pickup at Solo locations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
