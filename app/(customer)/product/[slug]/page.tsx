'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { ProductCard } from '@/components/product/ProductCard'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/context/toast-context'
import { products } from '@/lib/mock-data'
import {
  Minus,
  Plus,
  ShieldCheck,
  RefreshCw,
  Lock,
  Zap,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Check,
  Loader2,
} from 'lucide-react'

// Star rating component
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
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

const deliveryInfo = [
  { location: 'Enugu (Same City)', time: 'Order before 2PM → Delivered today' },
  { location: 'Abakiliki', time: 'Next business day' },
  { location: 'South East (Other)', time: '1–2 business days' },
  { location: 'Nationwide', time: '3–5 business days' },
]

const tabs = ['Description', 'Specifications', 'Reviews', 'Delivery & Returns']

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = products.find((p) => p.slug === slug)

  const { addItem, openCart } = useCart()
  const { showToast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Description')
  const [isAdding, setIsAdding] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Initialize variants
  useEffect(() => {
    if (product?.variants) {
      const initialVariants: Record<string, string> = {}
      product.variants.forEach((variant) => {
        const availableOption = variant.options.find((opt) => opt.stock > 0)
        if (availableOption) {
          initialVariants[variant.name] = availableOption.value
        }
      })
      setSelectedVariants(initialVariants)
    }
  }, [product])

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-solo-navy mb-4">Product not found</h1>
        <Link href="/shop" className="text-solo-green hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const hasDiscount = product.salePrice && product.salePrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.salePrice!) * 100)
    : 0

  const bnplMonthly =
    product.isBnplEligible && product.price >= 25000
      ? Math.round(product.price / 3)
      : 0

  const isSmartphoneOrLaptop =
    product.category === 'smartphones' || product.category === 'laptops'

  const handleAddToCart = async () => {
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    addItem(product, quantity)
    showToast('Added to cart', 'success')
    setIsAdding(false)
  }

  const handleBuyNow = async () => {
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    addItem(product, quantity)
    setIsAdding(false)
    openCart()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    const text = `Check out ${product.name} on Solo.com - ₦${product.price.toLocaleString('en-NG')} ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="bg-solo-soft-gray min-h-screen pb-20 md:pb-8">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-solo-muted mb-4">
          <Link href="/" className="hover:text-solo-green">
            Home
          </Link>
          <span className="mx-2">{'/'}</span>
          <Link href={`/shop/${product.category}`} className="hover:text-solo-green capitalize">
            {product.category}
          </Link>
          <span className="mx-2">{'/'}</span>
          <span className="text-solo-navy">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-8">
          {/* Left - Image Gallery */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            isVerified={product.badges.includes('verified')}
          />

          {/* Right - Product Info */}
          <div>
            {/* Product Name */}
            <h1 className="text-3xl max-md:text-2xl font-bold text-solo-navy mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(product.rating)} />
              <span className="text-[13px] text-solo-muted">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-card p-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[32px] font-bold text-solo-navy">
                  ₦{product.price.toLocaleString('en-NG')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-[16px] text-solo-muted line-through">
                      ₦{product.salePrice!.toLocaleString('en-NG')}
                    </span>
                    <span className="bg-solo-red text-white text-[12px] font-bold rounded px-2 py-0.5">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* BNPL Card */}
              {bnplMonthly > 0 && (
                <div className="bg-solo-mint border border-solo-mint-bdr rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-solo-deep-green">
                      Tendr
                    </span>
                    <span className="text-[13px] text-solo-muted">
                      Buy Now, Pay Later
                    </span>
                  </div>
                  <p className="text-[18px] font-bold text-solo-deep-green">
                    Pay from ₦{bnplMonthly.toLocaleString('en-NG')}/month
                  </p>
                  <p className="text-[12px] text-solo-muted mt-1">
                    0% interest · Instant approval · 3–12 month plans
                  </p>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-card mb-4">
              <button
                onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                className="flex items-center justify-between w-full p-4"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-solo-green" />
                  <span className="font-semibold text-solo-navy text-[14px]">
                    Delivery Information
                  </span>
                </div>
                {isDeliveryOpen ? (
                  <ChevronUp className="w-5 h-5 text-solo-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-solo-muted" />
                )}
              </button>
              {isDeliveryOpen && (
                <div className="px-4 pb-4">
                  <table className="w-full text-[13px]">
                    <tbody>
                      {deliveryInfo.map((info) => (
                        <tr key={info.location} className="border-t border-gray-100">
                          <td className="py-2 text-solo-muted w-1/3">{info.location}</td>
                          <td className="py-2 text-solo-body-text">{info.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[12px] text-solo-muted mt-2">
                    Updates sent to your WhatsApp at every stage
                  </p>
                </div>
              )}
            </div>

            {/* Trade-In Strip */}
            {isSmartphoneOrLaptop && (
              <div className="bg-solo-mint border border-solo-mint-bdr rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-[13px] text-solo-deep-green font-medium">
                  Have an old device? Get instant store credit.
                </span>
                <Link
                  href="/soloswap"
                  className="text-solo-green text-[13px] font-medium hover:underline"
                >
                  Check SoloSwap value →
                </Link>
              </div>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                {product.variants.map((variant) => (
                  <div key={variant.name} className="mb-3">
                    <p className="text-[14px] font-medium text-solo-navy mb-2">
                      {variant.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => {
                        const isSelected = selectedVariants[variant.name] === option.value
                        const isOutOfStock = option.stock === 0
                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              !isOutOfStock &&
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: option.value,
                              }))
                            }
                            disabled={isOutOfStock}
                            className={`px-4 py-2 text-[13px] font-medium rounded-btn border-2 transition-colors ${
                              isSelected
                                ? 'bg-solo-green text-solo-deep-green border-solo-green'
                                : isOutOfStock
                                  ? 'bg-gray-100 text-solo-muted border-gray-200 line-through cursor-not-allowed'
                                  : 'bg-white text-solo-navy border-gray-200 hover:border-solo-green'
                            }`}
                          >
                            {option.value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[14px] font-medium text-solo-navy">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded hover:border-solo-green transition-colors"
                >
                  <Minus className="w-4 h-4 text-solo-navy" />
                </button>
                <span className="w-8 text-center font-semibold text-solo-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQty, q + 1))}
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded hover:border-solo-green transition-colors"
                >
                  <Plus className="w-4 h-4 text-solo-navy" />
                </button>
              </div>
            </div>

            {/* Stock Warning */}
            {product.stockQty > 0 && product.stockQty <= 5 && (
              <p className="text-amber-600 text-[13px] font-medium mb-4">
                Only {product.stockQty} left in stock
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQty === 0 || isAdding}
                className="w-full bg-solo-green text-solo-deep-green font-bold py-4 rounded-btn text-[15px] hover:bg-solo-deep-green hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : product.stockQty === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stockQty === 0 || isAdding}
                className="w-full border-2 border-solo-navy text-solo-navy font-bold py-4 rounded-btn text-[15px] hover:bg-solo-navy hover:text-white transition-all disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-solo-muted" />
                <span className="text-[12px] text-solo-muted">Verified Stock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-solo-muted" />
                <span className="text-[12px] text-solo-muted">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-solo-muted" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="text-[12px] text-solo-muted">WhatsApp Support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-solo-muted" />
                <span className="text-[12px] text-solo-muted">Secure Payment</span>
              </div>
            </div>

            {/* Share Row */}
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-solo-muted">Share this deal:</span>
              <button
                onClick={handleWhatsAppShare}
                className="p-2 hover:bg-solo-soft-gray rounded-full transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-[18px] h-[18px] text-solo-green" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-solo-soft-gray rounded-full transition-colors"
                aria-label="Copy link"
              >
                {linkCopied ? (
                  <Check className="w-[18px] h-[18px] text-solo-green" />
                ) : (
                  <Copy className="w-[18px] h-[18px] text-solo-muted" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mt-8">
          {/* Tab Bar */}
          <div className="border-b border-gray-200 bg-white rounded-t-card">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-[14px] font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-solo-navy border-b-2 border-solo-green'
                      : 'text-solo-muted hover:text-solo-navy'
                  }`}
                >
                  {tab}
                  {tab === 'Reviews' && ` (${product.reviewCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-card p-6">
            {activeTab === 'Description' && (
              <div
                className="prose max-w-none text-solo-body-text"
                dangerouslySetInnerHTML={{
                  __html: product.description || '<p>No description available.</p>',
                }}
              />
            )}

            {activeTab === 'Specifications' && product.specifications && (
              <table className="w-full text-[14px]">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr
                      key={spec.key}
                      className={index % 2 === 1 ? 'bg-solo-soft-gray' : ''}
                    >
                      <td className="py-3 px-4 text-solo-muted w-1/3">{spec.key}</td>
                      <td className="py-3 px-4 text-solo-navy font-medium">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'Reviews' && (
              <div>
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-[48px] font-bold text-solo-navy">
                      {product.rating}
                    </p>
                    <StarRating rating={Math.round(product.rating)} />
                    <p className="text-[13px] text-solo-muted mt-1">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                </div>
                <p className="text-solo-muted text-[14px]">
                  Reviews will be loaded from the API.
                </p>
              </div>
            )}

            {activeTab === 'Delivery & Returns' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-solo-navy mb-3">Delivery</h4>
                  <table className="w-full text-[14px]">
                    <tbody>
                      {deliveryInfo.map((info) => (
                        <tr key={info.location} className="border-t border-gray-100">
                          <td className="py-2 text-solo-muted w-1/3">{info.location}</td>
                          <td className="py-2 text-solo-body-text">{info.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-semibold text-solo-navy mb-3">Returns</h4>
                  <p className="text-solo-body-text text-[14px] leading-relaxed">
                    Changed your mind? Return any item to our Enugu or Abakiliki store
                    within 30 days. No courier, no hassle. Instant refund or exchange
                    processed in-store.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-solo-navy mb-6">
              You might also like
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="flex-shrink-0 w-[280px] max-md:w-[240px] snap-start"
                >
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
