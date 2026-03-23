'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { heroContent } from '@/lib/mock-data'
import { Check } from 'lucide-react'

const trustItems = [
  'Solo Verified Stock',
  '30-Day Returns',
  'Same-Day Enugu Delivery',
  'Tendr BNPL Available',
]

export function HeroSection() {
  const [content, setContent] = useState(heroContent)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch - in production this would be real
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const bnplMonthly = content.featuredProduct.price >= 25000
    ? Math.round(content.featuredProduct.price / 3)
    : 0

  return (
    <section className="bg-solo-navy min-h-[580px] max-md:min-h-[420px]">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4 py-16 max-md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Category Pill */}
            <span className="inline-block bg-solo-mint text-solo-deep-green text-[11px] font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-4">
              Number 1 Gadget Hub · South East Nigeria
            </span>

            {/* Headline */}
            <h1 className="text-white text-[52px] max-md:text-[36px] font-bold leading-tight mb-4 text-balance">
              {isLoading ? (
                <span className="skeleton inline-block w-[80%] h-[52px] rounded" />
              ) : (
                content.headline
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-solo-mint text-lg max-md:text-base mb-8 max-w-xl">
              {content.subheadline}
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/shop"
                className="bg-solo-green text-solo-deep-green font-semibold px-8 py-3 rounded-btn hover:bg-solo-deep-green hover:text-white transition-all"
              >
                Shop Now
              </Link>
              <Link
                href="/shop?bnpl=true"
                className="border border-solo-green text-solo-green font-semibold px-8 py-3 rounded-btn hover:bg-solo-green hover:text-solo-deep-green transition-all"
              >
                Pay in Instalments
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap gap-6">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-solo-green" />
                  <span className="text-[13px] text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Featured Product */}
          <div className="relative max-lg:hidden">
            {isLoading ? (
              <div className="aspect-square skeleton rounded-card" />
            ) : (
              <>
                <div className="relative aspect-square">
                  <Image
                    src={content.featuredProduct.images[0]}
                    alt={content.featuredProduct.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* BNPL Badge */}
                {bnplMonthly > 0 && (
                  <div className="absolute bottom-4 left-4 bg-solo-green text-solo-deep-green text-[13px] font-semibold px-4 py-2 rounded-pill">
                    From ₦{bnplMonthly.toLocaleString('en-NG')}/month
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
