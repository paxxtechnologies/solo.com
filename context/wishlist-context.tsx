'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Product } from '@/lib/mock-data'

interface WishlistState {
  items: Product[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'TOGGLE_ITEM'; payload: Product }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'HYDRATE'; payload: Product[] }

const initialState: WishlistState = {
  items: [],
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.items.find((item) => item.id === action.payload.id)) {
        return state
      }
      return { ...state, items: [...state.items, action.payload] }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    }

    case 'TOGGLE_ITEM': {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] }

    case 'HYDRATE':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Hydrate wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('solo_wishlist')
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch {
        console.error('Failed to parse wishlist from localStorage')
      }
    }
  }, [])

  // Save wishlist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('solo_wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const toggleItem = (product: Product) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: product })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (productId: string) => {
    return state.items.some((item) => item.id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
        isInWishlist,
        itemCount: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
