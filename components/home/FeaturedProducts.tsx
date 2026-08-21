'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '@/components/product/ProductCard'
import { publicProductsService } from '@/services/products.service'

const tabs = [
  { id: 'all', name: 'All' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'accessories', name: 'Accessories' },
]

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('all')

  const productsQuery = useQuery({
    queryKey: ['home-latest-arrivals', activeTab],
    queryFn: () =>
      activeTab === 'all'
        ? publicProductsService.list({ Limit: 8 })
        : publicProductsService.byCategory(activeTab, { limit: 8, offset: 0 }),
  })

  const filteredProducts = productsQuery.data?.items ?? []

  return (
    <section className="py-16 max-md:py-12 bg-solo-soft-gray">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        {/* Header with Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-solo-navy">Latest Arrivals</h2>

          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                suppressHydrationWarning
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1 text-[14px] font-medium rounded-pill transition-colors ${activeTab === tab.id
                    ? 'bg-solo-green text-solo-deep-green'
                    : 'text-solo-muted hover:text-solo-navy'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="text-solo-green font-medium hover:underline"
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  )
}
