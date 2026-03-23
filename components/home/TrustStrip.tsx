'use client'

import { ShieldCheck, RefreshCw, Zap, Lock } from 'lucide-react'

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Solo Verified Stock',
    description:
      'Every product is sourced from authorised distributors and inspected before listing.',
  },
  {
    icon: RefreshCw,
    title: '30-Day In-Store Returns',
    description:
      'Changed your mind? Return any item to our Enugu or Abakiliki store. Instant refund.',
  },
  {
    icon: Zap,
    title: 'Same-Day Delivery',
    description:
      'Order before 2PM and receive your gadget the same day within Enugu.',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description:
      'Paystack-secured checkout. Your card and bank details are never stored by Solo.',
  },
]

export function TrustStrip() {
  return (
    <section className="bg-solo-soft-gray py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 text-solo-green mb-3">
                <pillar.icon className="w-10 h-10" />
              </div>
              <h4 className="font-semibold text-solo-navy mb-1">{pillar.title}</h4>
              <p className="text-[13px] text-solo-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
