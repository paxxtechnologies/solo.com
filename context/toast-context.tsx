'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, message, type }

    setToasts((prev) => {
      // Max 3 toasts visible - oldest dismissed first
      const updated = [...prev, newToast]
      if (updated.length > 3) {
        return updated.slice(1)
      }
      return updated
    })

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id)
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle
            : toast.type === 'error' || toast.type === 'warning'
            ? AlertCircle
            : Info

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all animate-in slide-in-from-right-full ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-900'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : toast.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex gap-3 w-full items-center">
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  toast.type === 'success'
                    ? 'text-green-600'
                    : toast.type === 'error'
                    ? 'text-red-600'
                    : toast.type === 'warning'
                    ? 'text-yellow-600'
                    : 'text-blue-600'
                }`}
              />
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="rounded-md opacity-50 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
