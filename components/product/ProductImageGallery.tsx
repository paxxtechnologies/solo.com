'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  isVerified?: boolean
}

export function ProductImageGallery({
  images,
  productName,
  isVerified = true,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const mainImageRef = useRef<HTMLDivElement>(null)

  // Touch swipe handling
  useEffect(() => {
    const container = mainImageRef.current
    if (!container) return

    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = endX - startX
      const diffY = endY - startY

      // Only swipe if horizontal movement is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && activeIndex > 0) {
          setActiveIndex(activeIndex - 1)
        } else if (diffX < 0 && activeIndex < images.length - 1) {
          setActiveIndex(activeIndex + 1)
        }
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [activeIndex, images.length])

  return (
    <div>
      {/* Main Image */}
      <div
        ref={mainImageRef}
        className={`relative rounded-card overflow-hidden bg-white aspect-square cursor-zoom-in ${
          isZoomed ? 'cursor-zoom-out' : ''
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={images[activeIndex] || images[0]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          className={`object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150' : ''
          }`}
          priority
        />

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 bg-solo-green text-solo-deep-green text-[11px] font-semibold px-3 py-1 rounded-pill">
            Solo Verified
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? 'border-solo-green'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
