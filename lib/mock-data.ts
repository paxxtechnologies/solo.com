// Mock data for Solo.com e-commerce platform
// This data will be replaced with actual API calls in production

export interface Product {
  id: string
  name: string
  slug: string
  images: string[]
  price: number
  salePrice?: number
  brand: string
  category: string
  stockQty: number
  rating: number
  reviewCount: number
  isBnplEligible: boolean
  badges: ('verified' | 'flash' | 'new' | 'bestseller')[]
  description?: string
  specifications?: { key: string; value: string }[]
  variants?: {
    name: string
    options: { id?: string; value: string; priceOverride?: number; stock: number }[]
  }[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  productCount: number
}

export interface Testimonial {
  id: string
  customerName: string
  city: string
  rating: number
  quote: string
  isVerifiedPurchase: boolean
  date: string
}

export interface FlashDeal {
  id: string
  product: Product
  discountPercent: number
  startTime: string
  endTime: string
}

export const categories: Category[] = [
  { id: '1', name: 'Smartphones', slug: 'smartphones', icon: 'smartphone', productCount: 124 },
  { id: '2', name: 'Laptops', slug: 'laptops', icon: 'laptop', productCount: 67 },
  { id: '3', name: 'Accessories', slug: 'accessories', icon: 'headphones', productCount: 234 },
  { id: '4', name: 'Audio', slug: 'audio', icon: 'speaker', productCount: 89 },
  { id: '5', name: 'Smart Devices', slug: 'smart-devices', icon: 'watch', productCount: 56 },
  { id: '6', name: 'Certified Refurbished', slug: 'certified-refurbished', icon: 'refresh', productCount: 45 },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    slug: 'iphone-15-pro-max-256gb-natural-titanium',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80',
    ],
    price: 1850000,
    brand: 'Apple',
    category: 'smartphones',
    stockQty: 12,
    rating: 4.8,
    reviewCount: 156,
    isBnplEligible: true,
    badges: ['verified', 'bestseller'],
    description: '<p>The iPhone 15 Pro Max features a titanium design, A17 Pro chip, and an advanced camera system with a 5x Telephoto camera.</p>',
    specifications: [
      { key: 'Display', value: '6.7-inch Super Retina XDR OLED' },
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Storage', value: '256GB' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto' },
      { key: 'Battery', value: 'Up to 29 hours video playback' },
    ],
    variants: [
      {
        name: 'Storage',
        options: [
          { value: '256GB', stock: 12 },
          { value: '512GB', priceOverride: 2150000, stock: 8 },
          { value: '1TB', priceOverride: 2450000, stock: 4 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    ],
    price: 1650000,
    salePrice: 1850000,
    brand: 'Samsung',
    category: 'smartphones',
    stockQty: 8,
    rating: 4.7,
    reviewCount: 89,
    isBnplEligible: true,
    badges: ['verified', 'flash'],
    description: '<p>Experience the ultimate Galaxy with AI-powered features, titanium frame, and S Pen built-in.</p>',
    specifications: [
      { key: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'Storage', value: '512GB' },
      { key: 'RAM', value: '12GB' },
      { key: 'Camera', value: '200MP Main + 12MP Ultra Wide + 50MP 5x Telephoto + 10MP 3x Telephoto' },
    ],
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3 Pro 512GB',
    slug: 'macbook-pro-14-m3-pro-512gb',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    ],
    price: 2850000,
    brand: 'Apple',
    category: 'laptops',
    stockQty: 5,
    rating: 4.9,
    reviewCount: 67,
    isBnplEligible: true,
    badges: ['verified', 'new'],
    description: '<p>The most advanced MacBook Pro ever, featuring the M3 Pro chip for extraordinary performance.</p>',
    specifications: [
      { key: 'Display', value: '14.2-inch Liquid Retina XDR' },
      { key: 'Chip', value: 'Apple M3 Pro' },
      { key: 'Memory', value: '18GB Unified Memory' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Battery', value: 'Up to 17 hours' },
    ],
  },
  {
    id: '4',
    name: 'AirPods Pro 2nd Generation',
    slug: 'airpods-pro-2nd-generation',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
    ],
    price: 185000,
    brand: 'Apple',
    category: 'audio',
    stockQty: 25,
    rating: 4.6,
    reviewCount: 234,
    isBnplEligible: true,
    badges: ['verified', 'bestseller'],
    description: '<p>Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.</p>',
    specifications: [
      { key: 'Chip', value: 'Apple H2' },
      { key: 'Battery Life', value: 'Up to 6 hours (30 hours with case)' },
      { key: 'Features', value: 'Active Noise Cancellation, Transparency Mode' },
      { key: 'Connectivity', value: 'Bluetooth 5.3' },
    ],
  },
  {
    id: '5',
    name: 'Tecno Camon 30 Premier 512GB',
    slug: 'tecno-camon-30-premier-512gb',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    ],
    price: 520000,
    salePrice: 580000,
    brand: 'Tecno',
    category: 'smartphones',
    stockQty: 18,
    rating: 4.4,
    reviewCount: 78,
    isBnplEligible: true,
    badges: ['verified', 'flash'],
  },
  {
    id: '6',
    name: 'Samsung 50" Crystal UHD 4K Smart TV',
    slug: 'samsung-50-crystal-uhd-4k-smart-tv',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
    ],
    price: 485000,
    brand: 'Samsung',
    category: 'smart-devices',
    stockQty: 6,
    rating: 4.5,
    reviewCount: 45,
    isBnplEligible: true,
    badges: ['verified'],
  },
  {
    id: '7',
    name: 'HP Pavilion 15 Intel Core i7 512GB SSD',
    slug: 'hp-pavilion-15-intel-core-i7-512gb-ssd',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    ],
    price: 750000,
    brand: 'HP',
    category: 'laptops',
    stockQty: 3,
    rating: 4.3,
    reviewCount: 56,
    isBnplEligible: true,
    badges: ['verified'],
  },
  {
    id: '8',
    name: 'JBL Charge 5 Portable Bluetooth Speaker',
    slug: 'jbl-charge-5-portable-bluetooth-speaker',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    ],
    price: 125000,
    salePrice: 145000,
    brand: 'JBL',
    category: 'audio',
    stockQty: 15,
    rating: 4.7,
    reviewCount: 123,
    isBnplEligible: true,
    badges: ['verified', 'bestseller'],
  },
  {
    id: '9',
    name: 'Infinix Note 40 Pro 5G 256GB',
    slug: 'infinix-note-40-pro-5g-256gb',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    ],
    price: 285000,
    brand: 'Infinix',
    category: 'smartphones',
    stockQty: 22,
    rating: 4.2,
    reviewCount: 67,
    isBnplEligible: true,
    badges: ['verified', 'new'],
  },
  {
    id: '10',
    name: 'Apple Watch Series 9 GPS 45mm',
    slug: 'apple-watch-series-9-gps-45mm',
    images: [
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80',
    ],
    price: 485000,
    brand: 'Apple',
    category: 'smart-devices',
    stockQty: 10,
    rating: 4.8,
    reviewCount: 89,
    isBnplEligible: true,
    badges: ['verified', 'bestseller'],
  },
  {
    id: '11',
    name: 'Samsung Galaxy Buds2 Pro',
    slug: 'samsung-galaxy-buds2-pro',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    ],
    price: 145000,
    brand: 'Samsung',
    category: 'audio',
    stockQty: 20,
    rating: 4.5,
    reviewCount: 98,
    isBnplEligible: true,
    badges: ['verified'],
  },
  {
    id: '12',
    name: 'Lenovo IdeaPad Slim 3 Intel i5 256GB',
    slug: 'lenovo-ideapad-slim-3-intel-i5-256gb',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    ],
    price: 420000,
    salePrice: 480000,
    brand: 'Lenovo',
    category: 'laptops',
    stockQty: 7,
    rating: 4.3,
    reviewCount: 45,
    isBnplEligible: true,
    badges: ['verified', 'flash'],
  },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    customerName: 'Chinedu O.',
    city: 'Enugu',
    rating: 5,
    quote: 'I ordered my iPhone 15 Pro Max at 10am and received it by 3pm the same day! The Solo team even helped me transfer my data. Best gadget shopping experience in Enugu.',
    isVerifiedPurchase: true,
    date: '2024-12-15',
  },
  {
    id: '2',
    customerName: 'Adaeze N.',
    city: 'Abakiliki',
    rating: 5,
    quote: 'The Tendr BNPL option made it possible for me to get my dream laptop. Paying monthly is so much easier. Thank you Solo!',
    isVerifiedPurchase: true,
    date: '2024-12-10',
  },
  {
    id: '3',
    customerName: 'Emeka K.',
    city: 'Nsukka',
    rating: 4,
    quote: 'Very professional service. They verified the phone was original before selling. Finally found a trusted gadget store in South East.',
    isVerifiedPurchase: true,
    date: '2024-12-08',
  },
]

export const flashDeals: FlashDeal[] = [
  {
    id: '1',
    product: products[1], // Samsung Galaxy S24 Ultra
    discountPercent: 11,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  },
  {
    id: '2',
    product: products[4], // Tecno Camon 30
    discountPercent: 10,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    product: products[7], // JBL Charge 5
    discountPercent: 14,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    product: products[11], // Lenovo IdeaPad
    discountPercent: 13,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const heroContent = {
  headline: 'We have something for you',
  subheadline: 'Different specs. Flexible payment. Speedy delivery. Quality assured.',
  primaryCta: { label: 'Shop Now', url: '/shop' },
  secondaryCta: { label: 'Pay in Instalments', url: '/tendr' },
  featuredProduct: products[0],
}

export const storeInfo = {
  enugu: {
    name: 'Enugu Store',
    address: 'Shop 45, Computer Village, Ogui Road, Enugu',
    phone1: '0906 699 4388',
    phone2: '0906 703 2849',
    hours: 'Mon–Sat: 8AM–7PM · Sun: 10AM–5PM',
    mapsUrl: 'https://maps.google.com/?q=Computer+Village+Ogui+Road+Enugu',
  },
  abakiliki: {
    name: 'Abakiliki Store',
    address: 'No. 12, Kpirikpiri, Abakiliki, Ebonyi State',
    phone1: '0906 699 4388',
    phone2: '0906 703 2849',
    hours: 'Mon–Sat: 8AM–7PM · Sun: 10AM–5PM',
    mapsUrl: 'https://maps.google.com/?q=Kpirikpiri+Abakiliki+Ebonyi',
  },
}

export const announcementMessages = [
  'Free delivery on orders above ₦20,000 — Enugu & Abakiliki same day',
  'Buy now, pay later from ₦5,000/month — powered by Tendr',
  'Trade in your old phone for instant store credit — SoloSwap',
  'Number 1 Gadget Hub · 0906 699 4388 · 0906 703 2849 · @sololinks042',
]
