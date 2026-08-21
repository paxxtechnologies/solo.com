'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { checkoutService } from '@/services/checkout.service'

export function CartDrawer() {
  const {
    state,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    total,
    promotion,
    setPromotion,
    itemCount,
  } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)
  const [promoCode, setPromoCode] = useState(promotion?.code ?? '')
  const [promoError, setPromoError] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }

    if (state.isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [state.isOpen, closeCart])

  // Handle swipe to close on mobile
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer || !state.isOpen) return

    let startX = 0
    let currentX = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      const diff = currentX - startX
      if (diff > 100) {
        closeCart()
      }
    }

    drawer.addEventListener('touchstart', handleTouchStart)
    drawer.addEventListener('touchmove', handleTouchMove)
    drawer.addEventListener('touchend', handleTouchEnd)

    return () => {
      drawer.removeEventListener('touchstart', handleTouchStart)
      drawer.removeEventListener('touchmove', handleTouchMove)
      drawer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [state.isOpen, closeCart])

  useEffect(() => {
    setPromoCode(promotion?.code ?? '')
  }, [promotion?.code])

  const handleApplyPromo = async () => {
    const code = promoCode.trim()

    if (!code) {
      setPromoError('Enter a promo code')
      return
    }

    setIsApplyingPromo(true)
    setPromoError('')

    try {
      const response = await checkoutService.validatePromotion(code, subtotal)
      const promotionData = response.data

      if (!promotionData?.isValid) {
        setPromoError(promotionData?.message ?? response.message ?? 'Promotion not applicable')
        return
      }

      setPromotion({
        code: promotionData.code,
        discountAmount: promotionData.discountAmount,
        finalAmount: promotionData.finalAmount,
        message: promotionData.message,
      })
    } catch (error) {
      setPromoError(error instanceof Error ? error.message : 'Promotion could not be applied')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const bnplMonthly = subtotal >= 25000 ? Math.round(subtotal / 3) : 0

  if (!state.isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 bottom-0 w-full max-w-[384px] bg-white flex flex-col shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-solo-navy">
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-solo-soft-gray rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-solo-muted" />
          </button>
        </div>

        {/* Cart Items */}
        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-solo-soft-gray rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-solo-muted" />
            </div>
            <h3 className="text-lg font-semibold text-solo-navy mb-2">Your cart is empty</h3>
            <p className="text-[14px] text-solo-muted mb-6">
              Start adding some amazing gadgets!
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="bg-solo-green text-solo-deep-green font-semibold px-6 py-3 rounded-btn hover:bg-solo-deep-green hover:text-white transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant?.value || 'default'}`} className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 relative bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-medium text-solo-navy line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-[12px] text-solo-muted mb-1">
                          {item.selectedVariant.name}: {item.selectedVariant.value}
                        </p>
                      )}
                      <p className="text-[14px] font-bold text-solo-navy">
                        ₦{item.product.price.toLocaleString('en-NG')}
                      </p>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-btn">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-solo-soft-gray transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-solo-muted" />
                          </button>
                          <span className="w-8 text-center text-[14px] font-medium text-solo-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-solo-soft-gray transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-solo-muted" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 hover:bg-solo-soft-gray rounded-full transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 text-solo-red" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BNPL Teaser */}
              {bnplMonthly > 0 && (
                <div className="mt-4 bg-solo-mint border border-solo-mint-bdr rounded-lg p-3">
                  <p className="text-[13px] font-medium text-solo-deep-green">
                    Pay from ₦{bnplMonthly.toLocaleString('en-NG')}/month with Tendr
                  </p>
                  <p className="text-[11px] text-solo-muted mt-0.5">
                    Split your payment into easy instalments
                  </p>
                </div>
              )}
            </div>

            {/* Summary & CTAs */}
            <div className="border-t border-gray-100 px-6 py-4">
              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value)
                    setPromoError('')
                  }}
                  className="flex-1 h-10 px-3 text-[14px] border border-gray-200 rounded-btn focus:outline-none focus:border-solo-green"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo}
                  className="px-4 h-10 text-[14px] font-medium text-solo-green border border-solo-green rounded-btn hover:bg-solo-mint transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplyingPromo ? 'Applying' : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="text-solo-red text-[13px] mb-3">{promoError}</p>
              )}

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[14px]">
                  <span className="text-solo-muted">Subtotal</span>
                  <span className="font-semibold text-solo-navy">
                    ₦{subtotal.toLocaleString('en-NG')}
                  </span>
                </div>
                {promotion && discountAmount > 0 && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-solo-muted">Discount ({promotion.code})</span>
                    <span className="font-semibold text-solo-green">
                      -â‚¦{discountAmount.toLocaleString('en-NG')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[15px] pt-2 border-t border-gray-100">
                  <span className="font-semibold text-solo-navy">Total</span>
                  <span className="font-bold text-solo-navy">
                    â‚¦{total.toLocaleString('en-NG')}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-solo-green text-solo-deep-green text-center font-semibold py-3 rounded-btn hover:bg-solo-deep-green hover:text-white transition-all"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full border border-solo-navy text-solo-navy text-center font-semibold py-3 rounded-btn hover:bg-solo-navy hover:text-white transition-all"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
