'use client'

import { SoloLogo } from '@/components/ui/SoloLogo'
import {
    MapPin,
    Hammer,
    MessageCircle,
    CreditCard,
    Truck,
    RefreshCw,
    ShieldCheck,
    Calendar,
    Gift,
} from 'lucide-react'
import Link from 'next/link'

const upcomingFeatures = [
    {
        icon: CreditCard,
        title: 'Buy Now, Pay Later',
        description: 'Spread payments across 3–12 months with zero stress.',
    },
    {
        icon: Truck,
        title: 'Same-Day Delivery',
        description: 'Order today, receive today — across Enugu & Abakaliki.',
    },
    {
        icon: RefreshCw,
        title: 'Device Swap Program',
        description: 'Trade in your old device and upgrade for less.',
    },
    {
        icon: ShieldCheck,
        title: 'Verified Authentic',
        description: 'Every product certified genuine with full warranty.',
    },
    {
        icon: Gift,
        title: 'Loyalty Rewards',
        description: 'Earn SoloPoints on every purchase and redeem for discounts.',
    },
    {
        icon: Calendar,
        title: 'Flash Deal Drops',
        description: 'Exclusive time-limited offers on premium gadgets.',
    },
]

export default function ComingSoonPage() {
    return (
        <main className="min-h-screen bg-solo-navy relative flex flex-col justify-between overflow-hidden selection:bg-solo-green/30 selection:text-white">
            {/* Background ambience */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-solo-green/[0.07] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-solo-mint/[0.04] rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 w-full pt-8 pb-4 px-6 lg:px-12 flex justify-between items-center">
                <SoloLogo variant="reversed" size="sm" showTagline={false} />
                <div className="hidden sm:flex items-center gap-2 text-solo-mint/70 bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-solo-green" />
                    Enugu & Abakaliki
                </div>
            </header>

            {/* Hero */}
            <section className="relative z-10 flex flex-col items-center text-center px-6 pt-12 pb-8 lg:pt-20 lg:pb-14">
                {/* Construction badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB800]/[0.08] border border-[#FFB800]/20 text-[#FFB800] text-[10px] sm:text-xs font-extrabold tracking-[0.15em] uppercase mb-8 animate-in slide-in-from-bottom-3 fade-in duration-500">
                    <Hammer className="w-3.5 h-3.5" />
                    Under Construction
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1] max-w-2xl animate-in slide-in-from-bottom-4 fade-in duration-700">
                    A new way to shop{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-solo-green to-solo-mint-bdr">
                        gadgets online
                    </span>{' '}
                    is coming.
                </h1>

                <p className="mt-6 text-solo-mint/60 text-sm sm:text-base md:text-lg font-medium max-w-xl leading-relaxed animate-in slide-in-from-bottom-5 fade-in duration-900">
                    We are building the most seamless gadget shopping experience in South East Nigeria. While we finish up, you can shop with us directly on WhatsApp.
                </p>

                {/* WhatsApp CTA — refined, not oversized */}
                <Link
                    href="https://wa.me/2349066994388?text=Hello%20Solo%20Store!%20I%20want%20to%20make%20an%20inquiry%20or%20purchase."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-10 inline-flex items-center gap-3 px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-full shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-0.5 animate-in zoom-in-95 fade-in duration-700 delay-200"
                >
                    <MessageCircle className="w-5 h-5" />
                    Shop via WhatsApp
                    <span className="text-white/50 text-xs font-medium">→</span>
                </Link>

                <p className="mt-3 text-[11px] font-semibold text-solo-mint/35 tracking-wider uppercase">
                    Instant replies &bull; Secure ordering &bull; Fast delivery
                </p>
            </section>

            {/* Feature Preview Section */}
            <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                <div className="text-center mb-10">
                    <p className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-solo-green/70 mb-2">
                        What&apos;s Coming
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-white/90">
                        Features you&apos;ll love
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {upcomingFeatures.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.title}
                                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-solo-green/20 rounded-2xl p-4 sm:p-5 transition-all duration-300"
                            >
                                <div className="w-9 h-9 rounded-xl bg-solo-green/10 border border-solo-green/10 flex items-center justify-center mb-3 group-hover:bg-solo-green/15 transition-colors">
                                    <Icon className="w-4 h-4 text-solo-green" />
                                </div>
                                <h3 className="text-white font-bold text-sm mb-1 leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-solo-mint/40 text-[11px] sm:text-xs leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full py-6 px-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-solo-mint/30 text-xs font-semibold">
                    &copy; {new Date().getFullYear()} Solo Store. All rights reserved.
                </p>
                <Link
                    href="/admin"
                    className="text-solo-mint/20 hover:text-solo-mint/40 transition-colors text-[10px] font-bold uppercase tracking-[0.15em]"
                >
                    Admin
                </Link>
            </footer>
        </main>
    )
}
