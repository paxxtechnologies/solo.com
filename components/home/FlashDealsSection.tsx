'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { flashDeals } from '@/lib/mock-data'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  }
}

export function FlashDealsSection() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get end time from first flash deal
    const endTime = new Date(flashDeals[0]?.endTime || Date.now()).getTime()

    const updateTimer = () => {
      const now = Date.now()
      const remaining = endTime - now
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = timeRemaining !== null ? formatTime(timeRemaining) : null
  const dealEnded = timeRemaining !== null && timeRemaining <= 0

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-solo-navy">SoloFlash Deals</h2>

          {/* Countdown Timer */}
          {formattedTime && !dealEnded && (
            <div className="bg-solo-red text-white rounded-lg px-4 py-2 font-mono font-bold flex items-center gap-1">
              <span>{formattedTime.hours}</span>
              <span>:</span>
              <span>{formattedTime.minutes}</span>
              <span>:</span>
              <span>{formattedTime.seconds}</span>
            </div>
          )}
          {dealEnded && (
            <span className="bg-gray-200 text-solo-muted rounded-lg px-4 py-2 font-medium">
              Deal ended
            </span>
          )}
        </div>

        {/* Products Row */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            suppressHydrationWarning
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-solo-soft-gray transition-colors max-md:hidden"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-solo-navy" />
          </button>

          <button
            suppressHydrationWarning
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-solo-soft-gray transition-colors max-md:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-solo-navy" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
          >
            {flashDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex-shrink-0 w-[280px] max-md:w-[240px] snap-start"
              >
                <ProductCard product={deal.product} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-right mt-4">
          <Link
            href="/flash-deals"
            className="text-solo-green font-medium hover:underline"
          >
            View all Flash Deals →
          </Link>
        </div>
      </div>
    </section>
  )
}
