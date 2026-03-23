'use client'

import { useState } from 'react'
import { useToast } from '@/context/toast-context'
import { Loader2 } from 'lucide-react'

export function WhatsAppCta() {
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !whatsapp.trim()) {
      showToast('Please fill in all fields', 'error')
      return
    }

    // Validate Nigerian phone number
    const phoneRegex = /^0[7-9][0-1]\d{8}$/
    if (!phoneRegex.test(whatsapp.replace(/\s/g, ''))) {
      showToast('Enter a valid Nigerian mobile number', 'error')
      return
    }

    setIsLoading(true)

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      showToast('Thanks! You\'ll receive our best deals on WhatsApp', 'success')
      setName('')
      setWhatsapp('')
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-r from-solo-navy to-solo-deep-navy py-16 max-md:py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4 text-center">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          Get exclusive deals on WhatsApp
        </h2>
        <p className="text-solo-mint/80 mb-8">
          Join 5,000+ gadget lovers in Enugu and Ebonyi getting the best deals first.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto"
          noValidate
        >
          <input
            suppressHydrationWarning
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-[150px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-btn px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-green/50"
          />
          <input
            suppressHydrationWarning
            type="tel"
            placeholder="WhatsApp number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="flex-1 min-w-[150px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-btn px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-green/50"
          />
          <button
            suppressHydrationWarning
            type="submit"
            disabled={isLoading}
            className="bg-solo-green text-solo-deep-green font-semibold px-6 py-3 rounded-btn hover:bg-solo-deep-green hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Joining...' : 'Join Now'}
          </button>
        </form>

        <p className="text-white/40 text-[12px] mt-4">
          We send deals only. No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
