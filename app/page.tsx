'use client'

import { SoloLogo } from '@/components/ui/SoloLogo'
import { Rocket, Sparkles, MapPin, Hammer, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ComingSoonPage() {
    return (
        <main className="min-h-screen bg-solo-navy relative flex flex-col justify-between overflow-hidden selection:bg-solo-green/30 selection:text-solo-deep-navy">
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] aspect-square bg-solo-green/10 rounded-full blur-[120px] pointer-events-none opacity-50 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-full max-w-[800px] aspect-square bg-solo-mint/5 rounded-full blur-[100px] pointer-events-none opacity-40" />

            {/* Top Header Section */}
            <header className="relative z-10 w-full pt-8 px-6 lg:px-12 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <SoloLogo variant="reversed" size="lg" showTagline={false} />
                </div>
                <div className="hidden sm:flex items-center gap-2 text-solo-mint/80 bg-white/5 border border-white/10 px-4 py-2 rounded-[20px] backdrop-blur-sm text-sm font-medium">
                    <MapPin className="w-4 h-4 text-solo-green" />
                    Enugu & Abakaliki
                </div>
            </header>

            {/* Main Content wrapper */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-sm font-extrabold tracking-widest uppercase mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 shadow-[0_0_15px_rgba(255,184,0,0.2)]">
                        <Hammer className="w-4 h-4" />
                        Website Under Construction
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-in slide-in-from-bottom-6 fade-in duration-700">
                        We are upgrading the <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-solo-green to-solo-mint-bdr">Gadget Experience.</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-solo-mint/80 text-lg md:text-xl font-medium mb-12 max-w-2xl animate-in slide-in-from-bottom-8 fade-in duration-1000">
                        The Number 1 Gadget Hub in South East Nigeria is currently undergoing a massive digital overhaul to serve you better. We remain fully open for business and rapid deliveries via our direct WhatsApp line.
                    </p>

                    {/* Giant WhatsApp Button */}
                    <div className="w-full max-w-md animate-in zoom-in-95 fade-in duration-1000 delay-300">
                        <Link
                            href="https://wa.me/2349066994388?text=Hello%20Solo%20Store!%20I%20want%20to%20make%20an%20inquiry%20or%20purchase."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-center gap-4 w-full h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-lg rounded-[24px] shadow-[0_0_40px_rgba(37,211,102,0.4)] hover:shadow-[0_0_60px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                            <MessageCircle className="w-7 h-7 fill-white/20" />
                            Chat with us on WhatsApp
                        </Link>

                        <p className="mt-4 text-sm font-semibold text-solo-mint/50 tracking-wide">
                            Fast Response &bull; Instant Support &bull; Secure Ordering
                        </p>
                    </div>

                    {/* Value Props */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-bold text-solo-mint/70 animate-in fade-in duration-1000 delay-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-solo-green shadow-[0_0_8px_rgba(0,200,150,0.8)]"></div>
                            Premium Gadgets
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-solo-green shadow-[0_0_8px_rgba(0,200,150,0.8)]"></div>
                            Device Swaps
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-solo-green shadow-[0_0_8px_rgba(0,200,150,0.8)]"></div>
                            Fast Delivery
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Section */}
            <footer className="relative z-10 w-full py-8 px-6 text-center border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-solo-mint/40 text-sm font-semibold">
                    &copy; {new Date().getFullYear()} Solo Store. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <Link href="/admin" className="text-solo-mint/40 hover:text-solo-green transition-colors text-xs font-bold uppercase tracking-widest hidden sm:block">
                        Admin Login
                    </Link>
                </div>
            </footer>
        </main>
    )
}
