'use client'

import Link from 'next/link'

const features = ['Instant Approval', '0% Interest Options', '3–12 Month Plans']

export function BnplPromo() {
  return (
    <section className="bg-solo-navy py-16 max-md:py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-8 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            {/* Tendr Label */}
            <span className="inline-block bg-white/10 text-solo-green text-[11px] tracking-widest rounded-full px-3 py-1 mb-4">
              POWERED BY TENDR
            </span>

            <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 text-balance">
              Pay as little as ₦5,000/month
            </h2>

            <p className="text-solo-mint/80 text-[15px] leading-relaxed mb-6 max-w-lg">
              Split any purchase into easy monthly instalments. Instant approval. 0% interest on select items.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="bg-white/10 text-white text-[13px] px-4 py-2 rounded-pill"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/tendr"
              className="text-solo-green font-medium hover:underline"
            >
              See how Tendr works →
            </Link>
          </div>

          {/* Right - Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <svg
              className="w-full max-w-[300px]"
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Phone Frame */}
              <rect
                x="75"
                y="30"
                width="150"
                height="240"
                rx="20"
                fill="#0D1E35"
                stroke="#00C896"
                strokeWidth="3"
              />
              {/* Screen */}
              <rect x="85" y="50" width="130" height="200" rx="8" fill="#1A2B4A" />
              {/* Status Bar */}
              <rect x="95" y="60" width="110" height="4" rx="2" fill="#00C896" opacity="0.3" />
              {/* Amount Display */}
              <rect x="95" y="90" width="80" height="24" rx="4" fill="#00C896" />
              <text x="105" y="108" fill="#0D1E35" fontSize="14" fontWeight="600">
                ₦25,000
              </text>
              {/* Progress Bar */}
              <rect x="95" y="130" width="110" height="8" rx="4" fill="#0D1E35" />
              <rect x="95" y="130" width="73" height="8" rx="4" fill="#00C896" />
              {/* Payment Options */}
              <rect x="95" y="155" width="110" height="30" rx="6" fill="#E0FBF4" opacity="0.1" />
              <rect x="95" y="195" width="110" height="30" rx="6" fill="#E0FBF4" opacity="0.1" />
              {/* Check icons */}
              <circle cx="110" cy="170" r="8" fill="#00C896" />
              <path
                d="M107 170L109 172L113 168"
                stroke="#0D1E35"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="110" cy="210" r="8" fill="#00C896" opacity="0.3" />
              {/* Pay Button */}
              <rect x="105" y="235" width="90" height="10" rx="5" fill="#00C896" opacity="0.5" />
              {/* Notch */}
              <rect x="125" y="40" width="50" height="6" rx="3" fill="#0D1E35" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
