'use client'

import { testimonials } from '@/lib/mock-data'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={star <= rating ? 'text-solo-green' : 'text-gray-300'}
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-solo-soft-gray py-16 max-md:py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        <h2 className="text-2xl font-bold text-solo-navy mb-8 text-center">
          What our customers say
        </h2>

        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-card p-6"
            >
              <StarRating rating={testimonial.rating} />

              <p className="text-solo-body-text italic mt-3 mb-4 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-solo-navy">
                  {testimonial.customerName}
                </span>
                <span className="text-solo-muted text-[13px]">
                  {testimonial.city}
                </span>
                {testimonial.isVerifiedPurchase && (
                  <span className="bg-solo-mint text-solo-deep-green text-[11px] rounded-pill px-2 py-0.5">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
