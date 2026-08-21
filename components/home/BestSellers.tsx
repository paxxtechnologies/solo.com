'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '@/components/product/ProductCard'
import { publicProductsService } from '@/services/products.service'

export function BestSellers() {
  const bestSellersQuery = useQuery({
    queryKey: ['home-best-sellers'],
    queryFn: () => publicProductsService.list({ Limit: 8 }),
  })

  const bestSellers = bestSellersQuery.data?.items ?? []

  return (
    <section className="py-16 max-md:py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        {/* Header */}
        <div className="flex items-baseline gap-3 mb-8">
          <h2 className="text-2xl font-bold text-solo-navy">Best Sellers</h2>
          <span className="text-[13px] text-solo-muted">This Month</span>
        </div>

        {/* Products Grid */}
        {/* TODO: no confirmed API SortBy value for popularity-based Best Sellers yet */}
        <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/shop?sort=best-selling"
            className="text-solo-green font-medium hover:underline"
          >
            View all best sellers →
          </Link>
        </div>
      </div>
    </section>
  )
}
