"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQGroup {
  topic: string;
  faqs: FAQ[];
}

const faqGroups: FAQGroup[] = [
  {
    topic: "Orders & Delivery",
    faqs: [
      {
        question: "How long does delivery take?",
        answer: "For orders placed before 2PM within Enugu and Abakiliki, we offer same-day delivery. For other locations in Nigeria, delivery typically takes 2-5 business days depending on your location.",
      },
      {
        question: "How much does delivery cost?",
        answer: "Delivery is FREE on all orders above ₦20,000. For orders below ₦20,000, a flat delivery fee of ₦2,000 applies for Enugu and Abakiliki, and ₦3,500 for other states.",
      },
      {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you'll receive a WhatsApp message with your tracking number. You can also track your order on our website by visiting the Track Order page and entering your order number.",
      },
      {
        question: "Can I change my delivery address after placing an order?",
        answer: "If your order hasn't been shipped yet, please contact us immediately via WhatsApp or phone. We'll do our best to update your delivery address. Once shipped, address changes are not possible.",
      },
    ],
  },
  {
    topic: "Payment & BNPL",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major debit/credit cards (Mastercard, Visa, Verve), bank transfers, and USSD payments through Paystack. For orders above ₦25,000, you can also use Tendr Buy Now Pay Later.",
      },
      {
        question: "How does Buy Now Pay Later work?",
        answer: "With Tendr BNPL, you can split your purchase into 3, 6, or 12 monthly payments. Select Tendr at checkout, complete a quick application, and get instant approval. First payment is due at checkout.",
      },
      {
        question: "Is there interest on BNPL payments?",
        answer: "Select items are eligible for 0% interest BNPL. Other items have competitive interest rates clearly displayed before you confirm. You'll always know exactly what you're paying before committing.",
      },
      {
        question: "What's the minimum order for BNPL?",
        answer: "Tendr BNPL is available on orders of ₦25,000 and above. Lower value items can be paid in full using our other payment methods.",
      },
    ],
  },
  {
    topic: "Returns & Warranty",
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy. If you're not satisfied with your purchase, bring it to our Enugu or Abakiliki store within 30 days for a full refund. Items must be in original condition with all accessories.",
      },
      {
        question: "Do your products come with warranty?",
        answer: "Yes! All products come with manufacturer warranty. Smartphones typically have 12-month warranty, laptops have 12-24 months, and accessories vary. Extended warranty is available for purchase.",
      },
      {
        question: "How do I claim warranty?",
        answer: "Visit any of our stores with your product and proof of purchase. Our technicians will assess the issue and either repair or replace your device depending on the warranty terms.",
      },
      {
        question: "Are certified refurbished products covered by warranty?",
        answer: "Yes, all certified refurbished products come with a 6-month Solo warranty covering hardware defects. This is in addition to our standard 30-day return policy.",
      },
    ],
  },
  {
    topic: "Products & Stock",
    faqs: [
      {
        question: "Are your products original?",
        answer: "Absolutely. Every product is Solo Verified — sourced directly from authorized distributors and inspected before listing. We never sell counterfeit or grey market products.",
      },
      {
        question: "What does 'Solo Verified' mean?",
        answer: "Solo Verified is our quality guarantee. It means the product has been authenticated, inspected for defects, tested for functionality, and comes with valid warranty documentation.",
      },
      {
        question: "Can you get a product that's out of stock?",
        answer: "In many cases, yes! Contact us on WhatsApp with the product you're looking for. We may be able to source it from our suppliers or suggest an alternative.",
      },
      {
        question: "What's the difference between new and certified refurbished?",
        answer: "New products are factory-sealed and unused. Certified refurbished products have been previously owned but restored to like-new condition, thoroughly tested, and come with our 6-month warranty.",
      },
    ],
  },
  {
    topic: "SoloSwap Trade-In",
    faqs: [
      {
        question: "How does SoloSwap work?",
        answer: "Use our online calculator to get an estimate for your old device. Then visit our Enugu or Abakiliki store for inspection and instant store credit that you can use towards your next purchase.",
      },
      {
        question: "What devices can I trade in?",
        answer: "We accept smartphones, laptops, and tablets from major brands including Apple, Samsung, Tecno, Infinix, HP, and Lenovo. Even devices in poor condition may have value.",
      },
      {
        question: "How is the trade-in value determined?",
        answer: "Trade-in value depends on the device brand, model, condition, and current market value. Our staff will inspect your device and provide a final offer. You're free to decline if you don't like the offer.",
      },
      {
        question: "Can I use trade-in credit with BNPL?",
        answer: "Yes! Your trade-in credit is applied to reduce the total, and you can use Tendr BNPL for the remaining balance if it's ₦25,000 or more.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (topicIndex: number, faqIndex: number) => {
    const key = `${topicIndex}-${faqIndex}`;
    setOpenItems((prev) => {
      // Close all others in the same group
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach((k) => {
        if (!k.startsWith(`${topicIndex}-`)) {
          newState[k] = prev[k];
        }
      });
      newState[key] = !prev[key];
      return newState;
    });
  };

  return (
    <main className="min-h-screen bg-surface py-12">
      <div className="max-w-[800px] mx-auto px-4 lg:px-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-center mb-12">
          Find answers to common questions about orders, payments, returns, and more.
        </p>

        <div className="space-y-8">
          {faqGroups.map((group, topicIndex) => (
            <div key={group.topic}>
              <h2 className="text-lg font-semibold text-foreground mb-4">{group.topic}</h2>
              <div className="bg-white rounded-card border border-border overflow-hidden">
                {group.faqs.map((faq, faqIndex) => {
                  const isOpen = openItems[`${topicIndex}-${faqIndex}`];
                  return (
                    <div
                      key={faqIndex}
                      className="border-b border-border last:border-b-0"
                    >
                      <button
                        onClick={() => toggleItem(topicIndex, faqIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-alt transition-colors"
                      >
                        <span className="font-medium text-foreground pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-muted leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-accent rounded-card">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-muted mb-4">
            Our team is here to help. Reach out on WhatsApp for quick answers.
          </p>
          <a
            href="https://wa.me/2349066994388"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
