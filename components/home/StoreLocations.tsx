'use client'

import { storeInfo } from '@/lib/mock-data'
import { MapPin, Phone, Clock } from 'lucide-react'

export function StoreLocations() {
  const stores = [storeInfo.enugu, storeInfo.abakiliki]

  return (
    <section className="py-16 max-md:py-12">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        <h2 className="text-2xl font-bold text-solo-navy mb-8">Visit Our Stores</h2>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          {stores.map((store) => (
            <div
              key={store.name}
              className="bg-white rounded-card border border-solo-mint-bdr border-l-4 border-l-solo-green p-6"
            >
              <h3 className="text-xl font-semibold text-solo-navy mb-4">
                {store.name}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-solo-muted flex-shrink-0 mt-0.5" />
                  <p className="text-[15px] text-solo-body-text">{store.address}</p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-solo-muted flex-shrink-0 mt-0.5" />
                  <p className="text-[15px] text-solo-body-text">{store.hours}</p>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-solo-muted flex-shrink-0 mt-0.5" />
                  <div className="text-[15px] text-solo-body-text">
                    <p>{store.phone1}</p>
                    <p>{store.phone2}</p>
                  </div>
                </div>
              </div>

              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-solo-green font-medium hover:underline"
              >
                Get Directions →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
