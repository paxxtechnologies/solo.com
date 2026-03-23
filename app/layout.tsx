import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Solo.com — Number 1 Gadget Hub | South East Nigeria',
  description: 'South East Nigeria\'s Number 1 Gadget Hub. Shop smartphones, laptops, accessories, and more with same-day delivery in Enugu, flexible payment options, and verified stock.',
  keywords: ['gadgets', 'electronics', 'smartphones', 'laptops', 'Enugu', 'Nigeria', 'buy now pay later'],
  generator: 'Solo.com',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1A2B4A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
