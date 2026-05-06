'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from '@/context/cart-context'
import { WishlistProvider } from '@/context/wishlist-context'
import { ToastProvider, ToastContainer } from '@/context/toast-context'
import { useInitAuth } from '@/hooks/auth/useInitAuth'

function AuthInit() {
  useInitAuth()
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <AuthInit />
            {children}
            <ToastContainer />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  )
}