'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { announcementMessages } from '@/lib/mock-data'

export function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(true) // Start hidden to prevent flash
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check localStorage on mount
    const dismissed = localStorage.getItem('solo_bar_dismissed')
    setIsDismissed(dismissed === 'true')
  }, [])

  useEffect(() => {
    if (isDismissed) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcementMessages.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [isDismissed])

  const handleDismiss = () => {
    localStorage.setItem('solo_bar_dismissed', 'true')
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
      <div className="bg-solo-green h-9 hidden md:flex items-center justify-center relative">
      <p
        className={`text-[13px] font-medium text-solo-deep-green text-center px-8 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {announcementMessages[currentIndex]}
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-4 p-1 hover:bg-solo-deep-green/10 rounded-full transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4 text-solo-deep-green" />
      </button>
    </div>
  )
}
