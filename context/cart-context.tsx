'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Product } from '@/lib/mock-data'

export interface CartItem {
  product: Product
  quantity: number
  selectedVariant?: { name: string; value: string }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; selectedVariant?: { name: string; value: string } } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false,
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
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [...state.items, { product, quantity, selectedVariant }],
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.productId),
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
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'HYDRATE':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  items: CartItem[]
  addItem: (product: Product, quantity?: number, selectedVariant?: { name: string; value: string }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  itemCount: number
  subtotal: number
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
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch {
        console.error('Failed to parse cart from localStorage')
      }
    }
  }, [])

  // Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('solo_cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product, quantity = 1, selectedVariant?: { name: string; value: string }) => {
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

  return (
    <CartContext.Provider
      value={{
        state,
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        itemCount,
        subtotal,
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
