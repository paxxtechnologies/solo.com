'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Product } from '@/lib/mock-data'

export interface CartItem {
  product: Product
  quantity: number
  selectedVariant?: { id?: string; name: string; value: string }
}

export interface AppliedPromotion {
  code: string
  discountAmount: number
  finalAmount: number
  message?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  promotion: AppliedPromotion | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; selectedVariant?: { id?: string; name: string; value: string } } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PROMOTION'; payload: AppliedPromotion }
  | { type: 'CLEAR_PROMOTION' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: { items: CartItem[]; promotion: AppliedPromotion | null } }

const initialState: CartState = {
  items: [],
  isOpen: false,
  promotion: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, selectedVariant } = action.payload
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      )

      if (existingIndex > -1) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        }
        return { ...state, items: newItems, promotion: null }
      }

      return {
        ...state,
        items: [...state.items, { product, quantity, selectedVariant }],
        promotion: null,
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.productId),
        promotion: null,
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      if (quantity < 1) return state

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
        promotion: null,
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [], promotion: null }

    case 'SET_PROMOTION':
      return { ...state, promotion: action.payload }

    case 'CLEAR_PROMOTION':
      return { ...state, promotion: null }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'HYDRATE':
      return { ...state, items: action.payload.items, promotion: action.payload.promotion }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  items: CartItem[]
  addItem: (product: Product, quantity?: number, selectedVariant?: { id?: string; name: string; value: string }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setPromotion: (promotion: AppliedPromotion) => void
  clearPromotion: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  itemCount: number
  subtotal: number
  discountAmount: number
  total: number
  promotion: AppliedPromotion | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('solo_cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        dispatch({
          type: 'HYDRATE',
          payload: Array.isArray(parsed)
            ? { items: parsed, promotion: null }
            : { items: parsed.items ?? [], promotion: parsed.promotion ?? null },
        })
      } catch {
        console.error('Failed to parse cart from localStorage')
      }
    }
  }, [])

  // Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('solo_cart', JSON.stringify({
      items: state.items,
      promotion: state.promotion,
    }))
  }, [state.items, state.promotion])

  const addItem = (product: Product, quantity = 1, selectedVariant?: { id?: string; name: string; value: string }) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedVariant } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setPromotion = (promotion: AppliedPromotion) => {
    dispatch({ type: 'SET_PROMOTION', payload: promotion })
  }

  const clearPromotion = () => {
    dispatch({ type: 'CLEAR_PROMOTION' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = state.items.reduce((total, item) => {
    const price = item.product.salePrice ? item.product.price : item.product.price
    return total + price * item.quantity
  }, 0)
  const discountAmount = state.promotion?.discountAmount ?? 0
  const total = Math.max(subtotal - discountAmount, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setPromotion,
        clearPromotion,
        toggleCart,
        openCart,
        closeCart,
        itemCount,
        subtotal,
        discountAmount,
        total,
        promotion: state.promotion,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
