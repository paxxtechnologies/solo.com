'use client'

import { CartProvider } from '@/context/cart-context'
import { WishlistProvider } from '@/context/wishlist-context'
import { AuthProvider } from '@/context/auth-context'
import { ToastProvider, ToastContainer } from '@/context/toast-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
