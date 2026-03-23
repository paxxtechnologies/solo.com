'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { products, categories } from '@/lib/mock-data'
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from 'lucide-react'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'best-selling', label: 'Most Sold' },
]

const brands = ['Apple', 'Samsung', 'Tecno', 'Infinix', 'HP', 'Lenovo', 'JBL']

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const categorySlug = params.category as string
  const category = categories.find((c) => c.slug === categorySlug)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    availability: true,
    condition: false,
    payment: false,
    rating: false,
  })

  // Filter state
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [availability, setAvailability] = useState('all')
  const [conditions, setConditions] = useState<string[]>([])
  const [paymentOptions, setPaymentOptions] = useState<string[]>([])
  const [minRating, setMinRating] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // Current page
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  // Apply filters
  let filteredProducts = products.filter((p) =>
    categorySlug === 'all' ? true : p.category === categorySlug
  )

  // Brand filter
  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedBrands.includes(p.brand)
    )
  }

  // Price filter
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseInt(minPrice)
    )
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseInt(maxPrice)
    )
  }

  // Availability filter
  if (availability === 'in-stock') {
    filteredProducts = filteredProducts.filter((p) => p.stockQty > 0)
  }

  // BNPL filter
  if (paymentOptions.includes('bnpl')) {
    filteredProducts = filteredProducts.filter((p) => p.isBnplEligible)
  }

  // Rating filter
  if (minRating !== 'all') {
    filteredProducts = filteredProducts.filter(
      (p) => p.rating >= parseInt(minRating)
    )
  }

  // Sort
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'best-selling') {
    filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const clearAllFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSelectedBrands([])
    setAvailability('all')
    setConditions([])
    setPaymentOptions([])
    setMinRating('all')
  }

  const appliedFiltersCount =
    selectedBrands.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    conditions.length +
    paymentOptions.length +
    (minRating !== 'all' ? 1 : 0)

  return (
    <div className="bg-solo-soft-gray min-h-screen pb-20 md:pb-8">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-solo-muted mb-4">
          <Link href="/" className="hover:text-solo-green">
            Home
          </Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-solo-navy">{category?.name || 'All Products'}</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-solo-navy">
              {category?.name || 'All Products'}
            </h1>
            <p className="text-[13px] text-solo-muted mt-1">
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-btn px-4 py-2 text-[14px] font-medium text-solo-navy"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {appliedFiltersCount > 0 && (
              <span className="bg-solo-green text-solo-deep-green text-[11px] rounded-full w-5 h-5 flex items-center justify-center">
                {appliedFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden md:block w-[240px] flex-shrink-0 sticky top-[112px] h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="bg-white rounded-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-solo-navy">Filters</h3>
                {appliedFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-solo-green text-[13px] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium text-solo-navy text-[14px]">
                    Price Range
                  </span>
                  {openSections.price ? (
                    <ChevronUp className="w-4 h-4 text-solo-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-solo-muted" />
                  )}
                </button>
                {openSections.price && (
                  <div className="pb-4 pt-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="₦ Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-btn focus:outline-none focus:border-solo-green"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="₦ Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-btn focus:outline-none focus:border-solo-green"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleSection('brand')}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium text-solo-navy text-[14px]">Brand</span>
                  {openSections.brand ? (
                    <ChevronUp className="w-4 h-4 text-solo-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-solo-muted" />
                  )}
                </button>
                {openSections.brand && (
                  <div className="pb-4 pt-2 space-y-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded accent-solo-green"
                        />
                        <span className="text-[14px] text-solo-body-text">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleSection('availability')}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium text-solo-navy text-[14px]">
                    Availability
                  </span>
                  {openSections.availability ? (
                    <ChevronUp className="w-4 h-4 text-solo-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-solo-muted" />
                  )}
                </button>
                {openSections.availability && (
                  <div className="pb-4 pt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'in-stock'}
                        onChange={() => setAvailability('in-stock')}
                        className="w-4 h-4 accent-solo-green"
                      />
                      <span className="text-[14px] text-solo-body-text">
                        In Stock
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'all'}
                        onChange={() => setAvailability('all')}
                        className="w-4 h-4 accent-solo-green"
                      />
                      <span className="text-[14px] text-solo-body-text">All</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Payment Options */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleSection('payment')}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium text-solo-navy text-[14px]">
                    Payment Options
                  </span>
                  {openSections.payment ? (
                    <ChevronUp className="w-4 h-4 text-solo-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-solo-muted" />
                  )}
                </button>
                {openSections.payment && (
                  <div className="pb-4 pt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentOptions.includes('bnpl')}
                        onChange={() =>
                          setPaymentOptions((prev) =>
                            prev.includes('bnpl')
                              ? prev.filter((p) => p !== 'bnpl')
                              : [...prev, 'bnpl']
                          )
                        }
                        className="w-4 h-4 rounded accent-solo-green"
                      />
                      <span className="text-[14px] text-solo-body-text">
                        BNPL (Tendr) Available
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleSection('rating')}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium text-solo-navy text-[14px]">
                    Rating
                  </span>
                  {openSections.rating ? (
                    <ChevronUp className="w-4 h-4 text-solo-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-solo-muted" />
                  )}
                </button>
                {openSections.rating && (
                  <div className="pb-4 pt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === '4'}
                        onChange={() => setMinRating('4')}
                        className="w-4 h-4 accent-solo-green"
                      />
                      <span className="text-[14px] text-solo-body-text">
                        4★ & above
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === '3'}
                        onChange={() => setMinRating('3')}
                        className="w-4 h-4 accent-solo-green"
                      />
                      <span className="text-[14px] text-solo-body-text">
                        3★ & above
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === 'all'}
                        onChange={() => setMinRating('all')}
                        className="w-4 h-4 accent-solo-green"
                      />
                      <span className="text-[14px] text-solo-body-text">All</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-card p-3 mb-4 flex items-center justify-between">
              <span className="text-[14px] text-solo-muted max-md:hidden">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[14px] font-medium text-solo-navy focus:outline-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-card p-12 text-center">
                <h3 className="text-xl font-semibold text-solo-navy mb-2">
                  No products found
                </h3>
                <p className="text-[14px] text-solo-muted mb-4">
                  Try adjusting your filters or search for something else.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-solo-green font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-[14px] font-medium text-solo-navy bg-white rounded-btn border border-gray-200 hover:border-solo-green disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 text-[14px] font-medium rounded-btn ${
                        currentPage === pageNum
                          ? 'bg-solo-green text-solo-deep-green'
                          : 'bg-white text-solo-navy border border-gray-200 hover:border-solo-green'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-[14px] font-medium text-solo-navy bg-white rounded-btn border border-gray-200 hover:border-solo-green disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-solo-navy">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Same filter content as desktop */}
              {/* Price Range */}
              <div className="pb-4">
                <p className="font-medium text-solo-navy text-[14px] mb-2">
                  Price Range
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="₦ Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 h-10 px-3 text-[14px] border border-gray-200 rounded-btn focus:outline-none focus:border-solo-green"
                  />
                  <input
                    type="number"
                    placeholder="₦ Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 h-10 px-3 text-[14px] border border-gray-200 rounded-btn focus:outline-none focus:border-solo-green"
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="pb-4 border-t border-gray-100 pt-4">
                <p className="font-medium text-solo-navy text-[14px] mb-2">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1.5 text-[13px] rounded-pill border ${
                        selectedBrands.includes(brand)
                          ? 'bg-solo-green text-solo-deep-green border-solo-green'
                          : 'bg-white text-solo-body-text border-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* BNPL */}
              <div className="pb-4 border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentOptions.includes('bnpl')}
                    onChange={() =>
                      setPaymentOptions((prev) =>
                        prev.includes('bnpl')
                          ? prev.filter((p) => p !== 'bnpl')
                          : [...prev, 'bnpl']
                      )
                    }
                    className="w-5 h-5 rounded accent-solo-green"
                  />
                  <span className="text-[14px] text-solo-body-text">
                    BNPL (Tendr) Available
                  </span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 text-[14px] font-medium text-solo-navy border border-gray-200 rounded-btn"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3 text-[14px] font-semibold bg-solo-green text-solo-deep-green rounded-btn"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
