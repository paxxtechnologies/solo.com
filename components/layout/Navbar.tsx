'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SoloLogo } from '@/components/ui/SoloLogo'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { useAuth } from '@/context/auth-context'
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Home,
  Grid3X3,
  UserCircle,
} from 'lucide-react'
import { products } from '@/lib/mock-data'
import Image from 'next/image'

const navLinks = [
  { name: 'Smartphones', href: '/shop/smartphones' },
  { name: 'Laptops', href: '/shop/laptops' },
  { name: 'Accessories', href: '/shop/accessories' },
  { name: 'Audio', href: '/shop/audio' },
  { name: 'Smart Devices', href: '/shop/smart-devices' },
  { name: 'Flash Deals', href: '/flash-deals', hasIndicator: true },
  { name: 'SoloSwap', href: '/soloswap' },
  { name: 'Our Stores', href: '/stores' },
]

export function Navbar() {
  const pathname = usePathname()
  const { itemCount, openCart } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof products>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      setIsSearchOpen(false)
      return
    }

    // Mock search - in production this would be an API call
    const filtered = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6)

    setSearchResults(filtered)
    setIsSearchOpen(filtered.length > 0)
  }, [searchQuery])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-solo-navy h-16">
        <div className="max-w-[1280px] mx-auto px-6 max-md:px-4 h-full">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between h-full gap-6">
            {/* Left - Logo */}
            <Link href="/" className="flex-shrink-0">
              <SoloLogo variant="reversed" size="md" />
            </Link>

            {/* Center - Search */}
            <div ref={searchRef} className="relative flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  suppressHydrationWarning
                  type="text"
                  placeholder="Search for gadgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-12 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-solo-green/50 transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-card shadow-lg overflow-hidden z-50">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-solo-soft-gray transition-colors"
                    >
                      <div className="w-12 h-12 relative bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-solo-navy truncate">
                          {product.name}
                        </p>
                        <p className="text-[14px] font-bold text-solo-navy">
                          ₦{product.price.toLocaleString('en-NG')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Icons */}
            <div className="flex items-center gap-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/2349066994388"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="#00C896"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                aria-label="View wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-solo-green text-solo-green' : 'text-white'}`}
                />
              </Link>

              {/* Cart */}
              <button
                suppressHydrationWarning
                onClick={openCart}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-solo-red text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated ? (
                  <button
                    suppressHydrationWarning
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-solo-green rounded-full flex items-center justify-center">
                      <span className="text-solo-deep-green font-semibold text-sm">
                        {user?.firstName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-white text-[14px] font-medium hover:text-solo-green transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                )}

                {isUserMenuOpen && isAuthenticated && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-card shadow-lg overflow-hidden z-50">
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-[14px] text-solo-navy hover:bg-solo-soft-gray transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-[14px] text-solo-navy hover:bg-solo-soft-gray transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-[14px] text-solo-red hover:bg-solo-soft-gray transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden flex-col h-full">
            {/* Row 1 */}
            <div className="flex items-center justify-between h-16">
              <button
                suppressHydrationWarning
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

              <Link href="/">
                <SoloLogo variant="reversed" size="sm" showTagline={false} />
              </Link>

              <button
                suppressHydrationWarning
                onClick={openCart}
                className="p-2 -mr-2 relative"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-solo-red text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Below main nav */}
        <div className="md:hidden bg-solo-navy px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search for gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-solo-green/50 transition-all text-[14px]"
            />
          </div>
        </div>
      </nav>

      {/* Desktop Primary Nav Bar */}
      <div className="hidden md:block bg-white border-b border-gray-200 h-11">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-center gap-8 h-11">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-[14px] font-medium transition-colors h-full border-b-2 ${pathname === link.href
                    ? 'text-solo-green border-solo-green'
                    : 'text-solo-navy border-transparent hover:text-solo-green'
                  }`}
              >
                {link.hasIndicator && (
                  <span className="w-2 h-2 bg-solo-red rounded-full animate-pulse" />
                )}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-solo-navy overflow-y-auto">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <SoloLogo variant="reversed" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <nav className="py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-[15px] font-medium ${pathname === link.href
                      ? 'text-solo-green bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.hasIndicator && (
                    <span className="w-2 h-2 bg-solo-red rounded-full animate-pulse" />
                  )}
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-white/10 p-4">
              <p className="text-white/50 text-[12px] uppercase tracking-wider mb-3">
                Contact Us
              </p>
              <p className="text-white/80 text-[14px] mb-1">0906 699 4388</p>
              <p className="text-white/80 text-[14px] mb-4">0906 703 2849</p>

              <a
                href="https://wa.me/2349066994388"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-solo-green text-solo-deep-green font-semibold py-3 rounded-btn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-40 md:hidden safe-area-inset-bottom">
        <div className="flex items-center justify-around h-full">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${pathname === '/' ? 'text-solo-green' : 'text-solo-muted'
              }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-medium">Home</span>
          </Link>

          <Link
            href="/shop"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${pathname.startsWith('/shop') ? 'text-solo-green' : 'text-solo-muted'
              }`}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[11px] font-medium">Categories</span>
          </Link>

          <button
            suppressHydrationWarning
            onClick={openCart}
            className="flex flex-col items-center gap-1 px-4 py-2 text-solo-muted relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-2 bg-solo-red text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
            <span className="text-[11px] font-medium">Cart</span>
          </button>

          <Link
            href="/account"
            className={`flex flex-col items-center gap-1 px-4 py-2 ${pathname.startsWith('/account') ? 'text-solo-green' : 'text-solo-muted'
              }`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-[11px] font-medium">Account</span>
          </Link>
        </div>
      </div>
    </>
  )
}
