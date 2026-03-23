'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Check } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import type { Product } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
}

// Star rating component
function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={star <= rating ? 'text-solo-green' : 'text-gray-300'}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const [isAdded, setIsAdded] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const inWishlist = isInWishlist(product.id)
  const hasDiscount = product.salePrice && product.salePrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.salePrice!) * 100)
    : 0

  const bnplMonthly =
    product.isBnplEligible && product.price >= 25000
      ? Math.round(product.price / 3)
      : 0

  // Badge priority: verified > flash > new > bestseller (max 2)
  const displayBadges = product.badges.slice(0, 2)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-card bg-white border border-gray-100 overflow-hidden cursor-pointer hover:border-solo-green hover:shadow-md transition-all duration-200"
    >
      {/* Image Container */}
      <div
        className="aspect-[4/3] relative bg-white"
        onMouseEnter={() => product.images[1] && setImageIndex(1)}
        onMouseLeave={() => setImageIndex(0)}
      >
        <Image
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge Strip */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {displayBadges.includes('verified') && (
            <span className="bg-solo-green text-solo-deep-green text-[10px] font-semibold rounded-pill px-2 py-0.5">
              Solo Verified
            </span>
          )}
          {displayBadges.includes('flash') && (
            <span className="bg-solo-red text-white text-[10px] font-semibold rounded-pill px-2 py-0.5">
              Flash Deal
            </span>
          )}
          {displayBadges.includes('new') && (
            <span className="bg-amber-400 text-amber-900 text-[10px] font-semibold rounded-pill px-2 py-0.5">
              New Arrival
            </span>
          )}
          {displayBadges.includes('bestseller') && (
            <span className="bg-purple-100 text-purple-700 text-[10px] font-semibold rounded-pill px-2 py-0.5">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          suppressHydrationWarning
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${inWishlist ? 'fill-solo-green text-solo-green' : 'text-solo-muted'
              }`}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="text-[14px] font-semibold text-solo-navy line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* BNPL Callout */}
        {bnplMonthly > 0 && (
          <div className="mb-1.5">
            <span className="bg-solo-mint text-solo-deep-green text-[11px] font-medium rounded-pill px-2 py-0.5 inline-block">
              From ₦{bnplMonthly.toLocaleString('en-NG')}/month
            </span>
            <span className="text-[10px] text-solo-muted ml-1">via Tendr</span>
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-bold text-solo-navy">
            ₦{product.price.toLocaleString('en-NG')}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[13px] text-solo-muted line-through">
                ₦{product.salePrice!.toLocaleString('en-NG')}
              </span>
              <span className="bg-solo-red text-white text-[10px] font-bold rounded px-1.5 py-0.5">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={Math.round(product.rating)} />
          <span className="text-[12px] text-solo-muted">({product.reviewCount})</span>
        </div>

        {/* Add to Cart Button */}
        <button
          suppressHydrationWarning
          onClick={handleAddToCart}
          disabled={product.stockQty === 0}
          className={`w-full mt-3 py-2 text-[13px] font-semibold rounded-btn transition-all ${product.stockQty === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isAdded
                ? 'bg-solo-deep-green text-white'
                : 'bg-solo-green text-solo-deep-green hover:bg-solo-deep-green hover:text-white'
            }`}
        >
          {product.stockQty === 0 ? (
            'Out of Stock'
          ) : isAdded ? (
            <span className="flex items-center justify-center gap-1">
              <Check className="w-4 h-4" />
              Added!
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>

        {/* Stock Urgency */}
        {product.stockQty > 0 && product.stockQty <= 5 && (
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            Only {product.stockQty} left
          </p>
        )}
      </div>
    </Link>
  )
}
